# Audit Bundle

Reviewed range: `11efd38c48804e635ccec27dfe7c932be32fb9b2..8b2f842`
Current branch: `phase-3-editor-core`
Current HEAD at generation time: `8b2f8425bbfcaaae46511e295945c1f9616ef71b`

Review source of truth: use the audit bundle commit hash to read `reports/audit/latest/*`.

Start with this order:
1. `audit.json` for task, branch, reviewed range, current HEAD, working tree status, review instructions, and reviewed-head reference URLs.
2. `git-status.txt` for current working tree state at generation time.
3. `git-log.txt` for the commit slice under review.
4. `git-show-name-only.txt` and `git-show.patch` for the actual reviewed diff.
5. `repo-tree.txt` and `package-json.txt` for repository context.

This bundle is text-only and is intended for review from GitHub without manual uploads.
