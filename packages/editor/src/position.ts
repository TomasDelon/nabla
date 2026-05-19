export interface SourcePosition {
  readonly offset: number;
}

export interface EditorPosition {
  readonly offset: number;
}

export function isValidOffset(offset: number): boolean {
  return Number.isInteger(offset) && offset >= 0;
}

export function clampOffset(offset: number, maxOffset: number): number {
  if (!isValidOffset(maxOffset)) {
    throw new RangeError("Offset maximum must be a non-negative integer.");
  }

  if (!Number.isFinite(offset)) {
    throw new RangeError("Offset must be a finite number.");
  }

  if (offset <= 0) {
    return 0;
  }

  if (offset >= maxOffset) {
    return maxOffset;
  }

  return Math.trunc(offset);
}

export function createSourcePosition(offset: number): SourcePosition {
  if (!isValidOffset(offset)) {
    throw new RangeError("Source offset must be a non-negative integer.");
  }

  return { offset };
}

export function createEditorPosition(offset: number): EditorPosition {
  if (!isValidOffset(offset)) {
    throw new RangeError("Editor offset must be a non-negative integer.");
  }

  return { offset };
}

export function sourceToEditorPosition(position: SourcePosition): EditorPosition {
  return createEditorPosition(position.offset);
}

export function editorToSourcePosition(position: EditorPosition): SourcePosition {
  return createSourcePosition(position.offset);
}
