# Skill Updates Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Track many upstream skills and surface evidence for selective updates.
**Architecture:** Python standard library reads source manifests and GitHub REST APIs. Actions schedules reports and a deduplicated bot Issue; Codex performs the qualitative review.
**Tech Stack:** Python 3.12, unittest, GitHub Actions.
**Spec:** docs/superpowers/specs/2026-11-06-skill-updates-design.md

## Global Constraints
- No AI API, no automatic installation, no upstream code execution.
- Monday 02:00 UTC; manual dispatch also supported.
- Preserve vendored sources and lockfiles.

## Review Focus
- Unreachable/deleted upstream must be an error, never up-to-date.
- Diverged history and truncated compare results require manual review.
- A repeat run must not spam notifications.
- Subdirectory filtering must include renamed/deleted paths.
- Recorded review must match both installed and latest commits.

## Task 1: Checker and tests
Files: scripts/check_skill_updates.py, tests/test_skill_updates.py.
Interfaces: inspect_skill(name, manifest, api, reviews) -> dict; render_report(results) -> str; sync_issue(api, repository, body, actionable) -> str.
- [x] Write tests for unchanged/new/diverged/error/scoped updates, review matching, report warnings and notification idempotence.
- [x] Run unittest and observe missing implementation failure.
- [x] Implement checker, bounded API calls, stable report, CLI JSON/Markdown output and optional Issue sync.
- [x] Run full unittest suite and live public read-only check.

## Task 2: Automation and instructions
Files: .github/workflows/skill-updates.yml, AGENTS.md, README.md, research/update-reviews.json.
- [x] Add scheduled/manual workflow, pull-request tests, push activation, least-privilege token, artifact retention and failure summaries.
- [x] Document registry extension, notifications, review recording and partial-update dependencies.
- [x] Run full tests, review changes, commit/push, verify actual Actions run where accessible.

## Execution evidence
- Existing isolated cloud checkout reused; inline implementation authorized by user.
- Initial checker tests failed with missing implementation, then passed.
- Independent review found retry notification duplication and malformed review/manifest isolation failures.
- Both reproduced in regression tests and fixed; 19 tests pass.
- Live upstream check: installed teardown is current; comparison against previous upstream commit detects 7 changed files.
- Plan tasks complete locally; GitHub activation and first run are verified separately after push.
- No AI credentials, source upgrades, or environment publication are part of this change.
