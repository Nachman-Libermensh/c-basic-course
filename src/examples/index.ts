import { CodeExample } from "@/types/code-demo";
import { currencyConverterExample } from "./currency-converter";
import { testAverageExample } from "./test-average";

export const builtInExamples: CodeExample[] = [
  currencyConverterExample,
  testAverageExample,
];

export const getAllExamples = (
  customExamples: CodeExample[] = []
): CodeExample[] => {
  return [...builtInExamples, ...customExamples];
};

export const getExampleById = (
  id: string,
  customExamples: CodeExample[] = []
): CodeExample | undefined => {
  return getAllExamples(customExamples).find((example) => example.id === id);
};

export const getExamplesByDifficulty = (
  difficulty: "basic" | "intermediate" | "advanced",
  customExamples: CodeExample[] = []
): CodeExample[] => {
  return getAllExamples(customExamples).filter(
    (example) => example.difficulty === difficulty
  );
};

export const getExamplesByConcept = (
  concept: string,
  customExamples: CodeExample[] = []
): CodeExample[] => {
  return getAllExamples(customExamples).filter((example) =>
    example.concepts.includes(concept)
  );
};
