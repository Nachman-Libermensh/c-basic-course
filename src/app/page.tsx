"use client";

import { useState } from "react";
import { CodeExample } from "@/types/code-demo";
import { allExamples } from "@/examples";
import { ExampleSelector } from "@/components/example-selector";
import { CodeVisualizer } from "@/components/code-visualizer";
import { InputDialog } from "@/components/input-dialog";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function Home() {
  const [selectedExample, setSelectedExample] = useState<CodeExample | null>(
    null
  );
  const [showInputDialog, setShowInputDialog] = useState(false);
  const [inputs, setInputs] = useState<Record<string, string | number>>({});

  const handleExampleSelect = (example: CodeExample) => {
    setSelectedExample(example);
    setShowInputDialog(true);
  };

  const handleInputSubmit = (
    submittedInputs: Record<string, string | number>
  ) => {
    setInputs(submittedInputs);
    setShowInputDialog(false);
  };

  const handleBack = () => {
    setSelectedExample(null);
    setInputs({});
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-background to-muted/20 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {!selectedExample ? (
          <ExampleSelector
            examples={allExamples}
            onSelect={handleExampleSelect}
          />
        ) : (
          <div className="space-y-4">
            <Button
              variant="outline"
              onClick={handleBack}
              className="gap-2"
              dir="rtl"
            >
              <ArrowRight className="h-4 w-4" />
              חזרה לבחירת תרגיל
            </Button>
            <CodeVisualizer example={selectedExample} inputs={inputs} />
          </div>
        )}

        {showInputDialog && selectedExample && (
          <InputDialog
            example={selectedExample}
            onSubmit={handleInputSubmit}
            onCancel={() => setShowInputDialog(false)}
          />
        )}
      </div>
    </div>
  );
}
