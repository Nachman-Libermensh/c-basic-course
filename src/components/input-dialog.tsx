"use client";

import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CodeExample, ExampleInputField } from "@/types/code-demo";

interface InputDialogProps {
  example: CodeExample;
  onSubmit: (inputs: Record<string, string | number>) => void;
  onCancel: () => void;
  initialValues?: Record<string, string | number>;
}

export function InputDialog({
  example,
  onSubmit,
  onCancel,
  initialValues = {},
}: InputDialogProps) {
  const fields = useMemo<ExampleInputField[]>(() => example.inputs ?? [], [
    example.inputs,
  ]);
  const [inputs, setInputs] = useState<Record<string, string>>(() => {
    const defaults: Record<string, string> = {};
    fields.forEach((field) => {
      const initial = initialValues[field.key];
      if (initial !== undefined && initial !== null) {
        defaults[field.key] = String(initial);
      } else if (field.defaultValue !== undefined) {
        defaults[field.key] = field.defaultValue;
      }
    });
    return defaults;
  });

  useEffect(() => {
    if (fields.length === 0) {
      onSubmit({});
    }
  }, [fields.length, onSubmit]);

  if (fields.length === 0) {
    return null;
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const processedInputs: Record<string, string | number> = {};

    fields.forEach((field) => {
      const value = inputs[field.key] ?? field.defaultValue ?? "";
      if (field.type === "number") {
        processedInputs[field.key] = Number(value);
      } else {
        processedInputs[field.key] = value;
      }
    });

    onSubmit(processedInputs);
  };

  const renderInputField = (field: ExampleInputField) => {
    const commonProps = {
      id: field.key,
      defaultValue: inputs[field.key] ?? field.defaultValue ?? "",
      placeholder: field.placeholder ?? field.defaultValue ?? "",
      onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setInputs((prev) => ({
          ...prev,
          [field.key]: event.target.value,
        })),
    };

    if (field.type === "textarea") {
      return <Textarea {...commonProps} rows={3} dir="ltr" />;
    }

    return (
      <Input
        {...commonProps}
        type={field.type === "text" ? "text" : "number"}
        dir={field.type === "text" ? "rtl" : "ltr"}
      />
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-lg p-6" dir="rtl">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">{example.title}</h2>
          <p className="text-sm text-muted-foreground">
            הזן ערכי קלט מותאמים לתרגיל שבחרת
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          {fields.map((field) => (
            <div key={field.key} className="space-y-2">
              <Label htmlFor={field.key}>{field.label}</Label>
              {renderInputField(field)}
              {field.helperText && (
                <p className="text-xs text-muted-foreground">{field.helperText}</p>
              )}
            </div>
          ))}

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1">
              התחל סימולציה
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              ביטול
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
