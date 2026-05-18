
# Handoff Checklist

## Before Phase 1

- [ ] Spec pack extracted.
- [ ] Implementation control pack extracted.
- [ ] Git repo initialized.
- [ ] Initial commit exists.
- [ ] Branch `phase-1-markup-core` exists.
- [ ] Package manager chosen, default pnpm.
- [ ] Agent has read AGENTS.md.
- [ ] Spec version validated.

## Before Phase 2

- [ ] `@nabla/markup` types compile.
- [ ] Parser fixtures pass.
- [ ] Serializer fixtures pass.
- [ ] Diagnostics fixtures pass.
- [ ] Protected region tests pass.
- [ ] `pnpm typecheck` passes.
- [ ] `pnpm lint` passes or lint is not configured yet with explanation.
- [ ] `pnpm build` passes.
- [ ] `pnpm check:boundaries` passes.
- [ ] Git working tree is clean.

## Before Phase 3

- [ ] Workspace fixtures pass.
- [ ] Link resolution works.
- [ ] Heading slugs work.
- [ ] Block id index works.
- [ ] Transclusion cycles detected.
- [ ] Depth limit works.
- [ ] `pnpm test:workspace` passes.
- [ ] `pnpm typecheck` passes.
- [ ] `pnpm lint` passes or lint is not configured yet with explanation.
- [ ] `pnpm build` passes.
- [ ] `pnpm check:boundaries` passes.
- [ ] Git working tree is clean.

## Before Phase 4

- [ ] Editor adapter saves through parser + serializer.
- [ ] Source preservation tests pass.
- [ ] Visual fold state updates source.
- [ ] Missing links are visible.
- [ ] `pnpm test` passes.
- [ ] `pnpm typecheck` passes.
- [ ] `pnpm lint` passes or lint is not configured yet with explanation.
- [ ] `pnpm build` passes.
- [ ] `pnpm check:boundaries` passes.
- [ ] Git working tree is clean.

## Before Phase 5

- [ ] Components render semantic props.
- [ ] Components do not define grammar.
- [ ] Component tests pass.
- [ ] `pnpm test` passes.
- [ ] `pnpm typecheck` passes.
- [ ] `pnpm lint` passes or lint is not configured yet with explanation.
- [ ] `pnpm build` passes.
- [ ] `pnpm check:boundaries` passes.
- [ ] Git working tree is clean.

## Before Full App Handoff

- [ ] Core packages stable.
- [ ] No out-of-scope features added.
- [ ] Validation report exists.
- [ ] Latest commit hash reported.
- [ ] Git working tree is clean.
