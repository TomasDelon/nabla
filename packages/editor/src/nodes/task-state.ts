import type { TaskState } from "@nabla/markup";

export const NABLA_TASK_STATE_NODE_VIEW = "node-safe-adapter";

export interface EditorTaskState {
  readonly index: number;
  readonly line: number;
  readonly state: TaskState;
  readonly text: string;
}

const TASK_STATE_ORDER: readonly TaskState[] = [
  "unchecked",
  "checked",
  "cancelled",
  "important",
];

const TASK_STATE_MARKERS: Readonly<Record<TaskState, string>> = Object.freeze({
  unchecked: " ",
  checked: "x",
  cancelled: "-",
  important: "!",
});

const MARKER_TO_TASK_STATE: Readonly<Record<string, TaskState>> = Object.freeze({
  " ": "unchecked",
  x: "checked",
  "-": "cancelled",
  "!": "important",
});

const TASK_STATE_LINE_PATTERN = /^(?<indent>\s*)(?<bullet>(?:[-*+])|(?:\d+\.)) \[(?<marker>[ x\-!])\] (?<text>.*)$/;

type TaskStateMatch = {
  readonly indent: string;
  readonly bullet: string;
  readonly marker: string;
  readonly text: string;
};

function parseTaskStateLine(line: string): TaskStateMatch | null {
  const match = line.match(TASK_STATE_LINE_PATTERN);
  if (!match?.groups) {
    return null;
  }

  const marker = match.groups.marker;
  if (!(marker in MARKER_TO_TASK_STATE)) {
    return null;
  }

  return {
    indent: match.groups.indent,
    bullet: match.groups.bullet,
    marker,
    text: match.groups.text,
  };
}

export function getTaskStatesFromMarkdown(markdown: string): readonly EditorTaskState[] {
  const lines = markdown.split("\n");
  const tasks: EditorTaskState[] = [];

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
    const parsed = parseTaskStateLine(lines[lineIndex]);
    if (!parsed) {
      continue;
    }

    tasks.push({
      index: tasks.length,
      line: lineIndex,
      state: MARKER_TO_TASK_STATE[parsed.marker],
      text: parsed.text,
    });
  }

  return tasks;
}

export function cycleTaskState(state: TaskState): TaskState {
  const currentIndex = TASK_STATE_ORDER.indexOf(state);
  const nextIndex = (currentIndex + 1) % TASK_STATE_ORDER.length;
  return TASK_STATE_ORDER[nextIndex];
}

export function setTaskStateInMarkdown(
  markdown: string,
  index: number,
  state: TaskState,
): string {
  const lines = markdown.split("\n");
  let taskIndex = 0;

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
    const parsed = parseTaskStateLine(lines[lineIndex]);
    if (!parsed) {
      continue;
    }

    if (taskIndex === index) {
      lines[lineIndex] = `${parsed.indent}${parsed.bullet} [${TASK_STATE_MARKERS[state]}] ${parsed.text}`;
      return lines.join("\n");
    }

    taskIndex += 1;
  }

  throw new RangeError(`Task state index out of range: ${index}`);
}

export function toggleTaskStateInMarkdown(markdown: string, index: number): string {
  const tasks = getTaskStatesFromMarkdown(markdown);
  const task = tasks[index];
  if (!task) {
    throw new RangeError(`Task state index out of range: ${index}`);
  }

  return setTaskStateInMarkdown(markdown, index, cycleTaskState(task.state));
}

export function getTaskStateNodeViews() {
  return Object.freeze({
    taskState: NABLA_TASK_STATE_NODE_VIEW,
  });
}
