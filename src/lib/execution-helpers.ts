import { CodeExample, ExecutionStep, Variable } from "@/types/code-demo";
import { CustomExampleDefinition } from "@/types/custom-example";

export const createStaticExecutor = (steps: ExecutionStep[]) => {
  return (
    stepIndex: number,
    _currentVars: Variable[],
    _inputs?: Record<string, string | number>
  ): ExecutionStep => {
    void _currentVars;
    void _inputs;

    const fallback = steps[steps.length - 1];
    const current = steps[stepIndex] || fallback;

    return {
      ...current,
      variables: current.variables.map((variable) => ({ ...variable })),
    };
  };
};

export const mapDefinitionToExample = (
  definition: CustomExampleDefinition
): CodeExample => {
  return {
    id: definition.id,
    title: definition.title,
    description: definition.description,
    difficulty: definition.difficulty,
    concepts: definition.concepts,
    code: definition.code,
    inputs: definition.inputs,
    source: "custom",
    totalSteps: definition.steps.length,
    executeStep: createStaticExecutor(definition.steps),
  };
};

export const mapDefinitionsToExamples = (
  definitions: CustomExampleDefinition[]
): CodeExample[] => {
  return definitions.map(mapDefinitionToExample);
};
