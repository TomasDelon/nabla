# Audit Bundle

Reviewed range: `e3b836e63272978034c38051bc6198eb1a67e3fe..4ded6bf`
Current branch: `p2-003-heading-slug-index`
Current HEAD at generation time: `4ded6bf512648da528b9e05b08161e2526f9b24a`

Review source of truth: use the audit bundle commit hash to read `reports/audit/latest/*`.

Start with this order:
1. `audit.json` for task, branch, reviewed range, current HEAD, working tree status, review instructions, and reviewed-head reference URLs.
2. `git-status.txt` for current working tree state at generation time.
3. `git-log.txt` for the commit slice under review.
4. `git-show-name-only.txt` and `git-show.patch` for the actual reviewed diff.
5. `repo-tree.txt` and `package-json.txt` for repository context.

This bundle is text-only and is intended for review from GitHub without manual uploads.
