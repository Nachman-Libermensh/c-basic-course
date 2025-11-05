import { CodeExample, ExecutionStep, Variable } from "@/types/code-demo";

export const factorialExample: CodeExample = {
  id: "factorial",
  title: "חישוב עצרת (Factorial)",
  description:
    "תוכנית לחישוב עצרת של מספר באמצעות לולאה. למשל 5! = 5×4×3×2×1 = 120",
  difficulty: "basic",
  concepts: ["loops", "arithmetic", "input", "output"],
  source: "built-in",
  inputs: [
    {
      key: "number",
      label: "מספר",
      type: "number",
      defaultValue: "5",
      placeholder: "לדוגמה: 6",
      helperText: "הזן מספר חיובי (1-10 מומלץ)",
    },
  ],
  code: [
    {
      lineNumber: 1,
      code: "#include <stdio.h>",
      explanation: "ספריית קלט/פלט סטנדרטית",
    },
    {
      lineNumber: 2,
      code: "",
      explanation: "",
    },
    {
      lineNumber: 3,
      code: "int main() {",
      explanation: "פונקציית main",
    },
    {
      lineNumber: 4,
      code: "    int number;",
      explanation: "משתנה לאחסון המספר",
      category: "declaration",
    },
    {
      lineNumber: 5,
      code: "    long result = 1;",
      explanation: "משתנה לתוצאה - מתחיל מ-1 כי נכפול",
      category: "declaration",
    },
    {
      lineNumber: 6,
      code: "    int i;",
      explanation: "משתנה למונה הלולאה",
      category: "declaration",
    },
    {
      lineNumber: 7,
      code: "",
      explanation: "",
    },
    {
      lineNumber: 8,
      code: '    printf("הזן מספר: ");',
      explanation: "בקשה להזנת מספר",
      category: "output",
    },
    {
      lineNumber: 9,
      code: '    scanf("%d", &number);',
      explanation: "קליטת המספר מהמשתמש",
      category: "input",
    },
    {
      lineNumber: 10,
      code: "",
      explanation: "",
    },
    {
      lineNumber: 11,
      code: "    for (i = 1; i <= number; i++) {",
      explanation: "לולאה שרצה מ-1 עד המספר שהוזן",
      category: "loop",
    },
    {
      lineNumber: 12,
      code: "        result = result * i;",
      explanation: "כפל מצטבר - כופלים את התוצאה ב-i הנוכחי",
      category: "calculation",
    },
    {
      lineNumber: 13,
      code: "    }",
      explanation: "סוף הלולאה",
      category: "loop",
    },
    {
      lineNumber: 14,
      code: "",
      explanation: "",
    },
    {
      lineNumber: 15,
      code: '    printf("%d! = %ld\\n", number, result);',
      explanation: "הדפסת התוצאה",
      category: "output",
    },
    {
      lineNumber: 16,
      code: "    return 0;",
      explanation: "סיום התוכנית בהצלחה",
    },
    {
      lineNumber: 17,
      code: "}",
      explanation: "סוף פונקציית main",
    },
  ],
  initialVariables: [],
  totalSteps: 50, // High enough to accommodate all steps
  executeStep: (
    stepIndex: number,
    currentVars: Variable[],
    inputs?: Record<string, string | number>
  ): ExecutionStep | undefined => {
    const number = Number(inputs?.number ?? 5);

    const allSteps: ExecutionStep[] = [];

    // Initial declarations
    allSteps.push({
      lineNumber: 3,
      description: "התוכנית מתחילה לרוץ",
      variables: [],
    });

    allSteps.push({
      lineNumber: 4,
      description: "הצהרה על משתנה number",
      variables: [{ name: "number", type: "int", value: null }],
      highlight: "number",
    });

    allSteps.push({
      lineNumber: 5,
      description: "הצהרה ואתחול של result ל-1 (נקודת התחלה לכפל)",
      variables: [
        { name: "number", type: "int", value: null },
        { name: "result", type: "int", value: 1 },
      ],
      highlight: "result",
    });

    allSteps.push({
      lineNumber: 6,
      description: "הצהרה על משתנה i למונה הלולאה",
      variables: [
        { name: "number", type: "int", value: null },
        { name: "result", type: "int", value: 1 },
        { name: "i", type: "int", value: null },
      ],
      highlight: "i",
    });

    // Input
    allSteps.push({
      lineNumber: 9,
      description: `קליטת הערך ${number} למשתנה number`,
      variables: [
        { name: "number", type: "int", value: number },
        { name: "result", type: "int", value: 1 },
        { name: "i", type: "int", value: null },
      ],
      highlight: "number",
      inputRequest: {
        key: "number",
        prompt: "הזן מספר",
        label: "מספר",
        type: "number",
        defaultValue: String(number),
        applyValue: (currentInputs, newValue) => {
          const parsed = Number(newValue);
          return {
            ...currentInputs,
            number: Number.isFinite(parsed) && parsed > 0 ? parsed : 1,
          };
        },
      },
    });

    // Loop iterations
    let result = 1;
    const maxSteps = Math.min(number, 4); // Show max 4 iterations

    for (let i = 1; i <= maxSteps; i++) {
      // Loop condition
      allSteps.push({
        lineNumber: 11,
        description: `בדיקת תנאי הלולאה: i (${i}) <= number (${number}) - אמת`,
        variables: [
          { name: "number", type: "int", value: number },
          { name: "result", type: "int", value: result },
          { name: "i", type: "int", value: i },
        ],
      });

      // Multiplication
      const oldResult = result;
      result = result * i;
      allSteps.push({
        lineNumber: 12,
        description: `כפל מצטבר: result = ${oldResult} × ${i} = ${result}`,
        variables: [
          { name: "number", type: "int", value: number },
          { name: "result", type: "int", value: result },
          { name: "i", type: "int", value: i },
        ],
        highlight: "result",
      });
    }

    // Calculate final result
    let finalResult = 1;
    for (let i = 1; i <= number; i++) {
      finalResult *= i;
    }

    // Skip message if needed
    if (number > maxSteps) {
      allSteps.push({
        lineNumber: 11,
        description: `...הלולאה ממשיכה עד i = ${number}...`,
        variables: [
          { name: "number", type: "int", value: number },
          { name: "result", type: "int", value: finalResult },
          { name: "i", type: "int", value: number },
        ],
      });
    }

    // Final loop check (exit)
    allSteps.push({
      lineNumber: 11,
      description: `בדיקת תנאי הלולאה: i (${number + 1}) <= number (${number}) - שקר, יוצאים מהלולאה`,
      variables: [
        { name: "number", type: "int", value: number },
        { name: "result", type: "int", value: finalResult },
        { name: "i", type: "int", value: number + 1 },
      ],
    });

    // Final output
    allSteps.push({
      lineNumber: 15,
      description: `הדפסת התוצאה: ${number}! = ${finalResult}`,
      variables: [
        { name: "number", type: "int", value: number },
        { name: "result", type: "int", value: finalResult },
        { name: "i", type: "int", value: number + 1 },
      ],
      output: `${number}! = ${finalResult}`,
    });

    return allSteps[stepIndex];
  },
};
