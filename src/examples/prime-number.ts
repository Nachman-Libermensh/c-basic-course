import { CodeExample, ExecutionStep, Variable } from "@/types/code-demo";

export const primeNumberExample: CodeExample = {
  id: "prime-number",
  title: "בדיקת מספר ראשוני",
  description:
    "תוכנית לבדיקה האם מספר הוא ראשוני. מדגימה: לולאות, תנאים, break",
  difficulty: "intermediate",
  concepts: ["loops", "conditions", "modulo", "logic"],
  source: "built-in",
  inputs: [
    {
      key: "number",
      label: "מספר",
      type: "number",
      defaultValue: "17",
      placeholder: "לדוגמה: 23",
      helperText: "הזן מספר גדול מ-1",
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
      code: "    int number, i;",
      explanation: "משתנים למספר ולמונה הלולאה",
      category: "declaration",
    },
    {
      lineNumber: 5,
      code: "    int isPrime = 1;",
      explanation: "דגל - מניחים שהמספר ראשוני (1=אמת)",
      category: "declaration",
    },
    {
      lineNumber: 6,
      code: "",
      explanation: "",
    },
    {
      lineNumber: 7,
      code: '    printf("הזן מספר: ");',
      explanation: "בקשה להזנת מספר",
      category: "output",
    },
    {
      lineNumber: 8,
      code: '    scanf("%d", &number);',
      explanation: "קליטת המספר",
      category: "input",
    },
    {
      lineNumber: 9,
      code: "",
      explanation: "",
    },
    {
      lineNumber: 10,
      code: "    if (number <= 1) {",
      explanation: "מספרים <= 1 אינם ראשוניים",
      category: "condition",
    },
    {
      lineNumber: 11,
      code: "        isPrime = 0;",
      explanation: "סימון שהמספר לא ראשוני",
      category: "calculation",
    },
    {
      lineNumber: 12,
      code: "    }",
      explanation: "סוף התנאי",
      category: "condition",
    },
    {
      lineNumber: 13,
      code: "",
      explanation: "",
    },
    {
      lineNumber: 14,
      code: "    for (i = 2; i <= number / 2; i++) {",
      explanation: "לולאה לבדיקת מחלקים מ-2 עד חצי המספר",
      category: "loop",
    },
    {
      lineNumber: 15,
      code: "        if (number % i == 0) {",
      explanation: "בדיקה אם i מחלק את המספר",
      category: "condition",
    },
    {
      lineNumber: 16,
      code: "            isPrime = 0;",
      explanation: "מצאנו מחלק - המספר לא ראשוני",
      category: "calculation",
    },
    {
      lineNumber: 17,
      code: "            break;",
      explanation: "יציאה מהלולאה - מצאנו מחלק",
      category: "loop",
    },
    {
      lineNumber: 18,
      code: "        }",
      explanation: "סוף תנאי ה-if",
      category: "condition",
    },
    {
      lineNumber: 19,
      code: "    }",
      explanation: "סוף הלולאה",
      category: "loop",
    },
    {
      lineNumber: 20,
      code: "",
      explanation: "",
    },
    {
      lineNumber: 21,
      code: "    if (isPrime && number > 1)",
      explanation: "בדיקה אם המספר ראשוני",
      category: "condition",
    },
    {
      lineNumber: 22,
      code: '        printf("%d הוא מספר ראשוני\\n", number);',
      explanation: "הדפסה - המספר ראשוני",
      category: "output",
    },
    {
      lineNumber: 23,
      code: "    else",
      explanation: "אחרת",
      category: "condition",
    },
    {
      lineNumber: 24,
      code: '        printf("%d אינו מספר ראשוני\\n", number);',
      explanation: "הדפסה - המספר לא ראשוני",
      category: "output",
    },
    {
      lineNumber: 25,
      code: "",
      explanation: "",
    },
    {
      lineNumber: 26,
      code: "    return 0;",
      explanation: "סיום התוכנית",
    },
    {
      lineNumber: 27,
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
    const number = Number(inputs?.number ?? 17);

    const allSteps: ExecutionStep[] = [];

    // Initial steps
    allSteps.push({
      lineNumber: 3,
      description: "התוכנית מתחילה לרוץ",
      variables: [],
    });

    allSteps.push({
      lineNumber: 4,
      description: "הצהרה על משתנים number ו-i",
      variables: [
        { name: "number", type: "int", value: null },
        { name: "i", type: "int", value: null },
      ],
      highlight: "number",
    });

    allSteps.push({
      lineNumber: 5,
      description: "אתחול isPrime ל-1 (מניחים שהמספר ראשוני)",
      variables: [
        { name: "number", type: "int", value: null },
        { name: "i", type: "int", value: null },
        { name: "isPrime", type: "int", value: 1 },
      ],
      highlight: "isPrime",
    });

    allSteps.push({
      lineNumber: 8,
      description: `קליטת המספר ${number}`,
      variables: [
        { name: "number", type: "int", value: number },
        { name: "i", type: "int", value: null },
        { name: "isPrime", type: "int", value: 1 },
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
            number: Number.isFinite(parsed) && parsed > 0 ? parsed : 2,
          };
        },
      },
    });

    // Check if <= 1
    let isPrime = 1;
    if (number <= 1) {
      isPrime = 0;
      allSteps.push({
        lineNumber: 10,
        description: `בדיקה: ${number} <= 1 - אמת`,
        variables: [
          { name: "number", type: "int", value: number },
          { name: "i", type: "int", value: null },
          { name: "isPrime", type: "int", value: 1 },
        ],
      });

      allSteps.push({
        lineNumber: 11,
        description: "המספר <= 1 ולכן אינו ראשוני",
        variables: [
          { name: "number", type: "int", value: number },
          { name: "i", type: "int", value: null },
          { name: "isPrime", type: "int", value: 0 },
        ],
        highlight: "isPrime",
      });
    } else {
      allSteps.push({
        lineNumber: 10,
        description: `בדיקה: ${number} <= 1 - שקר`,
        variables: [
          { name: "number", type: "int", value: number },
          { name: "i", type: "int", value: null },
          { name: "isPrime", type: "int", value: 1 },
        ],
      });

      // Loop to check divisors
      const maxCheck = Math.floor(number / 2);
      const maxStepsToShow = Math.min(3, maxCheck - 1); // Show up to 3 iterations
      let foundDivisor = false;
      let divisorFound = 0;

      for (let i = 2; i <= Math.min(maxCheck, 2 + maxStepsToShow); i++) {
        allSteps.push({
          lineNumber: 14,
          description: `בדיקת תנאי הלולאה: i (${i}) <= ${maxCheck} - אמת`,
          variables: [
            { name: "number", type: "int", value: number },
            { name: "i", type: "int", value: i },
            { name: "isPrime", type: "int", value: isPrime },
          ],
        });

        const isDivisor = number % i === 0;
        allSteps.push({
          lineNumber: 15,
          description: `בדיקה: ${number} % ${i} == 0 - ${isDivisor ? "אמת (מצאנו מחלק!)" : "שקר"}`,
          variables: [
            { name: "number", type: "int", value: number },
            { name: "i", type: "int", value: i },
            { name: "isPrime", type: "int", value: isPrime },
          ],
        });

        if (isDivisor) {
          foundDivisor = true;
          divisorFound = i;
          isPrime = 0;
          allSteps.push({
            lineNumber: 16,
            description: `מצאנו מחלק (${i}) - המספר לא ראשוני`,
            variables: [
              { name: "number", type: "int", value: number },
              { name: "i", type: "int", value: i },
              { name: "isPrime", type: "int", value: 0 },
            ],
            highlight: "isPrime",
          });

          allSteps.push({
            lineNumber: 17,
            description: "יציאה מהלולאה (break)",
            variables: [
              { name: "number", type: "int", value: number },
              { name: "i", type: "int", value: i },
              { name: "isPrime", type: "int", value: 0 },
            ],
          });
          break;
        }
      }

      // Check if really prime (full check)
      if (!foundDivisor) {
        for (let i = 2; i <= maxCheck; i++) {
          if (number % i === 0) {
            foundDivisor = true;
            divisorFound = i;
            isPrime = 0;
            break;
          }
        }

        if (foundDivisor) {
          allSteps.push({
            lineNumber: 14,
            description: `...הלולאה ממשיכה ומוצאת מחלק: ${divisorFound}...`,
            variables: [
              { name: "number", type: "int", value: number },
              { name: "i", type: "int", value: divisorFound },
              { name: "isPrime", type: "int", value: 0 },
            ],
          });
        } else {
          allSteps.push({
            lineNumber: 14,
            description: `הלולאה הסתיימה - לא נמצא מחלק`,
            variables: [
              { name: "number", type: "int", value: number },
              { name: "i", type: "int", value: maxCheck + 1 },
              { name: "isPrime", type: "int", value: 1 },
            ],
          });
        }
      }
    }

    // Final output
    allSteps.push({
      lineNumber: isPrime ? 22 : 24,
      description: `הדפסת התוצאה`,
      variables: [
        { name: "number", type: "int", value: number },
        { name: "i", type: "int", value: number > 1 ? Math.floor(number / 2) + 1 : null },
        { name: "isPrime", type: "int", value: isPrime },
      ],
      output: isPrime
        ? `${number} הוא מספר ראשוני`
        : `${number} אינו מספר ראשוני`,
    });

    return allSteps[stepIndex];
  },
};
