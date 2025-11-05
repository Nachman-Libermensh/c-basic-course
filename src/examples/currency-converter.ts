import { CodeExample, ExecutionStep, Variable } from "@/types/code-demo";

const TOTAL_STEPS = 10;

export const currencyConverterExample: CodeExample = {
  id: "currency-converter",
  title: "המרת מטבעות - דולר לשקל",
  description:
    "תוכנית פשוטה להמרת דולרים לשקלים. מדגימה: הצהרת משתנים, קלט, חישוב אריתמטי ופלט",
  difficulty: "basic",
  concepts: ["variables", "input", "arithmetic", "output"],
  source: "built-in",
  inputs: [
    {
      key: "dollars",
      label: "סכום בדולרים",
      type: "number",
      defaultValue: "100",
      placeholder: "לדוגמה: 250",
    },
  ],
  code: [
    {
      lineNumber: 1,
      code: "#include <stdio.h>",
      explanation: "ספריית קלט/פלט סטנדרטית",
      category: "declaration",
    },
    {
      lineNumber: 2,
      code: "",
      explanation: "",
    },
    {
      lineNumber: 3,
      code: "int main() {",
      explanation: "פונקציית main - נקודת כניסה לתוכנית",
    },
    {
      lineNumber: 4,
      code: "    float dollars;",
      explanation: "הצהרה על משתנה dollars מסוג float",
      category: "declaration",
    },
    {
      lineNumber: 5,
      code: "    float exchangeRate = 3.7;",
      explanation: "הצהרה ואתחול של שער החליפין",
      category: "declaration",
    },
    {
      lineNumber: 6,
      code: "    float shekels;",
      explanation: "הצהרה על משתנה shekels לתוצאה",
      category: "declaration",
    },
    {
      lineNumber: 7,
      code: "",
      explanation: "",
    },
    {
      lineNumber: 8,
      code: '    printf("Enter amount in dollars: ");',
      explanation: "הצגת הודעה למשתמש",
      category: "output",
    },
    {
      lineNumber: 9,
      code: '    scanf("%f", &dollars);',
      explanation: "קליטת ערך מהמשתמש",
      category: "input",
    },
    {
      lineNumber: 10,
      code: "",
      explanation: "",
    },
    {
      lineNumber: 11,
      code: "    shekels = dollars * exchangeRate;",
      explanation: "חישוב ההמרה: כפל סכום בשער",
      category: "calculation",
    },
    {
      lineNumber: 12,
      code: "",
      explanation: "",
    },
    {
      lineNumber: 13,
      code: '    printf("%.2f dollars = %.2f shekels\\n", dollars, shekels);',
      explanation: "הצגת התוצאה למשתמש",
      category: "output",
    },
    {
      lineNumber: 14,
      code: "    return 0;",
      explanation: "סיום מוצלח של התוכנית",
    },
    {
      lineNumber: 15,
      code: "}",
      explanation: "סוף הפונקציה",
    },
  ],
  initialVariables: [],
  totalSteps: TOTAL_STEPS,
  executeStep: (
    stepIndex: number,
    currentVars: Variable[],
    inputs?: Record<string, string | number>
  ): ExecutionStep => {
    const dollars = Number(inputs?.dollars ?? 100);
    const shekelsValue = Number((dollars * 3.7).toFixed(2));

    const steps: ExecutionStep[] = [
      {
        lineNumber: 3,
        description: "התוכנית מתחילה לרוץ",
        variables: [],
      },
      {
        lineNumber: 4,
        description: "הצהרה על משתנה dollars - מקצה מקום בזיכרון למספר עשרוני",
        variables: [{ name: "dollars", type: "float", value: null }],
        highlight: "dollars",
      },
      {
        lineNumber: 5,
        description: "יצירת משתנה exchangeRate עם ערך התחלתי 3.7",
        variables: [
          { name: "dollars", type: "float", value: null },
          { name: "exchangeRate", type: "float", value: 3.7 },
        ],
        highlight: "exchangeRate",
      },
      {
        lineNumber: 6,
        description: "הצהרה על משתנה shekels לאחסון התוצאה",
        variables: [
          { name: "dollars", type: "float", value: null },
          { name: "exchangeRate", type: "float", value: 3.7 },
          { name: "shekels", type: "float", value: null },
        ],
        highlight: "shekels",
      },
      {
        lineNumber: 8,
        description: 'הצגת הודעה למשתמש: "Enter amount in dollars: "',
        variables: [
          { name: "dollars", type: "float", value: null },
          { name: "exchangeRate", type: "float", value: 3.7 },
          { name: "shekels", type: "float", value: null },
        ],
        output: "Enter amount in dollars: ",
      },
      {
        lineNumber: 9,
        description: "קליטת ערך מהמשתמש ושמירה במשתנה dollars",
        variables: [
          { name: "dollars", type: "float", value: dollars },
          { name: "exchangeRate", type: "float", value: 3.7 },
          { name: "shekels", type: "float", value: null },
        ],
        highlight: "dollars",
        output: `${dollars}`,
      },
      {
        lineNumber: 11,
        description: "ביצוע חישוב: הכפלת הדולרים בשער החליפין",
        variables: [
          { name: "dollars", type: "float", value: dollars },
          { name: "exchangeRate", type: "float", value: 3.7 },
          { name: "shekels", type: "float", value: shekelsValue },
        ],
        highlight: "shekels",
      },
      {
        lineNumber: 13,
        description: "הצגת התוצאה: סכום הדולרים וההמרה לשקלים",
        variables: [
          { name: "dollars", type: "float", value: dollars },
          { name: "exchangeRate", type: "float", value: 3.7 },
          { name: "shekels", type: "float", value: shekelsValue },
        ],
        output: `${dollars.toFixed(2)} dollars = ${shekelsValue.toFixed(2)} shekels`,
      },
      {
        lineNumber: 14,
        description: "החזרת 0 - סיום מוצלח של התוכנית",
        variables: [
          { name: "dollars", type: "float", value: dollars },
          { name: "exchangeRate", type: "float", value: 3.7 },
          { name: "shekels", type: "float", value: shekelsValue },
        ],
      },
      {
        lineNumber: 15,
        description: "סיום התוכנית",
        variables: [
          { name: "dollars", type: "float", value: dollars },
          { name: "exchangeRate", type: "float", value: 3.7 },
          { name: "shekels", type: "float", value: shekelsValue },
        ],
      },
    ];

    return steps[stepIndex] || steps[steps.length - 1];
  },
};
