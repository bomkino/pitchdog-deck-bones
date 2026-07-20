import type { Choice } from "./ui.ts";

export const FORMATS = [
  { value: "feature", label: "A scripted feature", detail: "One complete film story." },
  { value: "series", label: "A scripted series", detail: "Returning, serial, limited, or anthology television." },
] as const satisfies readonly Choice[];

export const GOALS = [
  { value: "read", label: "Get them to read it", detail: "Earn the next serious read without making a suitcase of a deck." },
  { value: "meeting", label: "Get a meeting", detail: "Give them enough to want the conversation—not every answer." },
  { value: "producer", label: "Interest a producer", detail: "Show the project and leave room for a real producing relationship." },
  { value: "creative", label: "Invite a creative partner", detail: "Open a director, talent, or collaborator conversation." },
  { value: "funding", label: "Seek funding or approval", detail: "Make the creative case. Keep unsupported money claims out." },
  { value: "team", label: "Help my team decide", detail: "A working document can tell the truth where a sales deck cannot." },
  { value: "specific", label: "Send exactly what they asked for", detail: "The current request outranks generic deck advice." },
  { value: "unsure", label: "I’m not sure yet", detail: "Start with the smallest useful version." },
] as const satisfies readonly Choice[];

export const RECIPIENTS = [
  { value: "producer", label: "Producer or development executive", detail: "A project and development conversation." },
  { value: "director", label: "Director", detail: "A creative invitation, not a pre-directed cage." },
  { value: "company", label: "Production company", detail: "A company-level development or production decision." },
  { value: "buyer", label: "Commissioner, buyer, or platform", detail: "Only through a real accepted route." },
  { value: "financier", label: "Financier or investor", detail: "Needs qualified production and finance facts." },
  { value: "fund", label: "Grant, lab, or fund", detail: "Current program rules control the pack." },
  { value: "talent", label: "Actor or representative", detail: "Role relevance and truthful attachment status matter." },
  { value: "team", label: "My own team", detail: "Keep uncertainty visible; this is a working document." },
] as const satisfies readonly Choice[];

export const ASKS = [
  { value: "pitch-deck", label: "Pitch deck", detail: "A concise project argument." },
  { value: "one-pager", label: "One-page overview", detail: "The small version really does need to stay small." },
  { value: "lookbook", label: "Lookbook", detail: "Visual intent with honest image provenance." },
  { value: "series-bible", label: "Series bible", detail: "Series logic, not an encyclopedia." },
  { value: "treatment", label: "Treatment", detail: "A current requested treatment, not free labor by momentum." },
  { value: "application", label: "Application pack", detail: "The program’s current fields, order, and limits." },
  { value: "unsure", label: "The wording is unclear", detail: "Verify the exact request before building heavily." },
] as const satisfies readonly Choice[];

export const STAGES = [
  { value: "idea", label: "Idea or premise", detail: "The core pages are still becoming real." },
  { value: "outline", label: "Outline or beat sheet", detail: "Story shape exists; a complete script or pilot does not." },
  { value: "draft", label: "A complete first draft", detail: "The whole core piece exists once." },
  { value: "revised", label: "A revised draft", detail: "The work has absorbed at least one bounded read." },
  { value: "tested", label: "Tested and revised", detail: "The current version has survived useful outside eyes." },
  { value: "packaged", label: "Already packaged", detail: "A usable deck or project pack exists." },
] as const satisfies readonly Choice[];

export const MATERIALS = [
  { value: "fresh", label: "Starting fresh", detail: "Nothing useful is on file yet." },
  { value: "notes", label: "Notes and fragments", detail: "Raw material exists; structure does not." },
  { value: "core", label: "Logline and synopsis", detail: "The core story material can be reused." },
  { value: "deck", label: "An existing deck", detail: "Reuse and rehearse before inventing more pages." },
] as const satisfies readonly Choice[];

