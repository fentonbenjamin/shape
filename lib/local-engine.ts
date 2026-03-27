import type { ConceptBlob, NarrativeSegment, ShapeProfile } from "./types";

const MAX_ITEMS = 6;

const NARRATIVE_EVENT_RE =
  /\b(moved|lived|went|started|left|joined|met|built|learned|worked|married|divorced|remembered|grew|saw|heard|lost|found|had)\b/i;
const NARRATIVE_DECISION_RE =
  /\b(decided|chose|planned|wanted to|had to|resolved|committed|started to|stopped|left|joined)\b/i;
const NARRATIVE_CHANGE_RE =
  /\b(changed|became|shifted|turned|grew into|no longer|started|stopped|after that|since then|went from|moved from|eventually|later)\b/i;
const NARRATIVE_FEELING_RE =
  /\b(felt|happy|sad|afraid|anxious|excited|relieved|ashamed|proud|angry|lonely|overwhelmed|scared|hopeful|grateful)\b/i;
const NARRATIVE_QUESTION_RE =
  /\?|maybe\b|not sure\b|i wonder\b|i don't know\b|i didnt know\b|unclear\b/i;

const CONCEPT_CLAIM_RE =
  /\b(is|are|means|defines|provides|creates|requires|matters|works|fails|becomes|supports)\b/i;
const CONCEPT_LAYER_RE =
  /\b(layer|stack|substrate|protocol|application|surface|implement|runtime|host|engine|below|above)\b/i;
const CONCEPT_DISTINCTION_RE =
  /\b(vs\.?|versus|rather than|instead of|separate|distinct|difference|not .* but)\b/i;
const CONCEPT_PRINCIPLE_RE =
  /\b(must|should|never|always|only|do not|don't|cannot|can't|required|rule)\b/i;
const CONCEPT_ANTI_PATTERN_RE =
  /\b(anti.?pattern|failure.?mode|mistake|broken|wrong|avoid|danger|collapse|drift)\b/i;
const CONCEPT_NEXT_MOVE_RE =
  /\b(next|need to|should build|should add|define|implement|make|build|ship|start with)\b/i;

const TIME_MARKER_RE =
  /\b(?:19|20)\d{2}\b|\bage\s?\d+\b|\b\d{1,2}\s+years?\s+old\b|\bearly\s+\d{4}s?\b|\blate\s+\d{4}s?\b|\bafter that\b|\bthen\b|\blater\b|\bbefore that\b|\beventually\b|\bsince then\b/gi;
const TIME_MARKER_TEST_RE =
  /\b(?:19|20)\d{2}\b|\bage\s?\d+\b|\b\d{1,2}\s+years?\s+old\b|\bearly\s+\d{4}s?\b|\blate\s+\d{4}s?\b|\bafter that\b|\bthen\b|\blater\b|\bbefore that\b|\beventually\b|\bsince then\b/i;
const ROLE_RE =
  /\b(?:mother|father|mom|dad|family|sister|brother|parents|grandma|grandpa|friend|teacher|boss|wife|husband|son|daughter|child|children|partner)\b/gi;
const PROPER_NAME_RE = /\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)+\b/g;

function normalizeWhitespace(text: string): string {
  return text.replace(/\r\n/g, "\n").replace(/\s+/g, " ").trim();
}

function splitSentences(text: string): string[] {
  return normalizeWhitespace(text)
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

function unique(values: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const value of values) {
    const normalized = value.trim();
    if (!normalized) continue;
    const key = normalized.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(normalized);
  }

  return result;
}

function take(values: string[], max = MAX_ITEMS): string[] {
  return values.slice(0, max);
}

function matches(text: string, regex: RegExp): string[] {
  return Array.from(text.matchAll(regex), (match) => match[0]);
}

function titleFromText(text: string): string {
  const firstSentence = splitSentences(text)[0] ?? text;
  const trimmed = firstSentence.trim().replace(/\s+/g, " ");
  if (trimmed.length <= 72) return trimmed;
  return `${trimmed.slice(0, 69).trimEnd()}...`;
}

