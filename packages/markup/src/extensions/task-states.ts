import type { TaskState } from "../ast.js";

const TASK_STATE_MAP: Record<string, TaskState> = {
  " ": "unchecked",
  x: "checked",
  "-": "cancelled",
  "!": "important"
};

const TASK_STATE_TO_MARKER: Record<TaskState, string> = {
  unchecked: " ",
  checked: "x",
  cancelled: "-",
  important: "!"
};

export function parseTaskStateMarker(line: string): {
  state: TaskState;
  text: string;
} | null {
  const match = line.match(/^- \[(.)\] (.*)$/);
  if (!match) return null;

  const marker = match[1];
  const state = TASK_STATE_MAP[marker];
  if (state === undefined) return null;

  return { state, text: match[2] };
}

export function parseListMarkerPrefix(line: string): {
  rest: string;
} | null {
  if (!line.startsWith("- ")) return null;
  return { rest: line.slice(2) };
}

export function hasBracketMarker(rest: string): boolean {
  return /^\[.\] /.test(rest);
}

export function taskStateToMarker(state: TaskState): string {
  return TASK_STATE_TO_MARKER[state];
}