export const ROLES = [
  { value: "writer", label: "Writer", detail: "The writing and project are the center." },
  { value: "writer-director", label: "Writer-director", detail: "Story and screen interpretation are both yours." },
  { value: "director", label: "Director", detail: "The directing idea needs a genuine job." },
  { value: "producer", label: "Producer", detail: "Creative and practical truth can sit together." },
  { value: "creator-showrunner", label: "Creator or showrunner", detail: "Series movement and authorship both matter." },
  { value: "team", label: "A team", detail: "The deck must remain useful across collaborators." },
] as const satisfies readonly Choice[];

export const SERIES_SHAPES = [
  { value: "returning", label: "Returning series", detail: "A repeatable pressure generates genuinely different episodes." },
  { value: "limited", label: "Limited series", detail: "A finite progression earns its length and lands." },
  { value: "serial", label: "Serial", detail: "One accumulating story moves through episodes." },
  { value: "anthology", label: "Anthology", detail: "The organizing principle repeats; the story changes." },
  { value: "forming", label: "Still forming", detail: "The pilot may exist, but the form beyond it is not settled." },
] as const satisfies readonly Choice[];

export const RELATIONSHIPS = [
  { value: "cold", label: "They do not know me", detail: "Orientation and proof of relevance carry more weight." },
  { value: "warm", label: "A warm introduction", detail: "The introduction opens a door; the deck still needs a job." },
  { value: "known", label: "We already know each other", detail: "Less biography. More decision-specific truth." },
  { value: "requested", label: "They requested material", detail: "The current request controls the version." },
] as const satisfies readonly Choice[];

export const RECIPIENT_SHAPES = [
  { value: "one", label: "One reader or one decision", detail: "Build one honest version." },
  { value: "several_same_decision", label: "Several people, same decision", detail: "One version may still work." },
  { value: "several_different_decisions", label: "Different people, different decisions", detail: "Share facts. Split the asks and versions." },
] as const satisfies readonly Choice[];

export const ACCESS = [
  { value: "direct_request", label: "They asked me directly", detail: "A real open route." },
  { value: "existing_relationship", label: "An existing relationship", detail: "You can send through a relationship that exists." },
  { value: "offered_introduction", label: "Someone offered an introduction", detail: "Use the introduction before a cold send." },
  { value: "representative_producer", label: "Through a rep or producer", detail: "A legitimate intermediary controls the route." },
  { value: "open_process", label: "An open call or program", detail: "Current eligibility and rules matter." },
  { value: "accepted_cold", label: "They publicly accept material", detail: "Use the stated route and limits." },
  { value: "none", label: "No real route yet", detail: "Build access before attachment theater." },
  { value: "unknown", label: "I have not checked", detail: "Verify before treating a name as a route." },
] as const satisfies readonly Choice[];

export const DELIVERIES = [
  { value: "live", label: "I’ll present it live", detail: "The room hears you; the pages can breathe." },
  { value: "read", label: "They’ll read it without me", detail: "The document must carry its own context." },
  { value: "both", label: "Live, then left behind", detail: "One file is doing two jobs. A second cut may be kinder." },
  { value: "internal", label: "Inside the team", detail: "A useful working document, not theater." },
] as const satisfies readonly Choice[];

export const ENCOUNTERS = [
  { value: "under5", label: "Under 5 minutes", detail: "A very small live spine." },
  { value: "ten", label: "About 10 minutes", detail: "Enough for a tight argument." },
  { value: "twenty", label: "About 20 minutes", detail: "More context, still one decision." },
  { value: "controlled", label: "They control the read", detail: "Navigation and reference pages can carry more." },
] as const satisfies readonly Choice[];

export const OUTSIDE_READS = [
  { value: "none", label: "No outside read yet", detail: "A complete first draft may need the right read before packaging." },
  { value: "received_not_revised", label: "Notes received; not revised", detail: "Useful evidence exists, but the current pages have not absorbed it." },
  { value: "revised_once", label: "One bounded revision", detail: "The current draft has met useful outside eyes." },
  { value: "revised_more", label: "Several useful revisions", detail: "The core work is materially tested." },
  { value: "recipient_read", label: "This recipient has read it", detail: "The deck can serve the next conversation rather than replace the script." },
] as const satisfies readonly Choice[];

