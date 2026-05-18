import { mkdir, readFile, writeFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import path from "node:path";

const cwd = process.cwd();
const auditDir = path.join(cwd, "reports", "audit", "latest");
const args = process.argv.slice(2);

function getArg(name) {
  const index = args.indexOf(name);
  if (index === -1) return undefined;
  return args[index + 1];
}

const taskId = getArg("--task");
const base = getArg("--base");
const requestedHead = getArg("--head");

if (!taskId || !base) {
  console.error("Usage: pnpm audit:bundle -- --task <TASK_ID> --base <BASE_COMMIT> [--head <HEAD_COMMIT>]");
  process.exit(1);
}

function runGit(commandArgs) {
  return execFileSync("git", commandArgs, { cwd, encoding: "utf8" }).trimEnd();
}

function safeRead(filePath) {
  try {
    return readFile(filePath, "utf8");
  } catch {
    return Promise.resolve(null);
  }
}

function rawUrlFor(ref, relPath) {
  const remote = runGit(["remote", "get-url", "origin"]);
  if (!remote.includes("github.com")) return null;

  const httpsMatch = remote.match(/^https?:\/\/github\.com\/([^/]+)\/([^/]+?)(?:\.git)?$/i);
  const sshMatch = remote.match(/^git@github\.com:([^/]+)\/([^/]+?)(?:\.git)?$/i);
  const match = httpsMatch ?? sshMatch;
  if (!match) return null;

  const owner = match[1];
  const repo = match[2];
  return `https://raw.githubusercontent.com/${owner}/${repo}/${ref}/${relPath}`;
}

async function main() {
  await mkdir(auditDir, { recursive: true });

  const branch = runGit(["branch", "--show-current"]);
  const currentHead = runGit(["rev-parse", "HEAD"]);
  const head = requestedHead ?? currentHead;
  const currentWorkingTreeStatus = runGit(["status", "--short"]);
  const reviewedRange = `${base}..${head}`;
  const stat = runGit(["diff", "--stat", reviewedRange]);
  const patch = runGit(["diff", reviewedRange]);
  const nameOnly = runGit(["diff", "--name-only", reviewedRange]);
  const log = runGit(["log", "--oneline", reviewedRange]);
  const tree = runGit(["ls-tree", "-r", "--name-only", head]);
  const packageJson = await readFile(path.join(cwd, "package.json"), "utf8");
  const progressReport = await safeRead(path.join(cwd, "reports", "IMPLEMENTATION_PROGRESS.md"));
  const timestamp = new Date().toISOString();

  const commandsUsed = [
    "git branch --show-current",
    "git rev-parse HEAD",
    "git status --short",
    `git diff --name-only ${reviewedRange}`,
    `git diff --stat ${reviewedRange}`,
    `git diff ${reviewedRange}`,
    `git log --oneline ${reviewedRange}`,
    `git ls-tree -r --name-only ${head}`,
    "git remote get-url origin"
  ];

  const rawUrls = {
    AUDIT_INDEX_MD: rawUrlFor(branch, "reports/audit/latest/AUDIT_INDEX.md"),
    audit_json: rawUrlFor(branch, "reports/audit/latest/audit.json"),
    git_show_patch: rawUrlFor(branch, "reports/audit/latest/git-show.patch"),
    git_show_name_only: rawUrlFor(branch, "reports/audit/latest/git-show-name-only.txt"),
    git_status: rawUrlFor(branch, "reports/audit/latest/git-status.txt"),
    git_log: rawUrlFor(branch, "reports/audit/latest/git-log.txt"),
    git_branch: rawUrlFor(branch, "reports/audit/latest/git-branch.txt"),
    git_show_stat: rawUrlFor(branch, "reports/audit/latest/git-show-stat.txt"),
    package_json: rawUrlFor(branch, "reports/audit/latest/package-json.txt"),
    progress_report: rawUrlFor(branch, "reports/audit/latest/progress-report.md")
  };

  const auditJson = {
    taskId,
    baseCommit: base,
    headCommit: head,
    currentBranch: branch,
    timestamp,
    currentHead,
    currentWorkingTreeStatus,
    changedFiles: nameOnly ? nameOnly.split("\n") : [],
    commandsUsed,
    rawUrls
  };

  const auditIndex = `# Audit Bundle\n\nReviewed range: \`${reviewedRange}\`\nCurrent branch: \`${branch}\`\nCurrent HEAD at generation time: \`${currentHead}\`\n\nStart with this order:\n1. \`audit.json\` for task, branch, reviewed range, current HEAD, working tree status, and raw URLs.\n2. \`git-status.txt\` for current working tree state at generation time.\n3. \`git-log.txt\` for the commit slice under review.\n4. \`git-show-name-only.txt\` and \`git-show.patch\` for the actual reviewed diff.\n5. \`repo-tree.txt\` and \`package-json.txt\` for repository context.\n\nThis bundle is text-only and is intended for review from GitHub without manual uploads.\n`;

  const files = [
    ["AUDIT_INDEX.md", auditIndex],
    ["audit.json", JSON.stringify(auditJson, null, 2) + "\n"],
    ["git-status.txt", currentWorkingTreeStatus + "\n"],
    ["git-branch.txt", branch + "\n"],
    ["git-log.txt", log + "\n"],
    ["git-show-stat.txt", stat + "\n"],
    ["git-show-name-only.txt", nameOnly + "\n"],
    ["git-show.patch", patch + "\n"],
    ["repo-tree.txt", tree + "\n"],
    ["package-json.txt", packageJson],
  ];

  if (progressReport !== null) {
    files.push(["progress-report.md", await progressReport]);
  }

  for (const [name, content] of files) {
    await writeFile(path.join(auditDir, name), content, "utf8");
  }

  console.log(`Audit bundle written to ${path.relative(cwd, auditDir)}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
