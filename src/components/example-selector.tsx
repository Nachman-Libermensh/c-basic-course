"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CodeExample } from "@/types/code-demo";
import { motion } from "framer-motion";
import { Code2, ArrowRight, Plus, Trash2 } from "lucide-react";

interface ExampleSelectorProps {
  examples: CodeExample[];
  onSelect: (example: CodeExample) => void;
  onCreateCustom?: () => void;
  onRemoveExample?: (example: CodeExample) => void;
}

export function ExampleSelector({
  examples,
  onSelect,
  onCreateCustom,
  onRemoveExample,
}: ExampleSelectorProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "basic":
        return "bg-green-500";
      case "intermediate":
        return "bg-yellow-500";
      case "advanced":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case "basic":
        return "בסיסי";
      case "intermediate":
        return "בינוני";
      case "advanced":
        return "מתקדם";
      default:
        return difficulty;
    }
  };

  return (
    <div className="w-full space-y-8" dir="rtl">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start justify-center md:justify-start gap-4"
          >
            <Code2 className="h-12 w-12 text-primary shrink-0" />
            <div className="text-center md:text-right space-y-2">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                סימולטור קוד C
              </h1>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                כלי להדגמה אינטראקטיבית של אלגוריתמים בסיסיים בשפת C
              </p>
            </div>
          </motion.div>
          {onCreateCustom && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Button
                onClick={onCreateCustom}
                variant="secondary"
                className="gap-2 h-11 px-6 shadow-sm hover:shadow-md transition-all"
                size="lg"
              >
                <Plus className="h-5 w-5" />
                <span className="font-medium">צור תרגיל חדש</span>
              </Button>
            </motion.div>
          )}
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {examples.map((example, index) => (
            <motion.div
              key={example.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card
                className="p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group relative overflow-hidden h-full border-2 hover:border-primary/20"
                onClick={() => onSelect(example)}
              >
                <div className="space-y-4 h-full flex flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-2 flex-1">
                      <h3 className="text-xl font-semibold group-hover:text-primary transition-colors leading-tight">
                        {example.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                        {example.description}
                      </p>
                    </div>
                    <div className="flex items-start gap-2 shrink-0">
                      <div
                        className={`h-3 w-3 rounded-full ${getDifficultyColor(
                          example.difficulty
                        )} shrink-0`}
                        title={getDifficultyText(example.difficulty)}
                      />
                      {example.source === "custom" && (
                        <Badge variant="secondary" className="text-xs shrink-0">
                          מותאם אישית
                        </Badge>
                      )}
                      {example.source === "custom" && onRemoveExample && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            onRemoveExample(example);
                          }}
                          className="h-8 w-8 text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {example.concepts.slice(0, 4).map((concept) => (
                      <Badge
                        key={concept}
                        variant="secondary"
                        className="text-xs px-2.5 py-1"
                      >
                        {concept}
                      </Badge>
                    ))}
                    {example.concepts.length > 4 && (
                      <Badge variant="outline" className="text-xs px-2.5 py-1">
                        +{example.concepts.length - 4}
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2 mt-auto">
                    <Badge variant="outline" className="px-3 py-1">
                      {getDifficultyText(example.difficulty)}
                    </Badge>
                    <Button
                      size="sm"
                      type="button"
                      className="gap-2 px-4 h-9 shadow-sm hover:shadow transition-all"
                      onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        onSelect(example);
                      }}
                    >
                      <span className="font-medium">התחל</span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-center mt-8"
      >
        <Card className="p-8 bg-muted/50 border-2">
          <h3 className="text-xl font-semibold mb-6 flex items-center justify-center gap-2">
            <span>💡</span>
            <span>איך זה עובד?</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-muted-foreground">
            <div className="space-y-2">
              <p className="font-semibold text-foreground text-base">
                1. בחר תרגיל
              </p>
              <p className="leading-relaxed">
                בחר אחד מהתרגילים המוצעים או צור תרגיל משלך
              </p>
            </div>
            <div className="space-y-2">
              <p className="font-semibold text-foreground text-base">
                2. הרץ שלב אחר שלב
              </p>
              <p className="leading-relaxed">
                עקוב אחר ביצוע הקוד שורה אחר שורה בליווי הסברים
              </p>
            </div>
            <div className="space-y-2">
              <p className="font-semibold text-foreground text-base">
                3. צפה במשתנים
              </p>
              <p className="leading-relaxed">
                ראה כיצד המשתנים, הלולאות והתנאים מתעדכנים בזמן אמת
              </p>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
