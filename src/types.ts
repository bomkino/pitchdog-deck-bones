import type { DeckBonesResult, EvaluatedSection } from "../engine/deck-bones/index.ts";

export type Ride = "quick" | "expert";
export type Phase = "landing" | "flow" | "result";

export interface DeckAnswers {
  format?: "feature" | "series";
  goal?: "read" | "meeting" | "producer" | "creative" | "funding" | "team" | "specific" | "unsure";
  recipient?: "producer" | "director" | "company" | "buyer" | "financier" | "fund" | "talent" | "team";
  specificAsk?: "pitch-deck" | "one-pager" | "lookbook" | "series-bible" | "treatment" | "application" | "unsure";
  stage?: "idea" | "outline" | "draft" | "revised" | "tested" | "packaged";
  materials?: "fresh" | "notes" | "core" | "deck";
  role?: "writer" | "writer-director" | "director" | "producer" | "creator-showrunner" | "team";
  seriesShape?: "returning" | "limited" | "serial" | "anthology" | "forming";
  relationship?: "cold" | "warm" | "known" | "requested";
  recipientShape?: "one" | "several_same_decision" | "several_different_decisions";
  access?: "direct_request" | "existing_relationship" | "offered_introduction" | "representative_producer" | "open_process" | "accepted_cold" | "none" | "unknown";
  delivery?: "live" | "read" | "both" | "internal";
  encounter?: "under5" | "ten" | "twenty" | "controlled";
  outsideRead?: "none" | "received_not_revised" | "revised_once" | "revised_more" | "recipient_read";
  visuals?: "ready" | "forming" | "none" | "uncertain_rights";
  requirementStatus?: "none" | "current" | "stale" | "ambiguous" | "conflicted";
  pageLimit?: "under5" | "six10" | "eleven18" | "no_limit";
  financeBasis?: "missing" | "partial" | "qualified";
  boundaries: string[];
  deadline?: "within_72_hours" | "within_week" | "two_to_four_weeks" | "later" | "none";
  priority?: "smallest" | "balanced" | "complete" | "adaptable";
}

export interface PlannedSection extends EvaluatedSection { name: string; job: string; }
export interface DeckPlan {
  raw: DeckBonesResult;
  headline: string;
  intro: string;
  versionBrief: Array<[string, string]>;
  sections: PlannedSection[];
  optional: PlannedSection[];
  reasons: string[];
  expertNotes: string[];
  leaveOut: string[];
  preDeckAction?: string;
}

export interface AppState {
  phase: Phase;
  ride?: Ride;
  step: number;
  answers: DeckAnswers;
  result?: DeckPlan;
}
