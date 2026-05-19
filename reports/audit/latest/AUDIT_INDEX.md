# Audit Bundle

Reviewed range: `0ac594df137679bc63246f45d951b22b8925dfec..3eecf29`
Current branch: `phase-3-editor-core`
Current HEAD at generation time: `3eecf2995e6ea67ee99eb5c55e80583598c4a420`

Review source of truth: use the audit bundle commit hash to read `reports/audit/latest/*`.

Start with this order:
1. `audit.json` for task, branch, reviewed range, current HEAD, working tree status, review instructions, and reviewed-head reference URLs.
2. `git-status.txt` for current working tree state at generation time.
3. `git-log.txt` for the commit slice under review.
4. `git-show-name-only.txt` and `git-show.patch` for the actual reviewed diff.
5. `repo-tree.txt` and `package-json.txt` for repository context.

This bundle is text-only and is intended for review from GitHub without manual uploads.
