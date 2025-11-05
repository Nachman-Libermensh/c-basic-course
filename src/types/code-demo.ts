// Types for the code demonstration system

export type VariableType =
  | "int"
  | "float"
  | "double"
  | "char"
  | "string"
  | "bool";

export interface Variable {
  name: string;
  type: VariableType;
  value: string | number | boolean | null;
  scope?: string;
}

export interface ExecutionStep {
  lineNumber: number;
  description: string;
  variables: Variable[];
  output?: string;
  highlight?: string; // variable name to highlight
}

export interface CodeLine {
  lineNumber: number;
  code: string;
  explanation: string;
  category?:
    | "declaration"
    | "input"
    | "calculation"
    | "condition"
    | "loop"
    | "output";
}

export type ExampleInputType = "number" | "text" | "textarea";

export interface ExampleInputField {
  key: string;
  label: string;
  type: ExampleInputType;
  defaultValue?: string;
  placeholder?: string;
  helperText?: string;
}

export interface CodeExample {
  id: string;
  title: string;
  description: string;
  difficulty: "basic" | "intermediate" | "advanced";
  concepts: string[]; // e.g., ['variables', 'input', 'output', 'arithmetic']
  code: CodeLine[];
  initialVariables?: Variable[];
  inputs?: ExampleInputField[];
  source?: "built-in" | "custom";
  executeStep:
    | ((
        stepIndex: number,
        currentVars: Variable[],
        inputs?: Record<string, string | number>
      ) => ExecutionStep)
    | ((
        stepIndex: number,
        currentVars: Variable[],
        inputs?: Record<string, string | number>
      ) => ExecutionStep | undefined);
  totalSteps: number;
}

export interface ExecutionState {
  currentStep: number;
  variables: Variable[];
  outputs: string[];
  isRunning: boolean;
  isPaused: boolean;
  speed: number; // ms between steps
}
