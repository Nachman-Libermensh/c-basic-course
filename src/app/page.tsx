"use client";

export const dynamic = "force-static";

import { useCallback, useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import { useShallow } from "zustand/react/shallow";

import { Button } from "@/components/ui/button";
import { ExampleSelector } from "@/components/example-selector";
import { CodeVisualizer } from "@/components/code-visualizer";
import { InputDialog } from "@/components/input-dialog";
import { CustomExampleDialog } from "@/components/custom-example-dialog";
import { Spinner } from "@/components/ui/spinner";
import { builtInExamples, getAllExamples, getExampleById } from "@/examples";
import { mapDefinitionsToExamples } from "@/lib/execution-helpers";
import { useSimulatorStore } from "@/store/simulator";
import { CodeExample } from "@/types/code-demo";

export default function Home() {
  const [showInputDialog, setShowInputDialog] = useState(false);
  const [customDialogOpen, setCustomDialogOpen] = useState(false);

  const {
    selectedExampleId,
    setSelectedExample,
    setInputsForExample,
    clearInputsForExample,
    resetSimulation,
    resetPlayback,
    customDefinitions,
    removeCustomDefinition,
    addCustomDefinition,
    inputsByExample,
    isLoading,
  } = useSimulatorStore(
    useShallow((state) => ({
      selectedExampleId: state.selectedExampleId,
      setSelectedExample: state.setSelectedExample,
      setInputsForExample: state.setInputsForExample,
      clearInputsForExample: state.clearInputsForExample,
      resetSimulation: state.resetSimulation,
      resetPlayback: state.resetPlayback,
      customDefinitions: state.customDefinitions,
      removeCustomDefinition: state.removeCustomDefinition,
      addCustomDefinition: state.addCustomDefinition,
      inputsByExample: state.inputsByExample,
      isLoading: state.isLoading,
    }))
  );

  const customExamples = useMemo(
    () => mapDefinitionsToExamples(customDefinitions),
    [customDefinitions]
  );

  const examples = useMemo(
    () => getAllExamples(customExamples),
    [customExamples]
  );

  const selectedExample = useMemo(() => {
    if (!selectedExampleId) return null;
    return (
      getExampleById(selectedExampleId, customExamples) ||
      builtInExamples.find((example) => example.id === selectedExampleId) ||
      null
    );
  }, [selectedExampleId, customExamples]);

  const currentInputs = selectedExampleId
    ? inputsByExample[selectedExampleId] ?? {}
    : {};

  const handleExampleSelect = useCallback(
    (example: CodeExample) => {
      setSelectedExample(example.id);
      const hasInputs = example.inputs && example.inputs.length > 0;

      if (hasInputs) {
        setShowInputDialog(true);
      } else {
        setInputsForExample(example.id, {});
      }
    },
    [setInputsForExample, setSelectedExample, setShowInputDialog]
  );

  const handleInputSubmit = useCallback(
    (submittedInputs: Record<string, string | number>) => {
      if (selectedExampleId) {
        setInputsForExample(selectedExampleId, submittedInputs);
        resetPlayback();
      }
      setShowInputDialog(false);
    },
    [resetPlayback, selectedExampleId, setInputsForExample, setShowInputDialog]
  );

  const handleCancelInput = useCallback(() => {
    if (selectedExampleId) {
      clearInputsForExample(selectedExampleId);
    }
    setShowInputDialog(false);
    setSelectedExample(null);
  }, [clearInputsForExample, selectedExampleId, setSelectedExample, setShowInputDialog]);

  const handleBack = useCallback(() => {
    resetSimulation();
    setShowInputDialog(false);
  }, [resetSimulation, setShowInputDialog]);

  const handleCreateCustom = useCallback(
    (definition: Parameters<typeof addCustomDefinition>[0]) => {
      addCustomDefinition(definition);
    },
    [addCustomDefinition]
  );

  const handleRemoveCustom = useCallback(
    (example: CodeExample) => {
      if (example.source !== "custom") return;

      const confirmed = window.confirm(
        `האם למחוק את התרגיל "${example.title}"? פעולה זו אינה ניתנת לשחזור.`
      );

      if (confirmed) {
        removeCustomDefinition(example.id);
      }
    },
    [removeCustomDefinition]
  );

  return (
    <div className="min-h-screen bg-linear-to-br from-background to-muted/20 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center gap-4 py-24">
            <Spinner className="h-10 w-10 text-primary" />
            <p className="text-sm text-muted-foreground">טוען נתונים שמורים...</p>
          </div>
        ) : !selectedExample ? (
          <ExampleSelector
            examples={examples}
            onSelect={handleExampleSelect}
            onCreateCustom={() => setCustomDialogOpen(true)}
            onRemoveExample={handleRemoveCustom}
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
            <CodeVisualizer example={selectedExample} inputs={currentInputs} />
          </div>
        )}

        {!isLoading && showInputDialog && selectedExample && (
          <InputDialog
            example={selectedExample}
            onSubmit={handleInputSubmit}
            onCancel={handleCancelInput}
            initialValues={currentInputs}
          />
        )}

        <CustomExampleDialog
          open={customDialogOpen}
          onOpenChange={setCustomDialogOpen}
          onSubmit={handleCreateCustom}
        />
      </div>
    </div>
  );
}
