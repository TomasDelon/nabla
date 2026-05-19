# Audit Bundle

Reviewed range: `ff960479198f804f129b8dffde851d9d5bb88967..8e777dd217abf11e87573fc60e11c0c976f33c8a`
Current branch: `phase-2-workspace-core`
Current HEAD at generation time: `8e777dd217abf11e87573fc60e11c0c976f33c8a`

Review source of truth: use the audit bundle commit hash to read `reports/audit/latest/*`.

Start with this order:
1. `audit.json` for task, branch, reviewed range, current HEAD, working tree status, review instructions, and reviewed-head reference URLs.
2. `git-status.txt` for current working tree state at generation time.
3. `git-log.txt` for the commit slice under review.
4. `git-show-name-only.txt` and `git-show.patch` for the actual reviewed diff.
5. `repo-tree.txt` and `package-json.txt` for repository context.

This bundle is text-only and is intended for review from GitHub without manual uploads.
