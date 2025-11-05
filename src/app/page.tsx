"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ExampleSelector } from "@/components/example-selector";
import { CodeVisualizer } from "@/components/code-visualizer";
import { InputDialog } from "@/components/input-dialog";
import { CustomExampleDialog } from "@/components/custom-example-dialog";
import { builtInExamples, getAllExamples, getExampleById } from "@/examples";
import { mapDefinitionsToExamples } from "@/lib/execution-helpers";
import { useSimulatorStore } from "@/store/simulator";
import { useShallow } from "zustand/react/shallow";

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

  const handleExampleSelect = (exampleId: string) => {
    const example = examples.find((item) => item.id === exampleId);
    if (!example) return;

    setSelectedExample(exampleId);
    const hasInputs = example.inputs && example.inputs.length > 0;

    if (hasInputs) {
      setShowInputDialog(true);
    } else {
      setInputsForExample(exampleId, {});
    }
  };

  const handleInputSubmit = (submittedInputs: Record<string, string | number>) => {
    if (selectedExampleId) {
      setInputsForExample(selectedExampleId, submittedInputs);
      resetPlayback();
    }
    setShowInputDialog(false);
  };

  const handleCancelInput = () => {
    if (selectedExampleId) {
      clearInputsForExample(selectedExampleId);
    }
    setShowInputDialog(false);
    setSelectedExample(null);
  };

  const handleBack = () => {
    resetSimulation();
    setShowInputDialog(false);
  };

  const handleCreateCustom = (definition: Parameters<typeof addCustomDefinition>[0]) => {
    addCustomDefinition(definition);
  };

  const handleRemoveCustom = (exampleId: string) => {
    const example = examples.find((item) => item.id === exampleId);
    if (!example || example.source !== "custom") return;

    const confirmed = window.confirm(
      `האם למחוק את התרגיל "${example.title}"? פעולה זו אינה ניתנת לשחזור.`
    );

    if (confirmed) {
      removeCustomDefinition(exampleId);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-background to-muted/20 p-4 md:p-8">
        <div className="flex flex-col items-center gap-3" dir="rtl">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">טוען את נתוני הסימולטור...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-background to-muted/20 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {!selectedExample ? (
          <ExampleSelector
            examples={examples}
            onSelect={(example) => handleExampleSelect(example.id)}
            onCreateCustom={() => setCustomDialogOpen(true)}
            onRemoveExample={(example) => handleRemoveCustom(example.id)}
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

        {showInputDialog && selectedExample && (
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
