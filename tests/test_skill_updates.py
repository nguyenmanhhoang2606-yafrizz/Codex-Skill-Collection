import importlib.util
from pathlib import Path
import unittest
import json
import tempfile
from unittest.mock import patch

SCRIPT = Path(__file__).resolve().parents[1] / 'scripts/check_skill_updates.py'

class Updates(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        if SCRIPT.exists():
            spec = importlib.util.spec_from_file_location('updates', SCRIPT)
            cls.m = importlib.util.module_from_spec(spec)
            spec.loader.exec_module(cls.m)
        else:
            cls.m = None

    def setUp(self):
        self.assertIsNotNone(self.m, 'update checker must exist')
        self.base = 'a' * 40
        self.head = 'b' * 40
        self.manifest = {'source': 'https://github.com/example/skill', 'commit': self.base}
        self.comparison = {'status': 'ahead', 'total_commits': 1, 'commits': [{'sha': self.head, 'commit': {'message': 'Fix renderer\nDetails'}}], 'files': [{'filename': 'SKILL.md', 'status': 'modified'}, {'filename': 'package.json', 'status': 'modified'}]}

    def api(self, path, **kwargs):
        if '/compare/' in path:
            return self.comparison
        if '/commits/' in path:
            return {'sha': self.head}
        return {'default_branch': 'main'}

    def inspect(self, reviews=None):
        return self.m.inspect_skill('demo', self.manifest, self.api, reviews or {})

    def test_same_commit(self):
        self.head = self.base
        self.assertEqual(self.inspect()['status'], 'current')

    def test_changes_are_evidence_not_quality_claims(self):
        result = self.inspect()
        self.assertEqual(result['status'], 'update')
        self.assertIn('instructions', result['categories'])
        self.assertIn('dependencies', result['categories'])
        report = self.m.render_report([result])
        self.assertIn('Chưa đánh giá chất lượng', report)
        self.assertIn('SKILL.md', report)
        self.assertIn('Fix renderer', report)

    def test_errors_are_not_current(self):
        def broken(*args, **kwargs):
            raise RuntimeError('HTTP 404')
        result = self.m.inspect_skill('demo', self.manifest, broken, {})
        self.assertEqual(result['status'], 'error')
        self.assertIn('404', result['error'])

    def test_diverged_requires_review(self):
        self.comparison['status'] = 'diverged'
        self.assertEqual(self.inspect()['status'], 'manual')

    def test_truncated_comparison_is_flagged(self):
        self.comparison['files'] = [{'filename': f'x{i}', 'status': 'modified'} for i in range(300)]
        self.assertTrue(self.inspect()['incomplete'])

    def test_scoped_unrelated_update(self):
        self.manifest['upstream_path'] = 'skills/demo'
        self.assertEqual(self.inspect()['status'], 'unrelated')

    def test_rename_out_of_scope_counts(self):
        self.manifest['upstream_path'] = 'skills/demo'
        self.comparison['files'] = [{'filename': 'archive/a.md', 'previous_filename': 'skills/demo/SKILL.md', 'status': 'renamed'}]
        self.assertEqual(self.inspect()['status'], 'update')

    def test_incomplete_scoped_result_not_called_unrelated(self):
        self.manifest['upstream_path'] = 'skills/demo'
        self.comparison['files'] = [{'filename': f'x{i}'} for i in range(300)]
        self.assertEqual(self.inspect()['status'], 'manual')

    def test_review_requires_both_commits(self):
        reviews = {'demo': {'base': self.base, 'head': self.head, 'decision': 'defer', 'report': 'research/reviews/demo.md'}}
        self.assertTrue(self.inspect(reviews)['reviewed'])
        reviews['demo']['base'] = 'c' * 40
        self.assertFalse(self.inspect(reviews)['reviewed'])

    def test_source_validation(self):
        self.manifest['source'] = 'https://evil.example/example/skill'
        self.assertEqual(self.inspect()['status'], 'error')

    def test_notification_dedup_and_new_evidence(self):
        calls = []
        issue = {'number': 7, 'body': self.m.MARKER + '\nold', 'state': 'open', 'user': {'login': 'github-actions[bot]'}}
        def api(path, method='GET', data=None):
            calls.append((method, path, data))
            if method == 'GET': return [issue]
            return {'number': 7}
        body = self.m.MARKER + '\nnew'
        self.m.sync_issue(api, 'owner/repo', body, True)
        self.assertEqual(sum(method == 'POST' for method, _, _ in calls), 1)
        issue['body'] = body
        calls.clear()
        self.m.sync_issue(api, 'owner/repo', body, True)
        self.assertTrue(all(method == 'GET' for method, _, _ in calls))

    def test_issue_creation_has_full_report(self):
        calls = []
        body = self.m.MARKER + '\nreport'
        def api(path, method='GET', data=None):
            calls.append((method, data))
            return [] if method == 'GET' else {'number': 42}
        self.assertEqual(self.m.sync_issue(api, 'owner/repo', body, True), 'created #42')
        self.assertEqual(calls[-1][1]['body'], body)

    def test_issue_closes_when_all_sources_current(self):
        changes = []
        def api(path, method='GET', data=None):
            if method == 'GET':
                return [{'number': 7, 'body': self.m.MARKER + 'old', 'state': 'open', 'user': {'login': 'github-actions[bot]'}}]
            changes.append((method, data))
            return {}
        self.m.sync_issue(api, 'owner/repo', self.m.MARKER + 'current', False)
        self.assertEqual(changes[-1][1]['state'], 'closed')

    def test_comment_failure_does_not_save_new_body(self):
        changes = []
        def api(path, method='GET', data=None):
            if method == 'GET':
                return [{'number': 7, 'body': self.m.MARKER + 'old', 'state': 'open', 'user': {'login': 'github-actions[bot]'}}]
            changes.append(method)
            raise RuntimeError('permission denied')
        with self.assertRaises(RuntimeError):
            self.m.sync_issue(api, 'owner/repo', self.m.MARKER + 'new', True)
        self.assertNotIn('PATCH', changes)

    def test_retry_after_patch_failure_does_not_duplicate_comment(self):
        comments = []
        def api(path, method='GET', data=None):
            if method == 'GET':
                if '/comments?' in path:
                    return comments
                return [{'number': 7, 'body': self.m.MARKER + 'old', 'state': 'open', 'user': {'login': 'github-actions[bot]'}}]
            if method == 'POST':
                comments.append({'body': data['body'], 'user': {'login': 'github-actions[bot]'}})
                return {}
            raise RuntimeError('HTTP 503')
        for _ in range(2):
            with self.assertRaises(RuntimeError):
                self.m.sync_issue(api, 'owner/repo', self.m.MARKER + 'new', True)
        self.assertEqual(len(comments), 1)

    def test_malformed_source_is_an_error(self):
        self.manifest['source'] = None
        self.assertEqual(self.inspect()['status'], 'error')

    def test_null_review_is_an_error(self):
        self.assertEqual(self.inspect({'demo': None})['status'], 'error')

    def test_bad_global_reviews_do_not_block_healthy_skill(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            (root / 'research').mkdir()
            (root / 'research/demo-source.json').write_text(json.dumps(self.manifest))
            (root / 'research/update-reviews.json').write_text('{broken')
            with patch('sys.argv', ['check', '--root', str(root), '--output', str(root / 'reports')]), patch.object(self.m, 'github', self.api):
                self.assertEqual(self.m.main(), 1)
            results = json.loads((root / 'reports/skill-updates.json').read_text())['skills']
            self.assertTrue(any(r['status'] == 'error' for r in results))
            self.assertTrue(any(r['name'] == 'demo' and r['status'] == 'update' for r in results))

    def test_no_issue_when_no_updates(self):
        calls = []
        def api(path, method='GET', data=None):
            calls.append(method)
            return []
        self.m.sync_issue(api, 'owner/repo', self.m.MARKER, False)
        self.assertEqual(calls, ['GET'])

if __name__ == '__main__':
    unittest.main()
