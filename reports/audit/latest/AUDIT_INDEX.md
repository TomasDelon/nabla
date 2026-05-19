# Audit Bundle

Reviewed range: `c327551ffb33854958f8785933a5780c177e8ba8..2ed92d6`
Current branch: `p2-012-workspace-shape-alignment`
Current HEAD at generation time: `2ed92d619b5d97cb01ec08abf7c2fc66780104c8`

Review source of truth: use the audit bundle commit hash to read `reports/audit/latest/*`.

Start with this order:
1. `audit.json` for task, branch, reviewed range, current HEAD, working tree status, review instructions, and reviewed-head reference URLs.
2. `git-status.txt` for current working tree state at generation time.
3. `git-log.txt` for the commit slice under review.
4. `git-show-name-only.txt` and `git-show.patch` for the actual reviewed diff.
5. `repo-tree.txt` and `package-json.txt` for repository context.

This bundle is text-only and is intended for review from GitHub without manual uploads.
