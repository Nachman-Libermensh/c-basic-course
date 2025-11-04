import { CodeExample } from "@/types/code-demo";
import { currencyConverterExample } from "./currency-converter";
import { testAverageExample } from "./test-average";

export const allExamples: CodeExample[] = [
  currencyConverterExample,
  testAverageExample,
];

export const getExampleById = (id: string): CodeExample | undefined => {
  return allExamples.find((example) => example.id === id);
};

export const getExamplesByDifficulty = (
  difficulty: "basic" | "intermediate" | "advanced"
): CodeExample[] => {
  return allExamples.filter((example) => example.difficulty === difficulty);
};

export const getExamplesByConcept = (concept: string): CodeExample[] => {
  return allExamples.filter((example) => example.concepts.includes(concept));
};