function cleanSentence(sentence: string): string {
  return sentence.replace(/\s+/g, " ").trim();
}

function deriveSignalLevel(score: number): "strong" | "weak" | "insufficient" {
  if (score >= 6) return "strong";
  if (score >= 2) return "weak";
  return "insufficient";
}

function shapeNarrative(text: string): NarrativeSegment {
  const sentences = splitSentences(text);
  const time_markers = take(unique(matches(text, TIME_MARKER_RE)));
  const actors = take(
    unique([
      ...matches(text, ROLE_RE).map((item) => item.toLowerCase()),
      ...matches(text, PROPER_NAME_RE),
    ])
  );
  const events = take(
    unique(
      sentences
        .filter((sentence) => NARRATIVE_EVENT_RE.test(sentence) || TIME_MARKER_TEST_RE.test(sentence))
        .map(cleanSentence)
    )
  );
  const decisions = take(
    unique(sentences.filter((sentence) => NARRATIVE_DECISION_RE.test(sentence)).map(cleanSentence))
  );
  const felt_experience = take(
    unique(
      sentences
        .filter((sentence) => NARRATIVE_FEELING_RE.test(sentence))
        .map(cleanSentence)
    )
  );
  const open_questions = take(
    unique(
      sentences
        .filter((sentence) => NARRATIVE_QUESTION_RE.test(sentence))
        .map(cleanSentence)
    )
  );

  const changes = take(
    unique(
      sentences
        .filter((sentence) => NARRATIVE_CHANGE_RE.test(sentence))
        .map(cleanSentence)
    )
  );

  const inference_notes: string[] = [
    "This local engine uses heuristic extraction; condensed lists and grouping are inferred from surface cues rather than model judgment.",
  ];

  if (changes.length === 0 && events.length >= 2) {
    changes.push("The segment appears to move from an earlier event toward a later state, but the specific change had to be inferred heuristically.");
    inference_notes.push("A fallback change statement was inferred because the text suggested progression without an explicit change sentence.");
  }

  const declared_loss = [
    "Nuance, voice, and long-range chronology were compressed by the local heuristic engine.",
  ];

  if (sentences.length > events.length + decisions.length + felt_experience.length) {
    declared_loss.push("Some sentences were left unmodeled because they did not match the narrative extraction rules cleanly.");
  }

  if (actors.length === 0) {
    declared_loss.push("Pronoun references and unnamed people were not fully resolved into actors.");
  }

  const score =
    time_markers.length +
    actors.length +
    events.length +
    decisions.length +
    changes.length +
    felt_experience.length;

  return {
    title: titleFromText(text),
    time_markers,
    events,
    actors,
    decisions,
    changes: changes.length > 0 ? changes : ["No reliable change could be extracted by the local engine."],
    felt_experience,
    open_questions,
    declared_loss: take(unique(declared_loss), 4),
    signal_level: deriveSignalLevel(score),
    inference_notes: take(unique(inference_notes), 4),
  };
}

