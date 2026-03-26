export interface ShapeCandidate {
  title: string;
  intent: string;
  summary: string;
  themes: string[];
  constraints: string[];
  entities: string[];
  questions: string[];
  source_refs: string[];
}

export interface ShapeCheck {
  preserved_title: boolean;
  preserved_intent: boolean;
  preserved_constraints: boolean;
  preserved_lineage: boolean;
  declared_loss_visible: boolean;
  overall_result: "pass" | "fail";
}

export interface ShapeSignal {
  level: "strong" | "weak" | "insufficient";
  note: string;
}

export interface ShapeResult {
  candidate: ShapeCandidate;
  declared_loss: string[];
  casts: {
    review_markdown: string;
    host_json_view: object;
  };
  check: ShapeCheck;
  signal: ShapeSignal;
}
