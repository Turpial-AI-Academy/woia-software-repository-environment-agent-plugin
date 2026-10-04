import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

const ROOT = path.resolve(import.meta.dirname, "..");

const skillRoot = path.join(ROOT, "skills", "repository-environment");

const hasCluster = (text, patterns) => patterns.every((pattern) => pattern.test(text));
const clauses = (text) => text.split(/(?<=[.!?])\s+|\n+/);
const preservesUnaffectedEvidence = (text) => clauses(text).some((clause) =>
  hasCluster(clause, [/(?:preserv\w*|keep|retain\w*)/i, /(?:unrelated|unaffected|unchanged)/i, /configuration/i, /evidence/i, /valid/i]) &&
  !/(?:not|never)\s+(?:preserv\w*|keep|retain\w*)/i.test(clause));
const rejectsNarrativeAsExecutionProof = (text) => clauses(text).some((clause) =>
  hasCluster(clause, [/(?:prose|recollect\w*|statements?|narrative)/i, /(?:current|fresh|actual)/i, /execution/i, /(?:proof|evidence|prove|establish)/i]) &&
  /(?:not|never|cannot|insufficient)[\s\S]{0,80}(?:establish|prove|execution|proof|evidence)/i.test(clause));

test("skill enforces preserve-first and host-global safety", async () => {
  const skill = await readFile(path.join(skillRoot, "SKILL.md"), "utf8");
  assert.match(skill, /Preserve a healthy existing reproducibility system/i);
  assert.match(skill, /Do not introduce Mise.*merely for uniformity/i);
  assert.match(skill, /Never change global PATH/i);
  assert.match(skill, /Never read or print secret values/i);
  assert.match(skill, /Never destroy persistent Docker volumes/i);
  assert.match(skill, /smallest migration/i);
  assert.match(skill, /Do not report a skipped or unavailable check as passed/i);
});

test("source standard preserves repository-owned environment and equivalent-system exception", async () => {
  const standard = await readFile(path.join(skillRoot, "references", "REPOSITORY_ENVIRONMENT_STANDARD.md"), "utf8");
  assert.match(standard, /El repositorio es la fuente de verdad para su entorno de desarrollo/);
  assert.match(standard, /No imponer mise si el repositorio YA posee un entorno reproducible/);
  assert.match(standard, /El objetivo es reproducibilidad, no introducir mise por moda/);
  assert.match(standard, /No hacer refactors no relacionados/);
  assert.match(standard, /No actualizar versiones solo porque exista una versión más nueva/);
});

test("decision matrix preserves healthy package managers and supports equivalent systems", async () => {
  const matrix = await readFile(path.join(skillRoot, "references", "DECISION_MATRIX.md"), "utf8");
  assert.match(matrix, /Healthy Nix flake\/devShell, Bazel toolchain, integral Dev Container, asdf/);
  assert.match(matrix, /Existing pnpm repository works correctly.*Preserve Node \+ pnpm/s);
  assert.match(matrix, /Existing Bun repository works correctly.*Preserve Bun/s);
  assert.match(matrix, /Existing npm\/yarn repository is healthy.*Do not migrate/s);
  assert.match(matrix, /Do not add a Dev Container merely to pin Node or Python/);
});

test("implementation checklist requires discovery before migration", async () => {
  const checklist = await readFile(path.join(skillRoot, "references", "IMPLEMENTATION_CHECKLIST.md"), "utf8");
  const inventory = checklist.indexOf("Phase 1 — Inventory");
  const decide = checklist.indexOf("Phase 2 — Decide ownership");
  const implement = checklist.indexOf("Phase 3 — Minimal implementation");
  assert.ok(inventory >= 0 && decide > inventory && implement > decide);
  assert.match(checklist, /Build the environment graph and record contradictions/);
  assert.match(checklist, /Make only environment-related changes/);
  assert.match(checklist, /Check `git status`/);
});

test("Mise assets keep one package-manager strategy per profile", async () => {
  const nodePnpm = await readFile(path.join(skillRoot, "assets", "mise.node-pnpm.template.toml"), "utf8");
  const bun = await readFile(path.join(skillRoot, "assets", "mise.bun.template.toml"), "utf8");
  assert.match(nodePnpm, /node = "<NODE_VERSION>"/);
  assert.match(nodePnpm, /pnpm = "<PNPM_VERSION>"/);
  assert.doesNotMatch(nodePnpm, /^bun =/m);
  assert.match(bun, /bun = "<BUN_VERSION>"/);
  assert.doesNotMatch(bun, /^node =/m);
  assert.doesNotMatch(bun, /^pnpm =/m);
});

