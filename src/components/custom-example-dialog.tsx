"use client";

import { useMemo, useRef, useState } from "react";
import { Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";

import {
  CodeLine,
  ExecutionStep,
  ExampleInputField,
  ExampleInputType,
  StepInputRequest,
  Variable,
  VariableType,
} from "@/types/code-demo";
import { CustomExampleDefinition } from "@/types/custom-example";
import { createStaticExecutor } from "@/lib/execution-helpers";

interface CustomExampleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (definition: CustomExampleDefinition) => void;
}

interface VariableForm {
  id: string;
  name: string;
  type: VariableType;
  initialValue: string;
  requireInput: boolean;
}

const difficultyOptions: CustomExampleDefinition["difficulty"][] = [
  "basic",
  "intermediate",
  "advanced",
];

const difficultyText: Record<CustomExampleDefinition["difficulty"], string> = {
  basic: "בסיסי",
  intermediate: "בינוני",
  advanced: "מתקדם",
};

const variableTypeOptions: VariableType[] = [
  "int",
  "float",
  "double",
  "char",
  "string",
  "bool",
];

const variableTypeLabels: Record<VariableType, string> = {
  int: "מספר שלם (int)",
  float: "מספר עשרוני (float)",
  double: "מספר עשרוני מדויק (double)",
  char: "תו אחד (char)",
  string: "מחרוזת (char[])",
  bool: "ערך בוליאני (bool)",
};

const snippetPresets: {
  label: string;
  description: string;
  snippet: string;
}[] = [
  {
    label: "printf",
    description: "הדפסת הודעה למסך",
    snippet: 'printf("Hello World\\n");',
  },
  {
    label: "scanf מספר שלם",
    description: "קליטת מספר שלם מהמשתמש",
    snippet: 'scanf("%d", &variable);',
  },
  {
    label: "scanf עשרוני",
    description: "קליטת מספר עשרוני מהמשתמש",
    snippet: 'scanf("%f", &variable);',
  },
  {
    label: "if",
    description: "מבנה תנאי בסיסי",
    snippet: "if (condition) {\n    // code\n}",
  },
  {
    label: "for",
    description: "לולאת for סטנדרטית",
    snippet: "for (int i = 0; i < count; i++) {\n    // code\n}",
  },
];

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9א-ת\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

const generateId = () =>
  typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);

const mapVariableTypeToInputType = (type: VariableType): ExampleInputType => {
  if (type === "int" || type === "float" || type === "double") {
    return "number";
  }
  return "text";
};

const parseInitialValue = (type: VariableType, value: string) => {
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  if (type === "int") {
    const parsed = Number.parseInt(trimmed, 10);
    return Number.isFinite(parsed) ? parsed : null;
  }

  if (type === "float" || type === "double") {
    const parsed = Number(trimmed);
    return Number.isFinite(parsed) ? parsed : null;
  }

  if (type === "bool") {
    const normalized = trimmed.toLowerCase();
    return ["true", "1", "כן", "yes"].includes(normalized);
  }

  if (type === "char") {
    const match = trimmed.match(/'(.+)'/);
    if (match && match[1]) {
      return match[1].charAt(0);
    }
    return trimmed.charAt(0);
  }

  return trimmed;
};

