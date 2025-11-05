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
    <div className="w-full space-y-6" dir="rtl">
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center md:justify-start gap-2"
          >
            <Code2 className="h-10 w-10 text-primary" />
            <div>
              <h1 className="text-4xl font-bold">סימולטור קוד C</h1>
              <p className="text-lg text-muted-foreground">
                כלי להדגמה אינטראקטיבית של אלגוריתמים בסיסיים בשפת C
              </p>
            </div>
          </motion.div>
          {onCreateCustom && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Button
                onClick={onCreateCustom}
                variant="secondary"
                className="gap-2"
              >
                <Plus className="h-4 w-4" /> צור תרגיל חדש
              </Button>
            </motion.div>
          )}
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {examples.map((example, index) => (
            <motion.div
              key={example.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="p-6 hover:shadow-lg transition-all cursor-pointer group relative overflow-hidden"
                onClick={() => onSelect(example)}
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1 flex-1">
                      <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                        {example.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {example.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-3 w-3 rounded-full ${getDifficultyColor(
                          example.difficulty
                        )}`}
                        title={getDifficultyText(example.difficulty)}
                      />
                      {example.source === "custom" && (
                        <Badge variant="secondary" className="text-xs">
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
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
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
                        className="text-xs"
                      >
                        {concept}
                      </Badge>
                    ))}
                    {example.concepts.length > 4 && (
                      <Badge variant="outline" className="text-xs">
                        +{example.concepts.length - 4}
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <Badge variant="outline">
                      {getDifficultyText(example.difficulty)}
                    </Badge>
                    <Button
                      size="sm"
                      type="button"
                      className="gap-1"
                      onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        onSelect(example);
                      }}
                    >
                      התחל
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
        className="text-center"
      >
        <Card className="p-6 bg-muted/50">
          <h3 className="text-lg font-semibold mb-2">💡 איך זה עובד?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
            <div>
              <p className="font-semibold text-foreground mb-1">1. בחר תרגיל</p>
              <p>בחר אחד מהתרגילים המוצעים או צור תרגיל משלך</p>
            </div>
            <div>
              <p className="font-semibold text-foreground mb-1">
                2. הרץ שלב אחר שלב
              </p>
              <p>עקוב אחר ביצוע הקוד שורה אחר שורה בליווי הסברים</p>
            </div>
            <div>
              <p className="font-semibold text-foreground mb-1">
                3. צפה במשתנים
              </p>
              <p>ראה כיצד המשתנים, הלולאות והתנאים מתעדכנים בזמן אמת</p>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
