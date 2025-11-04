"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, RotateCcw, SkipForward, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { CodeExample, Variable } from "@/types/code-demo";

interface CodeVisualizerProps {
  example: CodeExample;
  inputs?: Record<string, string | number>;
}

export function CodeVisualizer({ example, inputs }: CodeVisualizerProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [variables, setVariables] = useState<Variable[]>([]);
  const [outputs, setOutputs] = useState<string[]>([]);

  const executionState = example.executeStep(currentStep, variables, inputs);

  useEffect(() => {
    setVariables(executionState.variables);
    if (executionState.output) {
      setOutputs((prev) => [...prev, executionState.output!]);
    }
  }, [currentStep, executionState]);

  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        const totalSteps = getTotalSteps();
        if (prev >= totalSteps - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, speed);

    return () => clearInterval(timer);
  }, [isPlaying, speed]);

  const getTotalSteps = () => {
    // Count actual steps by trying to execute them
    let count = 0;
    while (true) {
      const step = example.executeStep(count, variables, inputs);
      if (!step || count > 100) break; // Safety check
      count++;
    }
    return count;
  };

  const handleReset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
    setVariables([]);
    setOutputs([]);
  };

  const handleNext = () => {
    const totalSteps = getTotalSteps();
    if (currentStep < totalSteps - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      setOutputs([]);
    }
  };

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case "declaration":
        return "text-blue-600 dark:text-blue-400";
      case "input":
        return "text-green-600 dark:text-green-400";
      case "output":
        return "text-purple-600 dark:text-purple-400";
      case "calculation":
        return "text-orange-600 dark:text-orange-400";
      case "condition":
        return "text-yellow-600 dark:text-yellow-400";
      case "loop":
        return "text-pink-600 dark:text-pink-400";
      default:
        return "text-gray-600 dark:text-gray-400";
    }
  };

  return (
    <div className="w-full space-y-4" dir="rtl">
      {/* Header */}
      <Card className="p-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">{example.title}</h2>
            <Badge
              variant={example.difficulty === "basic" ? "default" : "secondary"}
            >
              {example.difficulty === "basic"
                ? "בסיסי"
                : example.difficulty === "intermediate"
                ? "בינוני"
                : "מתקדם"}
            </Badge>
          </div>
          <p className="text-muted-foreground">{example.description}</p>
          <div className="flex gap-2 flex-wrap">
            {example.concepts.map((concept) => (
              <Badge key={concept} variant="outline">
                {concept}
              </Badge>
            ))}
          </div>
        </div>
      </Card>

      {/* Controls */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={isPlaying ? "default" : "outline"}
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              ←
            </Button>
            <Button size="sm" variant="outline" onClick={handleNext}>
              <SkipForward className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline" onClick={handleReset}>
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              שלב {currentStep + 1}
            </span>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Code Panel */}
        <Card className="lg:col-span-2 p-4">
          <h3 className="text-lg font-semibold mb-4">קוד התוכנית</h3>
          <div className="space-y-1 font-mono text-sm" dir="ltr">
            {example.code.map((line) => {
              const isActive = line.lineNumber === executionState.lineNumber;
              const hasExplanation =
                line.explanation && line.explanation.length > 0;

              return (
                <motion.div
                  key={line.lineNumber}
                  className={cn(
                    "flex items-start gap-2 px-3 py-2 rounded-md transition-colors",
                    isActive &&
                      "bg-yellow-100 dark:bg-yellow-900/20 border-r-4 border-yellow-500"
                  )}
                  animate={isActive ? { scale: [1, 1.02, 1] } : {}}
                  transition={{ duration: 0.3 }}
                >
                  <span className="text-muted-foreground w-8 text-right select-none">
                    {line.lineNumber}
                  </span>
                  {hasExplanation ? (
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <code
                          className={cn(
                            "flex-1 cursor-help",
                            getCategoryColor(line.category)
                          )}
                        >
                          {line.code || " "}
                        </code>
                      </HoverCardTrigger>
                      <HoverCardContent className="w-80" dir="rtl">
                        <div className="space-y-2">
                          <h4 className="text-sm font-semibold">הסבר</h4>
                          <p className="text-sm text-muted-foreground">
                            {line.explanation}
                          </p>
                          {line.category && (
                            <Badge variant="outline" className="text-xs">
                              {line.category}
                            </Badge>
                          )}
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                  ) : (
                    <code className="flex-1">{line.code || " "}</code>
                  )}
                </motion.div>
              );
            })}
          </div>
        </Card>

        {/* Variables & Output Panel */}
        <div className="space-y-4">
          {/* Variables Table */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">משתנים</h3>
            <div className="space-y-2">
              <AnimatePresence mode="popLayout">
                {variables.map((variable) => (
                  <motion.div
                    key={variable.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className={cn(
                      "p-3 rounded-md border transition-colors",
                      executionState.highlight === variable.name
                        ? "bg-blue-100 dark:bg-blue-900/20 border-blue-500"
                        : "bg-muted/50"
                    )}
                  >
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <div className="flex justify-between items-center cursor-help">
                          <span className="font-mono text-sm font-semibold">
                            {variable.name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {variable.type}
                          </span>
                        </div>
                      </HoverCardTrigger>
                      <HoverCardContent dir="rtl">
                        <div className="space-y-1">
                          <p className="text-sm">
                            <span className="font-semibold">שם:</span>{" "}
                            {variable.name}
                          </p>
                          <p className="text-sm">
                            <span className="font-semibold">טיפוס:</span>{" "}
                            {variable.type}
                          </p>
                          <p className="text-sm">
                            <span className="font-semibold">ערך:</span>{" "}
                            {variable.value !== null
                              ? String(variable.value)
                              : "לא מאותחל"}
                          </p>
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                    <motion.div
                      className="font-mono text-lg mt-1"
                      animate={
                        executionState.highlight === variable.name
                          ? { scale: [1, 1.1, 1] }
                          : {}
                      }
                    >
                      {variable.value !== null ? (
                        String(variable.value)
                      ) : (
                        <span className="text-muted-foreground italic">
                          null
                        </span>
                      )}
                    </motion.div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {variables.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  אין משתנים עדיין
                </p>
              )}
            </div>
          </Card>

          {/* Output Panel */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">פלט</h3>
            <div
              className="bg-black text-green-400 p-4 rounded-md font-mono text-sm min-h-[100px]"
              dir="ltr"
            >
              <AnimatePresence>
                {outputs.map((output, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="whitespace-pre-wrap"
                  >
                    {output}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </Card>

          {/* Current Step Description */}
          <Card className="p-4 bg-primary/5">
            <h3 className="text-sm font-semibold mb-2">מה קורה עכשיו?</h3>
            <motion.p
              key={currentStep}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm"
            >
              {executionState.description}
            </motion.p>
          </Card>
        </div>
      </div>
    </div>
  );
}
