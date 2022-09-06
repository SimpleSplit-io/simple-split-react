export type TestStatusType = "active" | "complete";

export type OptionTypeType = "string" | "boolean" | "number";

export type OptionType = {
  option_id: string;
  option_value: string;
};

export type TestType = {
  test_id: string;
  test_status: TestStatusType;
  option_type: OptionTypeType;
  default_option_id?: string;
  options: OptionType[];
};

export type DecisionType = OptionType & {
  test_status: TestStatusType;
  option_type: OptionTypeType;
};

export type DecidedObjectType = {
  [index: string]: DecisionType;
};

export type TestFileType = {
  organization_id: string;
  tests: TestType[];
};

export type SimpleSplitContextType = {
  apiKey?: string;
  file?: TestFileType;
  isReady: boolean;
  decisionData?: DecidedObjectType;
};
