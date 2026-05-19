# Audit Bundle

Reviewed range: `83d82e218fb9ae4ce48f12bbe4e9370ce0340bd6..d91fbf7`
Current branch: `phase-3-editor-core`
Current HEAD at generation time: `d91fbf70f3c83ec643c9ad83930433f1ed5532b1`

Review source of truth: use the audit bundle commit hash to read `reports/audit/latest/*`.

Start with this order:
1. `audit.json` for task, branch, reviewed range, current HEAD, working tree status, review instructions, and reviewed-head reference URLs.
2. `git-status.txt` for current working tree state at generation time.
3. `git-log.txt` for the commit slice under review.
4. `git-show-name-only.txt` and `git-show.patch` for the actual reviewed diff.
5. `repo-tree.txt` and `package-json.txt` for repository context.

This bundle is text-only and is intended for review from GitHub without manual uploads.