test("bounded amendments anchor a healthy environment and preserve unaffected evidence", async () => {
  const skill = await readFile(path.join(skillRoot, "SKILL.md"), "utf8");
  const bounded = skill.split("### Select scope and evidence")[1].split("For deep discovery")[0];
  for (const obligation of [/bounded/i, /fast.*path/i, /healthy/i, /environment/i, /repository/i, /branch/i, /source HEAD/i, /affected.*configuration/i, /cross-cutting.*invariants/i]) {
    assert.match(bounded, obligation);
  }
  assert.ok(preservesUnaffectedEvidence(bounded), "bounded work must retain valid configuration and evidence outside the affected scope");
});

test("deep discovery remains mandatory for drift and material environment or security changes", async () => {
  const skill = await readFile(path.join(skillRoot, "SKILL.md"), "utf8");
  const deep = skill.split("Take the deep path")[1].split("Load [")[0];
  for (const trigger of [/new environment contract/i, /missing durable required evidence/i, /contradictory declarations/i, /failed invariants/i, /environment drift/i, /runtime.*version/i, /lockfile/i, /services/i, /OS\/architecture/i, /CI execution/i, /public contracts/i, /persisted data\/migrations/i, /security/i, /signing\/trust/i, /deployment\/rollback/i]) {
    assert.match(deep, trigger);
  }
});

test("evidence reuse depends on unchanged invariants and fresh child-process resolution", async () => {
  const skill = await readFile(path.join(skillRoot, "SKILL.md"), "utf8");
  const validation = skill.split("## Validate")[1].split("## Report")[0];
  for (const obligation of [/actual.*executable/i, /effective.*version/i, /(?:child|inside).*process/i, /not.*infer.*parent.*shell/i, /durable.*bootstrap\/doctor.*only/i, /runtime\/version/i, /dependency.*lock/i, /service/i, /platform.*invariants/i, /no.*drift/i, /reusable/i, /invalidated/i, /freshly.*(?:executed|observed)/i, /assumptions\/inferences/i, /(?:rerun|repeat).*invalidated/i]) {
    assert.match(validation, obligation);
  }
  assert.ok(rejectsNarrativeAsExecutionProof(validation), "recollection or prose must not establish current execution proof");
});

test("authoritative references route bounded work without unconditional whole-repository replay", async () => {
  const skill = await readFile(path.join(skillRoot, "SKILL.md"), "utf8");
  const standard = await readFile(path.join(skillRoot, "references", "REPOSITORY_ENVIRONMENT_STANDARD.md"), "utf8");
  const checklist = await readFile(path.join(skillRoot, "references", "IMPLEMENTATION_CHECKLIST.md"), "utf8");
  assert.match(skill, /Load.*STANDARD.*when.*policy choice.*deep-path trigger/is);
  assert.match(skill, /references.*authoritative/i);
  for (const obligation of [/bounded/i, /deep/i, /before.*Phase 1/i]) assert.match(checklist, obligation);
  for (const obligation of [/configuración.*afectada/i, /reutiliza.*evidencia.*durable/i, /invariantes.*obligatorios/i]) assert.match(standard, obligation);
  assert.match(standard, /repositorio completo y su CI cuando.*ruta profunda/is);
  assert.doesNotMatch(standard, /Inspecciona primero el repositorio completo y su CI/);
});

test("preservation obligations accept equivalent phrasing and reject lost safety", () => {
  for (const equivalent of [
    "Preserve unrelated valid configuration and evidence.",
    "Keep unaffected configuration and evidence while they remain valid.",
    "Retain valid evidence and unchanged configuration.",
  ]) assert.ok(preservesUnaffectedEvidence(equivalent), equivalent);
  for (const lost of [
    "Keep unaffected valid configuration.",
    "Keep valid configuration and evidence.",
    "Do not preserve unrelated valid configuration and evidence.",
  ]) assert.equal(preservesUnaffectedEvidence(lost), false, lost);
});

test("execution-proof obligations accept equivalent phrasing and reject recollection approval", () => {
  for (const equivalent of [
    "A prior PASS or prose recollection is not current execution proof.",
    "Prior PASS statements or recollections do not establish current execution evidence.",
    "A narrative cannot prove fresh execution evidence.",
  ]) assert.ok(rejectsNarrativeAsExecutionProof(equivalent), equivalent);
  for (const lost of [
    "Prose recollection establishes current execution proof.",
    "Current execution evidence is available.",
    "A prose recollection is current execution proof and never needs validation.",
  ]) assert.equal(rejectsNarrativeAsExecutionProof(lost), false, lost);
});