const detectCategory = (line: string): CodeLine["category"] | undefined => {
  if (!line) return undefined;
  if (line.includes("printf")) return "output";
  if (line.includes("scanf")) return "input";
  if (/for\s*\(|while\s*\(/.test(line)) return "loop";
  if (/if\s*\(|switch\s*\(/.test(line)) return "condition";
  if (/\b(int|float|double|char|bool)\b/.test(line)) return "declaration";
  if (/=/.test(line)) return "calculation";
  return undefined;
};

const describeLine = (line: string): string => {
  if (!line) return "";
  if (line.includes("printf")) return "הדפסת הודעה למסך";
  if (line.includes("scanf")) return "קליטת ערך מהמשתמש";
  if (/for\s*\(/.test(line)) return "התחלת לולאת for";
  if (/while\s*\(/.test(line)) return "התחלת לולאת while";
  if (/if\s*\(/.test(line)) return "בדיקת תנאי";
  if (/return/.test(line)) return "חזרה מהפונקציה";
  if (/=/.test(line)) return "ביצוע חישוב או השמה";
  return "ביצוע פקודת קוד";
};

const guessHighlight = (line: string): string | undefined => {
  const assignmentMatch = line.match(/([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*/);
  if (assignmentMatch) return assignmentMatch[1];
  const scanfMatch = line.match(/&\s*([a-zA-Z_][a-zA-Z0-9_]*)/);
  if (scanfMatch) return scanfMatch[1];
  return undefined;
};

const extractPrintfOutput = (line: string): string | undefined => {
  const match = line.match(/printf\s*\(\s*"([^"]*)"/);
  if (!match) return undefined;
  return match[1].replace(/\\n/g, "\n");
};

const createInputRequestFromLine = (
  line: string,
  variables: VariableForm[]
): StepInputRequest | undefined => {
  if (!line.includes("scanf")) return undefined;

  const variableMatch = line.match(/&\s*([a-zA-Z_][a-zA-Z0-9_]*)/);
  if (!variableMatch) return undefined;

  const variableName = variableMatch[1];
  const variable = variables.find((item) => item.name === variableName);
  const requestType = mapVariableTypeToInputType(variable?.type ?? "string");

  return {
    key: variableName,
    prompt: `הזינו ערך עבור ${variableName}`,
    label: `ערך עבור ${variableName}`,
    helperText: variable
      ? `טיפוס הנתונים: ${variableTypeLabels[variable.type]}`
      : undefined,
    type: requestType,
    defaultValue: variable?.initialValue ?? "",
    applyValue: (currentInputs, newValue) => {
      if (requestType === "number") {
        const parsed = Number(newValue);
        return {
          ...currentInputs,
          [variableName]: Number.isFinite(parsed) ? parsed : 0,
        };
      }

      return {
        ...currentInputs,
        [variableName]: newValue,
      };
    },
  };
};

const buildInputFields = (variables: VariableForm[]): ExampleInputField[] =>
  variables
    .filter((variable) => variable.requireInput)
    .map((variable) => ({
      key: variable.name,
      label: `ערך עבור ${variable.name}`,
      type: mapVariableTypeToInputType(variable.type),
      defaultValue: variable.initialValue || undefined,
      helperText: `טיפוס המשתנה: ${variableTypeLabels[variable.type]}`,
    }));

const generateCodeLines = (
  variables: VariableForm[],
  codeBody: string
): CodeLine[] => {
  const lines: CodeLine[] = [];
  let lineNumber = 1;

  lines.push({
    lineNumber: lineNumber++,
    code: "#include <stdio.h>",
    explanation: "ספריית קלט/פלט סטנדרטית",
    category: "declaration",
  });

  lines.push({ lineNumber: lineNumber++, code: "", explanation: "" });

  lines.push({
    lineNumber: lineNumber++,
    code: "int main() {",
    explanation: "פונקציית main של התוכנית",
  });

  variables.forEach((variable) => {
    const trimmedValue = variable.initialValue.trim();
    const declaration = `    ${variable.type} ${variable.name}${
      trimmedValue ? ` = ${trimmedValue}` : ""
    };`;
    lines.push({
      lineNumber: lineNumber++,
      code: declaration,
      explanation: `הצהרה על ${variable.name}`,
      category: "declaration",
    });
  });

  if (variables.length > 0) {
    lines.push({ lineNumber: lineNumber++, code: "", explanation: "" });
  }

  const userLines = codeBody.split("\n");
  userLines.forEach((rawLine) => {
    const trimmed = rawLine.replace(/^\s+/, "");
    const code = trimmed ? `    ${trimmed}` : "";
    lines.push({
      lineNumber: lineNumber++,
      code,
      explanation: describeLine(trimmed),
      category: detectCategory(trimmed),
    });
  });

  if (userLines.length === 0 || userLines[userLines.length - 1].trim() !== "") {
    lines.push({ lineNumber: lineNumber++, code: "", explanation: "" });
  }

  lines.push({
    lineNumber: lineNumber++,
    code: "    return 0;",
    explanation: "סיום התוכנית בהצלחה",
  });

  lines.push({
    lineNumber: lineNumber,
    code: "}",
    explanation: "סוף פונקציית main",
  });

  return lines;
};

const cloneVariables = (variables: Variable[]) =>
  variables.map((variable) => ({ ...variable }));

const generateSteps = (
  variables: VariableForm[],
  codeLines: CodeLine[]
): ExecutionStep[] => {
  const steps: ExecutionStep[] = [];
  const state: Variable[] = [];

  const mainLine = codeLines.find((line) => line.code.includes("int main"));
  steps.push({
    lineNumber: mainLine?.lineNumber ?? 1,
    description: "התוכנית מתחילה לרוץ",
    variables: [],
  });

  variables.forEach((variable) => {
    const value = parseInitialValue(variable.type, variable.initialValue);
    state.push({ name: variable.name, type: variable.type, value });
    const declarationLine = codeLines.find((line) =>
      line.code.includes(`${variable.type} ${variable.name}`)
    );
    steps.push({
      lineNumber: declarationLine?.lineNumber ?? mainLine?.lineNumber ?? 1,
      description: `הצהרה על ${variable.name}`,
      variables: cloneVariables(state),
      highlight: variable.name,
    });
  });

  codeLines.forEach((line) => {
    const trimmed = line.code.trim();
    if (!trimmed) return;
    if (
      trimmed === "int main() {" ||
      trimmed === "return 0;" ||
      trimmed === "}"
    )
      return;
    if (trimmed.startsWith("#include")) return;

    const description = describeLine(trimmed);
    const highlight = guessHighlight(trimmed);
    const output = extractPrintfOutput(trimmed);
    const inputRequest = createInputRequestFromLine(trimmed, variables);

    steps.push({
      lineNumber: line.lineNumber,
      description,
      variables: cloneVariables(state),
      ...(highlight ? { highlight } : {}),
      ...(output ? { output } : {}),
      ...(inputRequest ? { inputRequest } : {}),
    });
  });

  const lastLine = codeLines[codeLines.length - 1];
  steps.push({
    lineNumber: lastLine?.lineNumber ?? mainLine?.lineNumber ?? 1,
    description: "סיום התוכנית",
    variables: cloneVariables(state),
  });

  return steps;
};

const createVariableForm = (): VariableForm => ({
  id: generateId(),
  name: "",
  type: "int",
  initialValue: "",
  requireInput: false,
});

export function CustomExampleDialog({
  open,
  onOpenChange,
  onSubmit,
}: CustomExampleDialogProps) {
  const [title, setTitle] = useState("תרגיל חדש");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] =
    useState<CustomExampleDefinition["difficulty"]>("basic");
  const [conceptInput, setConceptInput] = useState("משתנים,פלט");
  const [variables, setVariables] = useState<VariableForm[]>([
    createVariableForm(),
  ]);
  const [codeBody, setCodeBody] = useState<string>('printf("Hello World\\n");');
  const [error, setError] = useState<string | null>(null);

  const codeEditorRef = useRef<HTMLTextAreaElement | null>(null);

  const conceptList = useMemo(
    () =>
      conceptInput
        .split(",")
        .map((concept) => concept.trim())
        .filter(Boolean),
    [conceptInput]
  );

  const resetForm = () => {
    setTitle("תרגיל חדש");
    setDescription("");
    setDifficulty("basic");
    setConceptInput("משתנים,פלט");
    setVariables([createVariableForm()]);
    setCodeBody('printf("Hello World\\n");');
    setError(null);
  };

  const handleAddVariable = () => {
    setVariables((prev) => [...prev, createVariableForm()]);
  };

  const handleRemoveVariable = (id: string) => {
    setVariables((prev) => prev.filter((variable) => variable.id !== id));
  };

  const handleVariableChange = <K extends keyof VariableForm>(
    id: string,
    key: K,
    value: VariableForm[K]
  ) => {
    setVariables((prev) =>
      prev.map((variable) =>
        variable.id === id ? { ...variable, [key]: value } : variable
      )
    );
  };

  const handleInsertSnippet = (snippet: string) => {
    const textarea = codeEditorRef.current;
    if (!textarea) {
      setCodeBody((prev) => (prev ? `${prev}\n${snippet}` : snippet));
      return;
    }

    const { selectionStart, selectionEnd } = textarea;
    setCodeBody((prev) => {
      const before = prev.slice(0, selectionStart);
      const after = prev.slice(selectionEnd);
      return `${before}${snippet}${after}`;
    });

    if (typeof window !== "undefined") {
      window.requestAnimationFrame(() => {
        const cursor = selectionStart + snippet.length;
        textarea.focus();
        textarea.setSelectionRange(cursor, cursor);
      });
    }
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      setError("יש להזין כותרת לתרגיל");
      return;
    }

    if (!description.trim()) {
      setError("יש להוסיף תיאור קצר ומזמין לתרגיל");
      return;
    }

    const hasVariableNames = variables.every((variable) =>
      variable.name.trim()
    );
    if (!hasVariableNames) {
      setError("כל המשתנים חייבים שם ייחודי");
      return;
    }

    const codeLines = generateCodeLines(variables, codeBody);
    const steps = generateSteps(variables, codeLines);
    const inputs = buildInputFields(variables);

    const definition: CustomExampleDefinition = {
      id: `${slugify(title)}-${Date.now().toString(36)}`,
      title,
      description,
      difficulty,
      concepts: conceptList,
      code: codeLines,
      inputs: inputs.length ? inputs : undefined,
      steps,
    };

    try {
      createStaticExecutor(steps)(0, [], {});
    } catch (exception) {
      console.error(exception);
      setError("אירעה שגיאה בבדיקת התרגיל. בדקו שהקוד והשלבים תקינים.");
      return;
    }

    onSubmit(definition);
    resetForm();
    onOpenChange(false);
  };

  const handleClose = (openState: boolean) => {
    if (!openState) {
      resetForm();
    }
    onOpenChange(openState);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className="min-w-6xl max-h-[90vh] flex flex-col overflow-hidden"
        dir="rtl"
      >
        <DialogHeader className="space-y-3 pb-6 border-b shrink-0">
          <DialogTitle className="text-3xl font-bold flex items-center gap-3">
            <span className="text-primary">✨</span>
            יצירת תרגיל חדש בפשטות
          </DialogTitle>
          <DialogDescription className="text-base text-right text-muted-foreground leading-relaxed">
            הגדירו את פרטי התרגיל, המשתנים והקוד. מעטפת ה-main וה-return מתווספת
            אוטומטית.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea dir="rtl" className="flex-1 pr-4 overflow-y-auto">
          <div className="space-y-6 py-2">
            <Card className="p-6 space-y-5 border-2 bg-card/50">
              <div className="space-y-2">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <span className="text-2xl">📝</span>
                  פרטי התרגיל
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  תארו בקצרה את התרגיל והגדירו את רמת הקושי.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2.5">
                  <Label
                    htmlFor="custom-title"
                    className="text-base font-medium"
                  >
                    שם התרגיל
                  </Label>
                  <Input
                    id="custom-title"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="לדוגמה: סכום שני מספרים"
                    className="h-11"
                  />
                </div>
                <div className="space-y-2.5">
                  <Label
                    htmlFor="custom-difficulty"
                    className="text-base font-medium"
                  >
                    רמת קושי
                  </Label>
                  <Select
                    value={difficulty}
                    onValueChange={(
                      value: CustomExampleDefinition["difficulty"]
                    ) => setDifficulty(value)}
                  >
                    <SelectTrigger id="custom-difficulty" className="h-11">
                      <SelectValue placeholder="בחרו רמת קושי" />
                    </SelectTrigger>
                    <SelectContent>
                      {difficultyOptions.map((option) => (
                        <SelectItem
                          key={option}
                          value={option}
                          className="text-base"
                        >
                          {difficultyText[option]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2.5 md:col-span-2">
                <Label
                  htmlFor="custom-description"
                  className="text-base font-medium"
                >
                  תיאור קצר
                </Label>
                <Textarea
                  id="custom-description"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  rows={2}
                  placeholder="ספרו מה לומדים בתרגיל"
                  className="resize-none"
                />
              </div>

              <div className="space-y-2.5 md:col-span-2">
                <Label
                  htmlFor="custom-concepts"
                  className="text-base font-medium"
                >
                  מושגים מרכזיים (מופרדים בפסיקים)
                </Label>
                <Input
                  id="custom-concepts"
                  value={conceptInput}
                  onChange={(event) => setConceptInput(event.target.value)}
                  placeholder="משתנים, תנאים, לולאות"
                  className="h-11"
                />
                {conceptList.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {conceptList.map((concept) => (
                      <Badge
                        key={concept}
                        variant="secondary"
                        className="text-sm px-3 py-1"
                      >
                        {concept}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </Card>

            <Card className="p-6 space-y-4 border-2 bg-card/50">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    <span className="text-2xl">🔢</span>
                    משתנים
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mt-1">
                    הגדירו את המשתנים הראשיים בטבלה נוחה. ניתן לסמן משתנה לקבלת
                    קלט מהמשתמש.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="default"
                  onClick={handleAddVariable}
                  className="gap-2 h-10 px-5 shadow-sm hover:shadow transition-all shrink-0"
                >
                  <Plus className="h-4 w-4" />
                  <span className="font-medium">הוספת משתנה</span>
                </Button>
              </div>

              {variables.length === 0 ? (
                <div className="rounded-lg border-2 border-dashed p-12 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="text-5xl opacity-50">🔢</div>
                    <h4 className="text-lg font-semibold text-muted-foreground">
                      עדיין לא הוספתם משתנים
                    </h4>
                    <p className="text-sm text-muted-foreground max-w-md">
                      לחצו על כפתור &ldquo;הוספת משתנה&rdquo; כדי להתחיל להגדיר
                      את המשתנים שלכם
                    </p>
                  </div>
                </div>
              ) : (
                <div className="rounded-lg border-2 overflow-hidden shadow-sm">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="w-48 font-semibold text-base">
                          שם המשתנה
                        </TableHead>
                        <TableHead className="w-52 font-semibold text-base">
                          טיפוס
                        </TableHead>
                        <TableHead className="font-semibold text-base">
                          ערך התחלתי
                        </TableHead>
                        <TableHead className="w-40 text-center font-semibold text-base">
                          קלט מהמשתמש
                        </TableHead>
                        <TableHead className="w-20" />
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {variables.map((variable, index) => (
                        <TableRow
                          key={variable.id}
                          className={index % 2 === 0 ? "bg-muted/20" : ""}
                        >
                          <TableCell className="p-3">
                            <Input
                              value={variable.name}
                              onChange={(event) =>
                                handleVariableChange(
                                  variable.id,
                                  "name",
                                  event.target.value
                                )
                              }
                              placeholder="לדוגמה: total"
                              className="h-10"
                            />
                          </TableCell>
                          <TableCell className="p-3">
                            <Select
                              value={variable.type}
                              onValueChange={(value: VariableType) =>
                                handleVariableChange(variable.id, "type", value)
                              }
                            >
                              <SelectTrigger className="h-10">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {variableTypeOptions.map((option) => (
                                  <SelectItem
                                    key={option}
                                    value={option}
                                    className="text-base"
                                  >
                                    {variableTypeLabels[option]}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell className="p-3">
                            <Input
                              value={variable.initialValue}
                              onChange={(event) =>
                                handleVariableChange(
                                  variable.id,
                                  "initialValue",
                                  event.target.value
                                )
                              }
                              placeholder="אופציונלי"
                              className="h-10"
                            />
                          </TableCell>
                          <TableCell className="text-center p-3">
                            <div className="flex items-center justify-center">
                              <Switch
                                checked={variable.requireInput}
                                onCheckedChange={(checked) =>
                                  handleVariableChange(
                                    variable.id,
                                    "requireInput",
                                    checked
                                  )
                                }
                                aria-label="קלט מהמשתמש"
                              />
                            </div>
                          </TableCell>
                          <TableCell className="text-center p-3">
                            {variables.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                  handleRemoveVariable(variable.id)
                                }
                                className="h-9 w-9 hover:bg-destructive/10 hover:text-destructive transition-colors"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </Card>

            <Card className="p-6 space-y-4 border-2 bg-card/50">
              <div>
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <span className="text-2xl">⚙️</span>
                  בניית הקוד
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mt-1">
                  כתבו את גוף הפונקציה בלבד. מעטפת הקוד נוספה עבורכם. ניתן
                  להשתמש בכפתורים להוספת קטעי קוד שכיחים.
                </p>
              </div>

              <div className="space-y-3">
                <Label className="text-base font-medium">קטעי קוד מהירים</Label>
                <div className="flex flex-wrap gap-2">
                  {snippetPresets.map((preset) => (
                    <Button
                      key={preset.label}
                      type="button"
                      variant="outline"
                      onClick={() => handleInsertSnippet(preset.snippet)}
                      className="flex items-center gap-2 h-9 text-sm hover:bg-primary/10 hover:border-primary/50 transition-colors"
                      title={preset.description}
                    >
                      <Plus className="h-3.5 w-3.5" />
                      {preset.label}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="code-editor" className="text-base font-medium">
                  קוד התרגיל
                </Label>
                <Textarea
                  id="code-editor"
                  ref={codeEditorRef}
                  value={codeBody}
                  onChange={(event) => setCodeBody(event.target.value)}
                  rows={10}
                  dir="ltr"
                  placeholder='// כתבו כאן את הקוד שלכם&#10;// לדוגמה:&#10;int sum = a + b;&#10;printf("Sum: %d", sum);'
                  className="font-mono text-sm resize-none"
                />
              </div>
            </Card>
          </div>
        </ScrollArea>

        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-4 pt-6 border-t mt-auto shrink-0">
          {error && (
            <div className="w-full sm:flex-1">
              <div className="text-sm text-destructive font-medium bg-destructive/10 px-4 py-3 rounded-lg border border-destructive/20 flex items-start gap-2">
                <span className="text-lg shrink-0">⚠️</span>
                <span>{error}</span>
              </div>
            </div>
          )}
          <div className="flex gap-3 w-full sm:w-auto sm:ml-auto shrink-0">
            <Button
              type="button"
              variant="outline"
              className="flex-1 sm:flex-none h-12 px-8 font-medium text-base hover:bg-muted transition-colors"
              onClick={() => handleClose(false)}
            >
              ביטול
            </Button>
            <Button
              type="button"
              className="flex-1 sm:flex-none h-12 px-8 font-medium text-base shadow-sm hover:shadow-lg transition-all bg-primary hover:bg-primary/90"
              onClick={handleSubmit}
            >
              <span className="flex items-center gap-2">✨ שמירת תרגיל</span>
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
