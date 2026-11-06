# Skill update monitoring

Approved direction: automated weekly checks plus manual execution, without a paid AI API or automatic installation. Monday 09:00 Asia/Ho_Chi_Minh is Monday 02:00 UTC (GitHub may delay schedules).

Use existing research/*-source.json records as the registry. Fetch upstream default branch or optional tracking_ref, compare exact installed/upstream commits, and report changed files, commit subjects, compatibility concerns, links, and incomplete evidence. Optional upstream_path scopes monorepo skills. Never execute upstream code during monitoring.

Generate Vietnamese Markdown and machine-readable JSON artifacts. Maintain one bot-owned GitHub Issue; post a notification comment only when evidence changes. Distinguish source failures from no update. A new head in an unrelated monorepo folder is not a skill update. No automated quality claims: Codex reviews actual diffs and tests before recommending whole/partial update, deferral or rejection. Related files/dependencies must be assessed together.

AGENTS.md makes Codex run a fresh read-only check at task start. Store human-reviewed base/head pairs and report paths in research/update-reviews.json to avoid repeated advice. New upstream heads require a new review. Opening a UI alone does not trigger Codex.

Alternatives: external AI API would fully automate prose judgment but needs credentials/cost; local-only cron stops with cloud lifetime. GitHub Actions is selected for independent scheduling and native notifications. Default Actions token only, contents read and issues write. GitHub plan quotas and notification preferences still apply.
