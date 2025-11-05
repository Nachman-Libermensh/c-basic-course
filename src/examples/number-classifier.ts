import { CodeExample, ExecutionStep, Variable } from "@/types/code-demo";

export const numberClassifierExample: CodeExample = {
  id: "number-classifier",
  title: "מסווג מספרים - חיובי/שלילי/אפס",
  description:
    "תוכנית שמסווגת מספר לחיובי, שלילי או אפס. מדגימה: תנאים מרובים, if-else",
  difficulty: "basic",
  concepts: ["conditions", "input", "output"],
  source: "built-in",
  inputs: [
    {
      key: "number",
      label: "מספר",
      type: "number",
      defaultValue: "-5",
      placeholder: "לדוגמה: 42 או -17",
      helperText: "הזן מספר כלשהו (חיובי, שלילי או אפס)",
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
      code: "",
      explanation: "",
    },
    {
      lineNumber: 6,
      code: '    printf("הזן מספר: ");',
      explanation: "בקשה להזנת מספר",
      category: "output",
    },
    {
      lineNumber: 7,
      code: '    scanf("%d", &number);',
      explanation: "קליטת המספר מהמשתמש",
      category: "input",
    },
    {
      lineNumber: 8,
      code: "",
      explanation: "",
    },
    {
      lineNumber: 9,
      code: "    if (number > 0) {",
      explanation: "בדיקה אם המספר חיובי (גדול מאפס)",
      category: "condition",
    },
    {
      lineNumber: 10,
      code: '        printf("המספר %d הוא חיובי\\n", number);',
      explanation: "הדפסה במידה והמספר חיובי",
      category: "output",
    },
    {
      lineNumber: 11,
      code: "    } else if (number < 0) {",
      explanation: "בדיקה אם המספר שלילי (קטן מאפס)",
      category: "condition",
    },
    {
      lineNumber: 12,
      code: '        printf("המספר %d הוא שלילי\\n", number);',
      explanation: "הדפסה במידה והמספר שלילי",
      category: "output",
    },
    {
      lineNumber: 13,
      code: "    } else {",
      explanation: "במקרה האחרון - המספר הוא אפס",
      category: "condition",
    },
    {
      lineNumber: 14,
      code: '        printf("המספר הוא אפס\\n");',
      explanation: "הדפסה במידה והמספר אפס",
      category: "output",
    },
    {
      lineNumber: 15,
      code: "    }",
      explanation: "סוף תנאי ה-if",
      category: "condition",
    },
    {
      lineNumber: 16,
      code: "",
      explanation: "",
    },
    {
      lineNumber: 17,
      code: "    return 0;",
      explanation: "סיום התוכנית בהצלחה",
    },
    {
      lineNumber: 18,
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
    const number = Number(inputs?.number ?? -5);
    const isPositive = number > 0;
    const isNegative = number < 0;

    const steps: ExecutionStep[] = [
      {
        lineNumber: 3,
        description: "התוכנית מתחילה לרוץ",
        variables: [],
      },
      {
        lineNumber: 4,
        description: "הצהרה על משתנה number",
        variables: [{ name: "number", type: "int", value: null }],
        highlight: "number",
      },
      {
        lineNumber: 7,
        description: `קליטת המספר ${number} מהמשתמש`,
        variables: [{ name: "number", type: "int", value: number }],
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
              number: Number.isFinite(parsed) ? parsed : 0,
            };
          },
        },
      },
      {
        lineNumber: 9,
        description: `בדיקת תנאי: ${number} > 0 - ${isPositive ? "אמת" : "שקר"}`,
        variables: [{ name: "number", type: "int", value: number }],
      },
      ...(isPositive
        ? ([
            {
              lineNumber: 10,
              description: "התנאי התקיים - המספר חיובי",
              variables: [{ name: "number", type: "int" as const, value: number }],
              output: `המספר ${number} הוא חיובי`,
            },
          ] as ExecutionStep[])
        : isNegative
          ? ([
              {
                lineNumber: 11,
                description: `בדיקת תנאי else-if: ${number} < 0 - אמת`,
                variables: [{ name: "number", type: "int" as const, value: number }],
              },
              {
                lineNumber: 12,
                description: "התנאי התקיים - המספר שלילי",
                variables: [{ name: "number", type: "int" as const, value: number }],
                output: `המספר ${number} הוא שלילי`,
              },
            ] as ExecutionStep[])
          : ([
              {
                lineNumber: 13,
                description: "הגענו ל-else - המספר הוא אפס",
                variables: [{ name: "number", type: "int" as const, value: number }],
              },
              {
                lineNumber: 14,
                description: "הדפסה: המספר הוא אפס",
                variables: [{ name: "number", type: "int" as const, value: number }],
                output: "המספר הוא אפס",
              },
            ] as ExecutionStep[])),
      {
        lineNumber: 17,
        description: "סיום התוכנית בהצלחה",
        variables: [{ name: "number", type: "int", value: number }],
      },
    ];

    return steps[stepIndex];
  },
};
