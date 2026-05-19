import type { TaskStateValue } from "./types.js";

export const TASK_STATE_ORDER: readonly TaskStateValue[] = [
  "unchecked",
  "checked",
  "cancelled",
  "important",
];
Object.freeze(TASK_STATE_ORDER);

export const TASK_STATE_MARKERS: Record<TaskStateValue, string> = {
  unchecked: " ",
  checked: "x",
  cancelled: "-",
  important: "!",
};
Object.freeze(TASK_STATE_MARKERS);

export const TASK_STATE_LABELS: Record<TaskStateValue, string> = {
  unchecked: "Unchecked",
  checked: "Checked",
  cancelled: "Cancelled",
  important: "Important",
};
Object.freeze(TASK_STATE_LABELS);

export function getNextTaskState(current: TaskStateValue): TaskStateValue {
  const index = TASK_STATE_ORDER.indexOf(current);
  return TASK_STATE_ORDER[(index + 1) % TASK_STATE_ORDER.length];
}

export interface TaskStateCheckboxProps {
  readonly state: TaskStateValue;
  readonly text: string;
  readonly onChange: (newState: TaskStateValue) => void;
}

export function TaskStateCheckbox({
  state,
  text,
  onChange,
}: TaskStateCheckboxProps) {
  const nextState = getNextTaskState(state);

  return (
    <label className="nabla-task-state">
      <input
        type="checkbox"
        className="nabla-task-state__input"
        checked={state === "checked"}
        data-task-state={state}
        onChange={() => onChange(nextState)}
        aria-label={`${TASK_STATE_LABELS[state]}: ${text}`}
      />
      <span className="nabla-task-state__text">{text}</span>
    </label>
  );
}
