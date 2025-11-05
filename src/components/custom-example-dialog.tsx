"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

import {
  CodeExample,
  CodeLine,
  ExampleInputField,
  ExampleInputType,
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

type CodeLineForm = CodeLine;

interface VariableForm {
  name: string;
  type: VariableType;
  value: string;
}

interface StepForm {
  lineNumber: number;
  description: string;
  highlight?: string;
  output?: string;
  variables: VariableForm[];
}

type InputFieldForm = Omit<
  ExampleInputField,
  "defaultValue" | "placeholder" | "helperText"
> & {
  defaultValue?: string;
  placeholder?: string;
  helperText?: string;
};

const createDefaultVariable = (name = "variable"): VariableForm => ({
  name,
  type: "int",
  value: "0",
});

const createEmptyCodeLine = (lineNumber = 1): CodeLineForm => ({
  lineNumber,
  code: "",
  explanation: "",
});

const createEmptyStep = (lineNumber = 1): StepForm => ({
  lineNumber,
  description: "",
  variables: [createDefaultVariable()],
});

const createEmptyInputField = (index = 1): InputFieldForm => ({
  key: `input${index}`,
  label: `קלט ${index}`,
  type: "number",
  defaultValue: "0",
});

const variableTypeOptions: VariableType[] = [
  "int",
  "float",
  "double",
  "char",
  "string",
  "bool",
];

const inputTypeOptions: ExampleInputType[] = ["number", "text", "textarea"];

const difficultyOptions: CodeExample["difficulty"][] = [
  "basic",
  "intermediate",
  "advanced",
];

const codeCategories: (CodeLine["category"] | undefined)[] = [
  undefined,
  "declaration",
  "input",
  "calculation",
  "condition",
  "loop",
  "output",
];

const difficultyText: Record<CodeExample["difficulty"], string> = {
  basic: "בסיסי",
  intermediate: "בינוני",
  advanced: "מתקדם",
};

const categoryText: Record<string, string> = {
  declaration: "הצהרת משתנים",
  input: "קלט",
  calculation: "חישוב",
  condition: "תנאי",
  loop: "לולאה",
  output: "פלט",
};

const variableTypeText: Record<VariableType, string> = {
  int: "מספר שלם",
  float: "מספר עשרוני",
  double: "דיוק גבוה",
  char: "תו",
  string: "מחרוזת",
  bool: "בוליאני",
};

const inputTypeText: Record<ExampleInputType, string> = {
  number: "מספר",
  text: "טקסט",
  textarea: "טקסט רב שורות",
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9א-ת\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

export function CustomExampleDialog({
  open,
  onOpenChange,
  onSubmit,
}: CustomExampleDialogProps) {
  const [title, setTitle] = useState("דוגמה מותאמת אישית");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState<CodeExample["difficulty"]>("basic");
  const [conceptInput, setConceptInput] = useState("משתנים,לולאות");
  const [codeLines, setCodeLines] = useState<CodeLineForm[]>([
    createEmptyCodeLine(),
  ]);
  const [steps, setSteps] = useState<StepForm[]>([createEmptyStep()]);
  const [inputs, setInputs] = useState<InputFieldForm[]>([]);
  const [error, setError] = useState<string | null>(null);

  const conceptList = useMemo(
    () =>
      conceptInput
        .split(",")
        .map((concept) => concept.trim())
        .filter(Boolean),
    [conceptInput]
  );

  const resetForm = () => {
    setTitle("דוגמה מותאמת אישית");
    setDescription("");
    setDifficulty("basic");
    setConceptInput("משתנים,לולאות");
    setCodeLines([createEmptyCodeLine()]);
    setSteps([createEmptyStep()]);
    setInputs([]);
    setError(null);
  };

  const handleAddCodeLine = () => {
    setCodeLines((prev) => [
      ...prev,
      createEmptyCodeLine(prev.length + 1),
    ]);
  };

  const handleRemoveCodeLine = (index: number) => {
    setCodeLines((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleUpdateCodeLine = (
    index: number,
    key: keyof CodeLineForm,
    value: string | CodeLine["category"]
  ) => {
    setCodeLines((prev) =>
      prev.map((line, idx) => (idx === index ? { ...line, [key]: value } : line))
    );
  };

  const handleAddStep = () => {
    setSteps((prev) => [
      ...prev,
      createEmptyStep(prev.length + 1),
    ]);
  };

  const handleRemoveStep = (index: number) => {
    setSteps((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleUpdateStep = (
    index: number,
    key: keyof StepForm,
    value: string | number | VariableForm[] | undefined
  ) => {
    setSteps((prev) =>
      prev.map((step, idx) =>
        idx === index
          ? {
              ...step,
              [key]: value,
            }
          : step
      )
    );
  };

  const handleAddVariable = (stepIndex: number) => {
    setSteps((prev) =>
      prev.map((step, idx) =>
        idx === stepIndex
          ? {
              ...step,
              variables: [
                ...step.variables,
                createDefaultVariable(`var${step.variables.length + 1}`),
              ],
            }
          : step
      )
    );
  };

  const handleUpdateVariable = (
    stepIndex: number,
    variableIndex: number,
    key: keyof VariableForm,
    value: string | VariableType
  ) => {
    setSteps((prev) =>
      prev.map((step, idx) => {
        if (idx !== stepIndex) return step;
        return {
          ...step,
          variables: step.variables.map((variable, vIdx) =>
            vIdx === variableIndex ? { ...variable, [key]: value } : variable
          ),
        };
      })
    );
  };

  const handleRemoveVariable = (stepIndex: number, variableIndex: number) => {
    setSteps((prev) =>
      prev.map((step, idx) =>
        idx === stepIndex
          ? {
              ...step,
              variables: step.variables.filter((_, vIdx) => vIdx !== variableIndex),
            }
          : step
      )
    );
  };

  const handleAddInputField = () => {
    setInputs((prev) => [
      ...prev,
      createEmptyInputField(prev.length + 1),
    ]);
  };

  const handleRemoveInputField = (index: number) => {
    setInputs((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleUpdateInputField = (
    index: number,
    key: keyof InputFieldForm,
    value: string | ExampleInputType
  ) => {
    setInputs((prev) =>
      prev.map((field, idx) => (idx === index ? { ...field, [key]: value } : field))
    );
  };

  const parseVariableValue = (variable: VariableForm) => {
    if (variable.value.trim() === "") {
      return null;
    }

    if (["int", "float", "double"].includes(variable.type)) {
      const parsed = Number(variable.value);
      return Number.isNaN(parsed) ? 0 : parsed;
    }

    if (variable.type === "bool") {
      return ["true", "1", "כן", "yes"].includes(
        variable.value.toLowerCase()
      );
    }

    return variable.value;
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      setError("יש להזין כותרת לתרגיל");
      return;
    }

    if (!description.trim()) {
      setError("יש להוסיף תיאור קצר שיסביר את התרגיל");
      return;
    }

    if (codeLines.length === 0) {
      setError("יש להגדיר לפחות שורת קוד אחת");
      return;
    }

    if (steps.length === 0) {
      setError("יש להגדיר לפחות שלב אחד לביצוע");
      return;
    }

    const sanitizedCodeLines: CodeLine[] = codeLines.map((line, index) => ({
      lineNumber: Number(line.lineNumber || index + 1),
      code: line.code,
      explanation: line.explanation,
      category: line.category,
    }));

    const sanitizedSteps = steps.map((step, index) => ({
      lineNumber: Number(step.lineNumber || index + 1),
      description: step.description,
      highlight: step.highlight?.trim() || undefined,
      output: step.output?.trim() || undefined,
      variables: step.variables.map<Variable>((variable) => ({
        name: variable.name,
        type: variable.type,
        value: parseVariableValue(variable),
      })),
    }));

    const sanitizedInputs: ExampleInputField[] = inputs.map((field) => ({
      key: field.key,
      label: field.label,
      type: field.type,
      defaultValue: field.defaultValue,
      placeholder: field.placeholder,
      helperText: field.helperText,
    }));

    const definition: CustomExampleDefinition = {
      id: `${slugify(title)}-${Date.now().toString(36)}`,
      title,
      description,
      difficulty,
      concepts: conceptList,
      code: sanitizedCodeLines,
      inputs: sanitizedInputs.length ? sanitizedInputs : undefined,
      steps: sanitizedSteps,
    };

    // Quick sanity check - try to build executor
    createStaticExecutor(definition.steps)(0, [], {});

    onSubmit(definition);
    setError(null);
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
      <DialogContent className="max-w-5xl" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-2xl">יצירת תרגיל חדש</DialogTitle>
          <p className="text-sm text-muted-foreground">
            הגדירו קוד, ערכי קלט, ושלבי ריצה מותאמים אישית להדמיה
          </p>
        </DialogHeader>

        <ScrollArea className="max-h-[65vh] pr-2">
          <Tabs defaultValue="general" className="space-y-6">
            <TabsList className="grid grid-cols-4 gap-2">
              <TabsTrigger value="general">פרטי תרגיל</TabsTrigger>
              <TabsTrigger value="inputs">קלט</TabsTrigger>
              <TabsTrigger value="code">קוד</TabsTrigger>
              <TabsTrigger value="steps">שלבים</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">שם התרגיל</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="למשל: בדיקת מספר ראשוני"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="difficulty">רמת קושי</Label>
                  <Select
                    value={difficulty}
                    onValueChange={(value: CodeExample["difficulty"]) =>
                      setDifficulty(value)
                    }
                  >
                    <SelectTrigger id="difficulty">
                      <SelectValue placeholder="בחר רמת קושי" />
                    </SelectTrigger>
                    <SelectContent>
                      {difficultyOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {difficultyText[option]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">תיאור קצר</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="תארו בקצרה מה התרגיל מדגים"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="concepts">מושגים מרכזיים (מופרדים בפסיקים)</Label>
                <Input
                  id="concepts"
                  value={conceptInput}
                  onChange={(event) => setConceptInput(event.target.value)}
                  placeholder="משתנים, תנאים, לולאות"
                />
                <div className="flex flex-wrap gap-2 pt-2">
                  {conceptList.map((concept) => (
                    <Badge key={concept} variant="outline">
                      {concept}
                    </Badge>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="inputs" className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">שדות קלט</h3>
                  <p className="text-sm text-muted-foreground">
                    הגדירו אילו ערכים המשתמש יזין לפני תחילת ההרצה
                  </p>
                </div>
                <Button type="button" variant="outline" onClick={handleAddInputField}>
                  <Plus className="h-4 w-4" /> הוספת שדה
                </Button>
              </div>

              {inputs.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  אין שדות קלט מוגדרים. הסימולציה תתחיל מיד.
                </p>
              )}

              <div className="space-y-4">
                <AnimatePresence>
                  {inputs.map((field, index) => (
                    <motion.div
                      key={field.key}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="rounded-lg border p-4 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">שדה {index + 1}</h4>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveInputField(index)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>מפתח (key)</Label>
                          <Input
                            value={field.key}
                            onChange={(event) =>
                              handleUpdateInputField(index, "key", event.target.value)
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>כותרת</Label>
                          <Input
                            value={field.label}
                            onChange={(event) =>
                              handleUpdateInputField(index, "label", event.target.value)
                            }
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>סוג שדה</Label>
                          <Select
                            value={field.type}
                            onValueChange={(value: ExampleInputType) =>
                              handleUpdateInputField(index, "type", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="בחרו סוג" />
                            </SelectTrigger>
                            <SelectContent>
                              {inputTypeOptions.map((option) => (
                                <SelectItem key={option} value={option}>
                                  {inputTypeText[option]}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>ערך ברירת מחדל</Label>
                          <Input
                            value={field.defaultValue ?? ""}
                            onChange={(event) =>
                              handleUpdateInputField(
                                index,
                                "defaultValue",
                                event.target.value
                              )
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Placeholder</Label>
                          <Input
                            value={field.placeholder ?? ""}
                            onChange={(event) =>
                              handleUpdateInputField(
                                index,
                                "placeholder",
                                event.target.value
                              )
                            }
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>טקסט עזר</Label>
                        <Textarea
                          value={field.helperText ?? ""}
                          onChange={(event) =>
                            handleUpdateInputField(
                              index,
                              "helperText",
                              event.target.value
                            )
                          }
                          rows={2}
                        />
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </TabsContent>

            <TabsContent value="code" className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">שורות קוד</h3>
                  <p className="text-sm text-muted-foreground">
                    הזינו את שורות הקוד כפי שהן יופיעו בסימולטור
                  </p>
                </div>
                <Button type="button" variant="outline" onClick={handleAddCodeLine}>
                  <Plus className="h-4 w-4" /> הוספת שורה
                </Button>
              </div>

              <div className="space-y-4">
                <AnimatePresence>
                  {codeLines.map((line, index) => (
                    <motion.div
                      key={`code-${index}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="rounded-lg border p-4 space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">שורה {index + 1}</h4>
                        {codeLines.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveCodeLine(index)}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="space-y-2">
                          <Label>מספר שורה</Label>
                          <Input
                            type="number"
                            value={line.lineNumber}
                            onChange={(event) =>
                              handleUpdateCodeLine(
                                index,
                                "lineNumber",
                                Number(event.target.value)
                              )
                            }
                          />
                        </div>
                        <div className="md:col-span-3 space-y-2">
                          <Label>קוד</Label>
                          <Input
                            value={line.code}
                            onChange={(event) =>
                              handleUpdateCodeLine(index, "code", event.target.value)
                            }
                            placeholder={'printf("Hello World!");'}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>הסבר</Label>
                        <Textarea
                          value={line.explanation}
                          onChange={(event) =>
                            handleUpdateCodeLine(
                              index,
                              "explanation",
                              event.target.value
                            )
                          }
                          rows={2}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>קטגוריה</Label>
                        <Select
                          value={line.category ?? ""}
                          onValueChange={(value) =>
                            handleUpdateCodeLine(
                              index,
                              "category",
                              value === "" ? undefined : (value as CodeLine["category"])
                            )
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="בחר קטגוריה" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">ללא</SelectItem>
                            {codeCategories
                              .filter((category): category is CodeLine["category"] => !!category)
                              .map((category) => (
                                <SelectItem key={category} value={category}>
                                  {categoryText[category]}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </TabsContent>

            <TabsContent value="steps" className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">שלבי הסימולציה</h3>
                  <p className="text-sm text-muted-foreground">
                    הגדירו מה קורה בכל שלב, אילו משתנים קיימים ומה מוצג למשתמש
                  </p>
                </div>
                <Button type="button" variant="outline" onClick={handleAddStep}>
                  <Plus className="h-4 w-4" /> הוספת שלב
                </Button>
              </div>

              <div className="space-y-4">
                <AnimatePresence>
                  {steps.map((step, index) => (
                    <motion.div
                      key={`step-${index}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="rounded-lg border p-4 space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">שלב {index + 1}</h4>
                        {steps.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveStep(index)}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="space-y-2">
                          <Label>מספר שורה</Label>
                          <Input
                            type="number"
                            value={step.lineNumber}
                            onChange={(event) =>
                              handleUpdateStep(
                                index,
                                "lineNumber",
                                Number(event.target.value)
                              )
                            }
                          />
                        </div>
                        <div className="md:col-span-3 space-y-2">
                          <Label>תיאור השלב</Label>
                          <Textarea
                            value={step.description}
                            onChange={(event) =>
                              handleUpdateStep(index, "description", event.target.value)
                            }
                            rows={2}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>Highlight משתנה</Label>
                          <Input
                            value={step.highlight ?? ""}
                            onChange={(event) =>
                              handleUpdateStep(index, "highlight", event.target.value)
                            }
                            placeholder="שם המשתנה להדגשה"
                          />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                          <Label>פלט</Label>
                          <Input
                            value={step.output ?? ""}
                            onChange={(event) =>
                              handleUpdateStep(index, "output", event.target.value)
                            }
                            placeholder="הודעה שתופיע במסך הפלט"
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <h5 className="font-semibold">משתנים בשלב</h5>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleAddVariable(index)}
                          >
                            <Plus className="h-4 w-4" /> הוספת משתנה
                          </Button>
                        </div>

                        <div className="space-y-3">
                          {step.variables.map((variable, variableIndex) => (
                            <div
                              key={`${index}-${variableIndex}`}
                              className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end"
                            >
                              <div className="space-y-2 md:col-span-2">
                                <Label>שם משתנה</Label>
                                <Input
                                  value={variable.name}
                                  onChange={(event) =>
                                    handleUpdateVariable(
                                      index,
                                      variableIndex,
                                      "name",
                                      event.target.value
                                    )
                                  }
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>טיפוס</Label>
                                <Select
                                  value={variable.type}
                                  onValueChange={(value: VariableType) =>
                                    handleUpdateVariable(
                                      index,
                                      variableIndex,
                                      "type",
                                      value
                                    )
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="בחרו טיפוס" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {variableTypeOptions.map((option) => (
                                      <SelectItem key={option} value={option}>
                                        {variableTypeText[option]}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2 md:col-span-2">
                                <Label>ערך</Label>
                                <Input
                                  value={variable.value}
                                  onChange={(event) =>
                                    handleUpdateVariable(
                                      index,
                                      variableIndex,
                                      "value",
                                      event.target.value
                                    )
                                  }
                                />
                              </div>
                              {step.variables.length > 1 && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() =>
                                    handleRemoveVariable(index, variableIndex)
                                  }
                                  className="text-muted-foreground hover:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </TabsContent>
          </Tabs>
        </ScrollArea>

        <DialogFooter className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="flex gap-2 w-full sm:w-auto">
            <Button type="button" variant="outline" className="flex-1 sm:flex-none" onClick={() => handleClose(false)}>
              ביטול
            </Button>
            <Button type="button" className="flex-1 sm:flex-none" onClick={handleSubmit}>
              שמירת תרגיל
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
