# Audit Bundle

Reviewed range: `9d8a2ca45038f0bb93930d792a8f6a37f44c84b3..170e67c`
Current branch: `phase-3-editor-core`
Current HEAD at generation time: `170e67c2a2f451b169ce763cdd58f6a076bf1dcf`

Review source of truth: use the audit bundle commit hash to read `reports/audit/latest/*`.

Start with this order:
1. `audit.json` for task, branch, reviewed range, current HEAD, working tree status, review instructions, and reviewed-head reference URLs.
2. `git-status.txt` for current working tree state at generation time.
3. `git-log.txt` for the commit slice under review.
4. `git-show-name-only.txt` and `git-show.patch` for the actual reviewed diff.
5. `repo-tree.txt` and `package-json.txt` for repository context.

This bundle is text-only and is intended for review from GitHub without manual uploads.
