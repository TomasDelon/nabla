# Audit Bundle

Reviewed range: `77879ef3d5e541cbede78cd733b66053f6ef5a66..fa29842`
Current branch: `phase-3-editor-core`
Current HEAD at generation time: `fa2984236dd3f0a511a606715aecfd7366cd414a`

Review source of truth: use the audit bundle commit hash to read `reports/audit/latest/*`.

Start with this order:
1. `audit.json` for task, branch, reviewed range, current HEAD, working tree status, review instructions, and reviewed-head reference URLs.
2. `git-status.txt` for current working tree state at generation time.
3. `git-log.txt` for the commit slice under review.
4. `git-show-name-only.txt` and `git-show.patch` for the actual reviewed diff.
5. `repo-tree.txt` and `package-json.txt` for repository context.

This bundle is text-only and is intended for review from GitHub without manual uploads.
