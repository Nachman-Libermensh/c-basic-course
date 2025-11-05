import { CodeExample, ExecutionStep, Variable } from "@/types/code-demo";

export const testAverageExample: CodeExample = {
  id: "test-average",
  title: "חישוב ממוצע ציונים",
  description:
    "תוכנית לחישוב ממוצע של N ציונים עם בדיקת תקינות. מדגימה: לולאות, תנאים, מערכים",
  difficulty: "intermediate",
  concepts: ["loops", "conditions", "arrays", "input", "output"],
  source: "built-in",
  inputs: [
    {
      key: "numTests",
      label: "מספר מבחנים",
      type: "number",
      defaultValue: "3",
      placeholder: "לדוגמה: 5",
    },
    {
      key: "grades",
      label: "ציונים (מופרדים בפסיקים)",
      type: "textarea",
      defaultValue: "85,90,78",
      placeholder: "לדוגמה: 70,82.5,91",
      helperText: "ניתן להזין מספרים עשרוניים",
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
      code: "    int numTests;",
      explanation: "משתנה למספר המבחנים",
      category: "declaration",
    },
    {
      lineNumber: 5,
      code: "    float grades[100];",
      explanation: "מערך לאחסון הציונים (עד 100)",
      category: "declaration",
    },
    {
      lineNumber: 6,
      code: "    float sum = 0;",
      explanation: "משתנה לסכום הציונים",
      category: "declaration",
    },
    {
      lineNumber: 7,
      code: "    float average;",
      explanation: "משתנה לממוצע",
      category: "declaration",
    },
    {
      lineNumber: 8,
      code: "    int i;",
      explanation: "משתנה למניין הלולאה",
      category: "declaration",
    },
    {
      lineNumber: 9,
      code: "",
      explanation: "",
    },
    {
      lineNumber: 10,
      code: '    printf("How many tests? ");',
      explanation: "בקשת מספר מבחנים",
      category: "output",
    },
    {
      lineNumber: 11,
      code: '    scanf("%d", &numTests);',
      explanation: "קליטת מספר המבחנים",
      category: "input",
    },
    {
      lineNumber: 12,
      code: "",
      explanation: "",
    },
    {
      lineNumber: 13,
      code: "    if (numTests <= 0 || numTests > 100) {",
      explanation: "בדיקת תקינות - מספר חייב להיות בין 1-100",
      category: "condition",
    },
    {
      lineNumber: 14,
      code: '        printf("Invalid number!\\n");',
      explanation: "הודעת שגיאה",
      category: "output",
    },
    {
      lineNumber: 15,
      code: "        return 1;",
      explanation: "יציאה עם קוד שגיאה",
    },
    {
      lineNumber: 16,
      code: "    }",
      explanation: "",
    },
    {
      lineNumber: 17,
      code: "",
      explanation: "",
    },
    {
      lineNumber: 18,
      code: "    for (i = 0; i < numTests; i++) {",
      explanation: "לולאה לקליטת כל הציונים",
      category: "loop",
    },
    {
      lineNumber: 19,
      code: '        printf("Enter grade %d: ", i + 1);',
      explanation: "בקשת ציון מספר i+1",
      category: "output",
    },
    {
      lineNumber: 20,
      code: '        scanf("%f", &grades[i]);',
      explanation: "שמירת הציון במערך",
      category: "input",
    },
    {
      lineNumber: 21,
      code: "        sum = sum + grades[i];",
      explanation: "הוספת הציון לסכום המצטבר",
      category: "calculation",
    },
    {
      lineNumber: 22,
      code: "    }",
      explanation: "סוף הלולאה",
    },
    {
      lineNumber: 23,
      code: "",
      explanation: "",
    },
    {
      lineNumber: 24,
      code: "    average = sum / numTests;",
      explanation: "חישוב הממוצע: סכום חלקי מספר הציונים",
      category: "calculation",
    },
    {
      lineNumber: 25,
      code: '    printf("Average: %.2f\\n", average);',
      explanation: "הצגת הממוצע",
      category: "output",
    },
    {
      lineNumber: 26,
      code: "",
      explanation: "",
    },
    {
      lineNumber: 27,
      code: "    return 0;",
      explanation: "סיום מוצלח",
    },
    {
      lineNumber: 28,
      code: "}",
      explanation: "סוף התוכנית",
    },
  ],
  initialVariables: [],
  totalSteps: 48,
  executeStep: (
    stepIndex: number,
    currentVars: Variable[],
    inputs?: Record<string, string | number>
  ): ExecutionStep => {
    const numTests = Number(inputs?.numTests ?? 3);
    const grades = inputs?.grades
      ? (inputs.grades as string).split(",").map(Number)
      : [85, 90, 78];

    const steps: ExecutionStep[] = [];

    // Step 0: Start
    steps.push({
      lineNumber: 3,
      description: "התוכנית מתחילה",
      variables: [],
    });

    // Step 1-5: Variable declarations
    steps.push({
      lineNumber: 4,
      description: "הצהרה על numTests",
      variables: [{ name: "numTests", type: "int", value: null }],
      highlight: "numTests",
    });

    steps.push({
      lineNumber: 5,
      description: "יצירת מערך grades עם 100 תאים",
      variables: [
        { name: "numTests", type: "int", value: null },
        { name: "grades", type: "float", value: "[]" },
      ],
      highlight: "grades",
    });

    steps.push({
      lineNumber: 6,
      description: "אתחול sum ל-0",
      variables: [
        { name: "numTests", type: "int", value: null },
        { name: "grades", type: "float", value: "[]" },
        { name: "sum", type: "float", value: 0 },
      ],
      highlight: "sum",
    });

    steps.push({
      lineNumber: 7,
      description: "הצהרה על average",
      variables: [
        { name: "numTests", type: "int", value: null },
        { name: "grades", type: "float", value: "[]" },
        { name: "sum", type: "float", value: 0 },
        { name: "average", type: "float", value: null },
      ],
      highlight: "average",
    });

    steps.push({
      lineNumber: 8,
      description: "הצהרה על i למניין",
      variables: [
        { name: "numTests", type: "int", value: null },
        { name: "grades", type: "float", value: "[]" },
        { name: "sum", type: "float", value: 0 },
        { name: "average", type: "float", value: null },
        { name: "i", type: "int", value: null },
      ],
      highlight: "i",
    });

    // Step 6: Print prompt
    steps.push({
      lineNumber: 10,
      description: "הצגת שאלה: כמה מבחנים?",
      variables: [
        { name: "numTests", type: "int", value: null },
        { name: "grades", type: "float", value: "[]" },
        { name: "sum", type: "float", value: 0 },
        { name: "average", type: "float", value: null },
        { name: "i", type: "int", value: null },
      ],
      output: "How many tests? ",
    });

    // Step 7: Get input
    steps.push({
      lineNumber: 11,
      description: `קליטת מספר המבחנים: ${numTests}`,
      variables: [
        { name: "numTests", type: "int", value: numTests },
        { name: "grades", type: "float", value: "[]" },
        { name: "sum", type: "float", value: 0 },
        { name: "average", type: "float", value: null },
        { name: "i", type: "int", value: null },
      ],
      highlight: "numTests",
      output: `${numTests}`,
    });

    // Step 8: Check condition
    const isValid = numTests > 0 && numTests <= 100;
    steps.push({
      lineNumber: 13,
      description: `בדיקה: האם ${numTests} בין 1 ל-100? ${
        isValid ? "כן ✓" : "לא ✗"
      }`,
      variables: [
        { name: "numTests", type: "int", value: numTests },
        { name: "grades", type: "float", value: "[]" },
        { name: "sum", type: "float", value: 0 },
        { name: "average", type: "float", value: null },
        { name: "i", type: "int", value: null },
      ],
      highlight: "numTests",
    });

    if (!isValid) {
      // Error path
      steps.push({
        lineNumber: 14,
        description: "מספר לא תקין - הצגת הודעת שגיאה",
        variables: [
          { name: "numTests", type: "int", value: numTests },
          { name: "grades", type: "float", value: "[]" },
          { name: "sum", type: "float", value: 0 },
          { name: "average", type: "float", value: null },
          { name: "i", type: "int", value: null },
        ],
        output: "Invalid number!",
      });

      steps.push({
        lineNumber: 15,
        description: "יציאה מהתוכנית עם קוד שגיאה 1",
        variables: [
          { name: "numTests", type: "int", value: numTests },
          { name: "grades", type: "float", value: "[]" },
          { name: "sum", type: "float", value: 0 },
          { name: "average", type: "float", value: null },
          { name: "i", type: "int", value: null },
        ],
      });

      return steps[stepIndex] || steps[0];
    }

    // Valid path - Loop
    steps.push({
      lineNumber: 18,
      description: "התחלת לולאה: i = 0",
      variables: [
        { name: "numTests", type: "int", value: numTests },
        { name: "grades", type: "float", value: "[]" },
        { name: "sum", type: "float", value: 0 },
        { name: "average", type: "float", value: null },
        { name: "i", type: "int", value: 0 },
      ],
      highlight: "i",
    });

    // Loop iterations
    let currentSum = 0;
    for (let iteration = 0; iteration < numTests; iteration++) {
      const currentGrade = grades[iteration] || 0;

      steps.push({
        lineNumber: 19,
        description: `איטרציה ${iteration + 1}: בקשת ציון מספר ${
          iteration + 1
        }`,
        variables: [
          { name: "numTests", type: "int", value: numTests },
          {
            name: "grades",
            type: "float",
            value: `[${grades.slice(0, iteration).join(", ")}]`,
          },
          { name: "sum", type: "float", value: currentSum.toFixed(2) },
          { name: "average", type: "float", value: null },
          { name: "i", type: "int", value: iteration },
        ],
        output: `Enter grade ${iteration + 1}: `,
        highlight: "i",
      });

      steps.push({
        lineNumber: 20,
        description: `קליטת ציון: ${currentGrade}`,
        variables: [
          { name: "numTests", type: "int", value: numTests },
          {
            name: "grades",
            type: "float",
            value: `[${grades.slice(0, iteration + 1).join(", ")}]`,
          },
          { name: "sum", type: "float", value: currentSum.toFixed(2) },
          { name: "average", type: "float", value: null },
          { name: "i", type: "int", value: iteration },
        ],
        output: `${currentGrade}`,
        highlight: "grades",
      });

      currentSum += currentGrade;

      steps.push({
        lineNumber: 21,
        description: `חיבור ${currentGrade} לסכום. סכום חדש: ${currentSum.toFixed(
          2
        )}`,
        variables: [
          { name: "numTests", type: "int", value: numTests },
          {
            name: "grades",
            type: "float",
            value: `[${grades.slice(0, iteration + 1).join(", ")}]`,
          },
          { name: "sum", type: "float", value: currentSum.toFixed(2) },
          { name: "average", type: "float", value: null },
          { name: "i", type: "int", value: iteration },
        ],
        highlight: "sum",
      });

      if (iteration < numTests - 1) {
        steps.push({
          lineNumber: 18,
          description: `חזרה לתחילת הלולאה: i = ${iteration + 1}`,
          variables: [
            { name: "numTests", type: "int", value: numTests },
            {
              name: "grades",
              type: "float",
              value: `[${grades.slice(0, iteration + 1).join(", ")}]`,
            },
            { name: "sum", type: "float", value: currentSum.toFixed(2) },
            { name: "average", type: "float", value: null },
            { name: "i", type: "int", value: iteration + 1 },
          ],
          highlight: "i",
        });
      }
    }

    // Calculate average
    const finalAverage = (currentSum / numTests).toFixed(2);
    steps.push({
      lineNumber: 24,
      description: `חישוב ממוצע: ${currentSum.toFixed(
        2
      )} / ${numTests} = ${finalAverage}`,
      variables: [
        { name: "numTests", type: "int", value: numTests },
        { name: "grades", type: "float", value: `[${grades.join(", ")}]` },
        { name: "sum", type: "float", value: currentSum.toFixed(2) },
        { name: "average", type: "float", value: finalAverage },
        { name: "i", type: "int", value: numTests },
      ],
      highlight: "average",
    });

    // Print result
    steps.push({
      lineNumber: 25,
      description: `הצגת הממוצע: ${finalAverage}`,
      variables: [
        { name: "numTests", type: "int", value: numTests },
        { name: "grades", type: "float", value: `[${grades.join(", ")}]` },
        { name: "sum", type: "float", value: currentSum.toFixed(2) },
        { name: "average", type: "float", value: finalAverage },
        { name: "i", type: "int", value: numTests },
      ],
      output: `Average: ${finalAverage}`,
    });

    // Return
    steps.push({
      lineNumber: 27,
      description: "סיום מוצלח של התוכנית",
      variables: [
        { name: "numTests", type: "int", value: numTests },
        { name: "grades", type: "float", value: `[${grades.join(", ")}]` },
        { name: "sum", type: "float", value: currentSum.toFixed(2) },
        { name: "average", type: "float", value: finalAverage },
        { name: "i", type: "int", value: numTests },
      ],
    });

    return steps[stepIndex] || steps[0];
  },
};
