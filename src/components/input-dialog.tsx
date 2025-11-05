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
  const fields = useMemo<ExampleInputField[]>(
    () => example.inputs ?? [],
    [example.inputs]
  );
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
      onChange: (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      ) =>
        setInputs((prev) => ({
          ...prev,
          [field.key]: event.target.value,
        })),
    };

    if (field.type === "textarea") {
      return (
        <Textarea
          {...commonProps}
          rows={3}
          dir="ltr"
          className="resize-none font-mono"
        />
      );
    }

    return (
      <Input
        {...commonProps}
        type={field.type === "text" ? "text" : "number"}
        dir={field.type === "text" ? "rtl" : "ltr"}
        className="h-11"
      />
    );
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <Card
        className="w-full max-w-lg p-8 shadow-2xl border-2 animate-in zoom-in-95 duration-300"
        dir="rtl"
      >
        <div className="space-y-3 mb-8">
          <h2 className="text-3xl font-bold flex items-center gap-3">
            <span className="text-primary">🎯</span>
            {example.title}
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed">
            הזן ערכי קלט מותאמים לתרגיל שבחרת
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {fields.map((field, index) => (
            <div
              key={field.key}
              className="space-y-2.5 p-4 rounded-lg bg-muted/30 border border-border/50"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <Label htmlFor={field.key} className="text-base font-semibold">
                {field.label}
              </Label>
              {renderInputField(field)}
              {field.helperText && (
                <p className="text-sm text-muted-foreground leading-relaxed flex items-start gap-2">
                  <span className="text-primary shrink-0">ℹ️</span>
                  <span>{field.helperText}</span>
                </p>
              )}
            </div>
          ))}

          <div className="flex gap-3 pt-6 border-t">
            <Button
              type="submit"
              className="flex-1 h-12 text-base font-medium shadow-sm hover:shadow-lg transition-all"
            >
              <span className="flex items-center justify-center gap-2">
                ▶️ התחל סימולציה
              </span>
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="h-12 px-8 font-medium hover:bg-muted transition-colors"
            >
              ביטול
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
