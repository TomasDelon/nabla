# Audit Bundle

Reviewed range: `47277ae..bf3a90624875c03015ea0d418619a5e77bf73a2b`
Current branch: `phase-1-markup-core`
Current HEAD at generation time: `bf3a90624875c03015ea0d418619a5e77bf73a2b`

Review source of truth: use the audit bundle commit hash to read `reports/audit/latest/*`.

Start with this order:
1. `audit.json` for task, branch, reviewed range, current HEAD, working tree status, review instructions, and reviewed-head reference URLs.
2. `git-status.txt` for current working tree state at generation time.
3. `git-log.txt` for the commit slice under review.
4. `git-show-name-only.txt` and `git-show.patch` for the actual reviewed diff.
5. `repo-tree.txt` and `package-json.txt` for repository context.

This bundle is text-only and is intended for review from GitHub without manual uploads.
