"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CodeExample } from "@/types/code-demo";

interface InputDialogProps {
  example: CodeExample;
  onSubmit: (inputs: Record<string, string | number>) => void;
  onCancel: () => void;
}

export function InputDialog({ example, onSubmit, onCancel }: InputDialogProps) {
  const [inputs, setInputs] = useState<Record<string, string>>({});

  const getRequiredInputs = () => {
    switch (example.id) {
      case "currency-converter":
        return [
          {
            key: "dollars",
            label: "סכום בדולרים",
            type: "number",
            defaultValue: "100",
          },
        ];
      case "test-average":
        return [
          {
            key: "numTests",
            label: "מספר מבחנים",
            type: "number",
            defaultValue: "3",
          },
          {
            key: "grades",
            label: "ציונים (מופרדים בפסיקים)",
            type: "text",
            defaultValue: "85,90,78",
          },
        ];
      default:
        return [];
    }
  };

  const requiredInputs = getRequiredInputs();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const processedInputs: Record<string, string | number> = {};

    requiredInputs.forEach((input) => {
      const value = inputs[input.key] || input.defaultValue;
      processedInputs[input.key] =
        input.type === "number" ? Number(value) : value;
    });

    onSubmit(processedInputs);
  };

  if (requiredInputs.length === 0) {
    // No inputs needed, start immediately
    onSubmit({});
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md p-6" dir="rtl">
        <h2 className="text-2xl font-bold mb-2">{example.title}</h2>
        <p className="text-sm text-muted-foreground mb-6">
          הזן ערכי קלט לסימולציה
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {requiredInputs.map((input) => (
            <div key={input.key} className="space-y-2">
              <Label htmlFor={input.key}>{input.label}</Label>
              <Input
                id={input.key}
                type={input.type}
                defaultValue={input.defaultValue}
                onChange={(e) =>
                  setInputs((prev) => ({
                    ...prev,
                    [input.key]: e.target.value,
                  }))
                }
                placeholder={input.defaultValue}
              />
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
