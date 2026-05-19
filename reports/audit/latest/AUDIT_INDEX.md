# Audit Bundle

Reviewed range: `200af0f4dcc55193780b6f0b4e0fb7a0cff11b85..7baee52`
Current branch: `phase-3-editor-core`
Current HEAD at generation time: `7baee527ae95c0157b107db242fdda336de97b70`

Review source of truth: use the audit bundle commit hash to read `reports/audit/latest/*`.

Start with this order:
1. `audit.json` for task, branch, reviewed range, current HEAD, working tree status, review instructions, and reviewed-head reference URLs.
2. `git-status.txt` for current working tree state at generation time.
3. `git-log.txt` for the commit slice under review.
4. `git-show-name-only.txt` and `git-show.patch` for the actual reviewed diff.
5. `repo-tree.txt` and `package-json.txt` for repository context.

This bundle is text-only and is intended for review from GitHub without manual uploads.
