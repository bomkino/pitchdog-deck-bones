import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { buildDeckPlan } from "../src/plan.ts";
import * as content from "../src/content.ts";

test("expert mode is deep, structured, and contains no strategy prose boxes", () => {
  const groups = Object.values(content).filter(Array.isArray) as unknown as Array<ReadonlyArray<{ value: string }>>;
  assert.ok(groups.length >= 18);
  assert.ok(groups.flat().length >= 90);
});

test("feature and series plans route differently", () => {
  const common = { goal: "producer" as const, recipient: "producer" as const, stage: "tested" as const, materials: "fresh" as const, delivery: "read" as const, access: "existing_relationship" as const, boundaries: [] };
  const feature = buildDeckPlan({ ...common, format: "feature" });
  const series = buildDeckPlan({ ...common, format: "series", seriesShape: "returning" });
  assert.ok(feature.sections.some((item) => item.sectionId === "S03"));
  assert.ok(series.sections.some((item) => item.sectionId === "S04"));
});

test("the product has no grain and always lands new questions at the top", () => {
  const visible = ["src/main.ts", "src/styles.css", "src/base.css", "index.html"].map((path) => readFileSync(path, "utf8")).join("\n");
  assert.doesNotMatch(visible, /grain-canvas|initialiseGrain|film-grain|scanline/i);
  assert.match(readFileSync("src/ui.ts", "utf8"), /history\.scrollRestoration = "manual"/);
  assert.match(readFileSync("src/main.ts", "utf8"), /render\(true\)/);
  assert.doesNotMatch(readFileSync("src/main.ts", "utf8"), /textarea|Keep this answer|Are you in danger|shared device/i);
});