function shapeConcept(text: string): ConceptBlob {
  const sentences = splitSentences(text);
  const core_claims = take(
    unique(sentences.filter((sentence) => CONCEPT_CLAIM_RE.test(sentence)).map(cleanSentence))
  );
  const layer_models = take(
    unique(sentences.filter((sentence) => CONCEPT_LAYER_RE.test(sentence)).map(cleanSentence))
  );
  const distinctions = take(
    unique(
      sentences
        .filter((sentence) => CONCEPT_DISTINCTION_RE.test(sentence))
        .map(cleanSentence)
    )
  );
  const principles = take(
    unique(sentences.filter((sentence) => CONCEPT_PRINCIPLE_RE.test(sentence)).map(cleanSentence))
  );
  const anti_patterns = take(
    unique(
      sentences
        .filter((sentence) => CONCEPT_ANTI_PATTERN_RE.test(sentence))
        .map(cleanSentence)
    )
  );
  const design_questions = take(
    unique(
      sentences
        .filter((sentence) => sentence.includes("?") || /^what\b|^how\b|^why\b/i.test(sentence))
        .map(cleanSentence)
    )
  );
  const next_moves = take(
    unique(
      sentences
        .filter((sentence) => CONCEPT_NEXT_MOVE_RE.test(sentence))
        .map(cleanSentence)
    )
  );

  const declared_loss = [
    "Rhetorical framing and deeper synthesis were reduced to direct structural buckets by the local heuristic engine.",
  ];

  if (sentences.length > core_claims.length + distinctions.length + principles.length) {
    declared_loss.push("Some conceptual texture was left out because it did not map cleanly to the current concept profile.");
  }

  const inference_notes = [
    "This local engine classifies sentences by rule, so bucket assignment is heuristic and may flatten subtle distinctions.",
  ];

  if (anti_patterns.length > 0 && next_moves.length === 0) {
    inference_notes.push("The text warned about failure modes, but no explicit next move matched the local rule set.");
  }

  const score =
    core_claims.length +
    layer_models.length +
    distinctions.length +
    principles.length +
    anti_patterns.length +
    design_questions.length;

  return {
    title: titleFromText(text),
    core_claims,
    layer_models,
    distinctions,
    principles,
    anti_patterns,
    design_questions,
    next_moves,
    declared_loss: take(unique(declared_loss), 4),
    signal_level: deriveSignalLevel(score),
    inference_notes: take(unique(inference_notes), 4),
  };
}

function buildLocalSupport(
  profile: ShapeProfile,
  result: NarrativeSegment | ConceptBlob,
  sentences: string[]
): Record<string, Array<{ kind: "explicit" | "inferred"; evidence: string[] }>> {
  const support: Record<string, Array<{ kind: "explicit" | "inferred"; evidence: string[] }>> = {};

  const fieldKeys = profile === "narrative_segment_v0"
    ? ["events", "actors", "decisions", "changes", "felt_experience", "time_markers"]
    : ["core_claims", "distinctions", "principles", "anti_patterns", "design_questions", "next_moves"];

  for (const key of fieldKeys) {
    const values = (result as Record<string, unknown>)[key];
    if (!Array.isArray(values) || values.length === 0) continue;

    const entries: Array<{ kind: "explicit" | "inferred"; evidence: string[] }> = [];
    for (const val of values as string[]) {
      // Find the source sentence(s) that contain keywords from this value
      const keywords = val.toLowerCase().split(/\s+/).filter((w) => w.length > 3);
      const matched = sentences.filter((s) =>
        keywords.some((kw) => s.toLowerCase().includes(kw))
      ).slice(0, 2);

      if (matched.length > 0) {
        entries.push({ kind: "explicit", evidence: matched });
      } else {
        entries.push({ kind: "inferred", evidence: [val] });
      }
    }
    support[key] = entries;
  }

  return support;
}

function buildSpine(
  profile: ShapeProfile,
  result: NarrativeSegment | ConceptBlob
): string[] {
  // Pick the 3-5 most load-bearing entries across all fields
  const candidates: string[] = [];

  if (profile === "narrative_segment_v0") {
    const n = result as NarrativeSegment;
    candidates.push(...n.changes.slice(0, 2));
    candidates.push(...n.events.slice(0, 2));
    candidates.push(...n.decisions.slice(0, 1));
  } else {
    const c = result as ConceptBlob;
    candidates.push(...c.distinctions.slice(0, 2));
    candidates.push(...c.principles.slice(0, 2));
    candidates.push(...c.core_claims.slice(0, 1));
  }

  return candidates.slice(0, 5);
}

export async function runLocalShape(
  profile: ShapeProfile,
  userText: string
): Promise<{ spine: string[]; result: NarrativeSegment | ConceptBlob; support: Record<string, unknown[]> }> {
  const result = profile === "narrative_segment_v0"
    ? shapeNarrative(userText)
    : shapeConcept(userText);

  const sentences = splitSentences(normalizeWhitespace(userText));
  const support = buildLocalSupport(profile, result, sentences);
  const spine = buildSpine(profile, result);

  return { spine, result, support };
}
