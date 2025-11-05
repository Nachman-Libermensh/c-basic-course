import {
  CodeLine,
  ExampleInputField,
  ExecutionStep,
} from "@/types/code-demo";

export interface CustomExampleDefinition {
  id: string;
  title: string;
  description: string;
  difficulty: "basic" | "intermediate" | "advanced";
  concepts: string[];
  code: CodeLine[];
  inputs?: ExampleInputField[];
  steps: ExecutionStep[];
}