export const VISUALS = [
  { value: "ready", label: "A visual language exists", detail: "The references have jobs and can travel." },
  { value: "forming", label: "It’s forming", detail: "Use a small honest visual hypothesis." },
  { value: "none", label: "Not yet", detail: "Do not let image hunting freeze the structure." },
  { value: "uncertain_rights", label: "Useful images; rights unclear", detail: "Keep disputed assets out of the traveling file." },
] as const satisfies readonly Choice[];

export const REQUIREMENTS = [
  { value: "none", label: "No exact written request", detail: "Build for the decision, not a fashionable document name." },
  { value: "current", label: "A current written request", detail: "The current fields and limits outrank defaults." },
  { value: "stale", label: "An old request", detail: "Re-check it before doing serious work." },
  { value: "ambiguous", label: "The request is ambiguous", detail: "Clarify the item and stage." },
  { value: "conflicted", label: "Two instructions disagree", detail: "Do not average contradictory rules." },
] as const satisfies readonly Choice[];

export const LIMITS = [
  { value: "under5", label: "Under 5 pages", detail: "A sharp invitation, not a complete record." },
  { value: "six10", label: "6–10 pages", detail: "A concise project argument." },
  { value: "eleven18", label: "11–18 pages", detail: "A fuller read-alone or development version." },
  { value: "no_limit", label: "No stated limit", detail: "The decision still creates a useful limit." },
] as const satisfies readonly Choice[];

export const FINANCE = [
  { value: "missing", label: "No qualified basis yet", detail: "Keep budgets, returns, tax, and recoupment claims out." },
  { value: "partial", label: "Early producer estimates", detail: "Label working figures and unknowns." },
  { value: "qualified", label: "Qualified producer-led basis", detail: "Organize facts; legal and finance validation still sit elsewhere." },
] as const satisfies readonly Choice[];

export const BOUNDARIES = [
  { value: "none", label: "No special boundary", detail: "Ordinary working conditions." },
  { value: "sensitive", label: "Sensitive or unannounced material", detail: "Make the traveling version smaller and safer." },
  { value: "images_unclear", label: "Image permission is unclear", detail: "Keep disputed images out without freezing the deck." },
  { value: "finance_unchecked", label: "Money claims are not checked", detail: "Creative case: yes. Investment theater: no." },
  { value: "substantial_unpaid", label: "Substantial custom work is unpaid", detail: "Clarify scope, use, terms, and the real decision first." },
  { value: "authority_unclear", label: "Rights or authority are unclear", detail: "Private work can continue; circulation waits." },
] as const satisfies readonly Choice[];

export const DEADLINES = [
  { value: "within_72_hours", label: "Within 72 hours", detail: "Cut to the minimum; verify the request now." },
  { value: "within_week", label: "Within a week", detail: "Reuse first. Build only what this version needs." },
  { value: "two_to_four_weeks", label: "Two to four weeks", detail: "Enough time for a proper, bounded version." },
  { value: "later", label: "More than a month", detail: "Time exists; scope still needs discipline." },
  { value: "none", label: "No deadline", detail: "Choose a useful finish line anyway." },
] as const satisfies readonly Choice[];

export const PRIORITIES = [
  { value: "smallest", label: "The smallest useful version", detail: "Earn the next step with the least material." },
  { value: "balanced", label: "A balanced version", detail: "Enough proof without becoming an archive." },
  { value: "complete", label: "A fuller read-alone version", detail: "Useful only when the reader and decision genuinely need it." },
  { value: "adaptable", label: "A reusable spine with variants", detail: "Shared facts; separate recipient-specific pages." },
] as const satisfies readonly Choice[];
