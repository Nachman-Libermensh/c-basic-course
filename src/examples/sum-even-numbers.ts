import { CodeExample, ExecutionStep, Variable } from "@/types/code-demo";

export const sumEvenNumbersExample: CodeExample = {
  id: "sum-even-numbers",
  title: "סכום מספרים זוגיים",
  description:
    "תוכנית שמחשבת את סכום המספרים הזוגיים מ-1 עד N. מדגימה: לולאות, תנאים, אופרטור מודולו",
  difficulty: "intermediate",
  concepts: ["loops", "conditions", "arithmetic", "modulo"],
  source: "built-in",
  inputs: [
    {
      key: "n",
      label: "מספר סיום (N)",
      type: "number",
      defaultValue: "10",
      placeholder: "לדוגמה: 10",
      helperText: "התוכנית תחשב את סכום כל הזוגיים מ-1 עד N",
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
      code: "    int n;",
      explanation: "משתנה לגבול העליון",
      category: "declaration",
    },
    {
      lineNumber: 5,
      code: "    int sum = 0;",
      explanation: "משתנה לסכום - מתחיל מ-0",
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
      code: '    scanf("%d", &n);',
      explanation: "קליטת המספר",
      category: "input",
    },
    {
      lineNumber: 10,
      code: "",
      explanation: "",
    },
    {
      lineNumber: 11,
      code: "    for (i = 1; i <= n; i++) {",
      explanation: "לולאה שרצה על המספרים מ-1 עד n",
      category: "loop",
    },
    {
      lineNumber: 12,
      code: "        if (i % 2 == 0) {",
      explanation: "בדיקה אם המספר זוגי (שארית חלוקה ב-2 היא 0)",
      category: "condition",
    },
    {
      lineNumber: 13,
      code: "            sum = sum + i;",
      explanation: "אם זוגי - הוספתו לסכום",
      category: "calculation",
    },
    {
      lineNumber: 14,
      code: "        }",
      explanation: "סוף תנאי ה-if",
      category: "condition",
    },
    {
      lineNumber: 15,
      code: "    }",
      explanation: "סוף הלולאה",
      category: "loop",
    },
    {
      lineNumber: 16,
      code: "",
      explanation: "",
    },
    {
      lineNumber: 17,
      code: '    printf("סכום הזוגיים: %d\\n", sum);',
      explanation: "הדפסת התוצאה הסופית",
      category: "output",
    },
    {
      lineNumber: 18,
      code: "    return 0;",
      explanation: "סיום התוכנית בהצלחה",
    },
    {
      lineNumber: 19,
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
    const n = Number(inputs?.n ?? 10);
    
    // Build all steps
    const allSteps: ExecutionStep[] = [];
    
    // Initial steps
    allSteps.push({
      lineNumber: 3,
      description: "התוכנית מתחילה לרוץ",
      variables: [],
    });
    
    allSteps.push({
      lineNumber: 4,
      description: "הצהרה על משתנה n",
      variables: [{ name: "n", type: "int", value: null }],
      highlight: "n",
    });
    
    allSteps.push({
      lineNumber: 5,
      description: "הצהרה ואתחול של sum ל-0",
      variables: [
        { name: "n", type: "int", value: null },
        { name: "sum", type: "int", value: 0 },
      ],
      highlight: "sum",
    });
    
    allSteps.push({
      lineNumber: 6,
      description: "הצהרה על משתנה i למונה הלולאה",
      variables: [
        { name: "n", type: "int", value: null },
        { name: "sum", type: "int", value: 0 },
        { name: "i", type: "int", value: null },
      ],
      highlight: "i",
    });
    
    allSteps.push({
      lineNumber: 9,
      description: `קליטת הערך ${n} למשתנה n`,
      variables: [
        { name: "n", type: "int", value: n },
        { name: "sum", type: "int", value: 0 },
        { name: "i", type: "int", value: null },
      ],
      highlight: "n",
      inputRequest: {
        key: "n",
        prompt: "הזן מספר",
        label: "מספר סיום",
        type: "number",
        defaultValue: String(n),
        applyValue: (currentInputs, newValue) => {
          const parsed = Number(newValue);
          return {
            ...currentInputs,
            n: Number.isFinite(parsed) && parsed > 0 ? parsed : 1,
          };
        },
      },
    });
    
    // Loop iterations - show only a few representative steps
    let sum = 0;
    const stepsToShow = Math.min(n, 5); // Show max 5 iterations
    
    for (let i = 1; i <= stepsToShow; i++) {
      // Check condition
      allSteps.push({
        lineNumber: 11,
        description: `בדיקת תנאי הלולאה: i (${i}) <= n (${n}) - אמת`,
        variables: [
          { name: "n", type: "int", value: n },
          { name: "sum", type: "int", value: sum },
          { name: "i", type: "int", value: i },
        ],
      });
      
      const isEven = i % 2 === 0;
      
      // Check if even
      allSteps.push({
        lineNumber: 12,
        description: `בדיקה: ${i} % 2 == 0 - ${isEven ? `אמת (${i} זוגי)` : `שקר (${i} אי-זוגי)`}`,
        variables: [
          { name: "n", type: "int", value: n },
          { name: "sum", type: "int", value: sum },
          { name: "i", type: "int", value: i },
        ],
      });
      
      if (isEven) {
        const oldSum = sum;
        sum += i;
        allSteps.push({
          lineNumber: 13,
          description: `${i} זוגי - הוספה לסכום: sum = ${oldSum} + ${i} = ${sum}`,
          variables: [
            { name: "n", type: "int", value: n },
            { name: "sum", type: "int", value: sum },
            { name: "i", type: "int", value: i },
          ],
          highlight: "sum",
        });
      }
    }
    
    // Calculate final sum for output (in case we skipped iterations)
    let finalSum = 0;
    for (let i = 1; i <= n; i++) {
      if (i % 2 === 0) {
        finalSum += i;
      }
    }
    
    // Skip to end if needed
    if (n > stepsToShow) {
      allSteps.push({
        lineNumber: 11,
        description: `...הלולאה ממשיכה עד i = ${n}...`,
        variables: [
          { name: "n", type: "int", value: n },
          { name: "sum", type: "int", value: finalSum },
          { name: "i", type: "int", value: n },
        ],
      });
    }
    
    // Exit condition
    allSteps.push({
      lineNumber: 11,
      description: `בדיקת תנאי הלולאה: i (${n + 1}) <= n (${n}) - שקר, יוצאים מהלולאה`,
      variables: [
        { name: "n", type: "int", value: n },
        { name: "sum", type: "int", value: finalSum },
        { name: "i", type: "int", value: n + 1 },
      ],
    });
    
    // Final output
    allSteps.push({
      lineNumber: 17,
      description: `הדפסת התוצאה הסופית`,
      variables: [
        { name: "n", type: "int", value: n },
        { name: "sum", type: "int", value: finalSum },
        { name: "i", type: "int", value: n + 1 },
      ],
      output: `סכום הזוגיים: ${finalSum}`,
    });
    
    return allSteps[stepIndex];
  },
};
