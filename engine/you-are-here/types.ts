export type AccessRoute =
  | "direct_request" | "existing_relationship" | "offered_introduction"
  | "representative_producer" | "open_process" | "accepted_cold"
  | "no_unsolicited" | "none" | "unknown";
export type AuthorityState = "owns_controls" | "authorised" | "shared_unclear" | "third_party_unclear";
export type FeatureStage = "idea" | "outline" | "partial" | "first_draft" | "revised" | "tested" | "packaged";
export type EpisodicStage = "premise" | "outline" | "partial_pilot" | "complete_pilot" | "tested_pilot" | "overview" | "pitch_document" | "packaged";
export type SeriesShape = "returning" | "limited" | "serial" | "anthology" | "forming" | "unknown";
