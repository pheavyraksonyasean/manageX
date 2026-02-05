"use client";

import { useState } from "react";
import { Check, Plus, Sparkles } from "lucide-react";

interface CategoryFormProps {
  onSubmit: (name: string, color: string) => void;
}

const colorOptions = [
  { color: "#9b87f5", name: "Purple" },
  { color: "#7c3aed", name: "Deep Purple" },
  { color: "#06b6d4", name: "Cyan" },
  { color: "#f87171", name: "Red" },
  { color: "#ec4899", name: "Pink" },
  { color: "#10b981", name: "Green" },
  { color: "#f59e0b", name: "Amber" },
  { color: "#a855f7", name: "Violet" },
  { color: "#f472b6", name: "Rose" },
  { color: "#3b82f6", name: "Blue" },
  { color: "#ef4444", name: "Crimson" },
  { color: "#14b8a6", name: "Teal" },
];

export function CategoryForm({ onSubmit }: CategoryFormProps) {
  const [name, setName] = useState("");
  const [selectedColor, setSelectedColor] = useState(colorOptions[0].color);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = () => {
    if (!name.trim()) return;
    onSubmit(name.trim(), selectedColor);
    setName("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div className="bg-gradient-to-br from-secondary/60 to-secondary/30 rounded-2xl p-5 sm:p-6 border border-border/50 backdrop-blur-sm mb-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Sparkles className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-foreground">
            Create New Category
          </h3>
          <p className="text-xs text-muted-foreground">
            Organize your tasks efficiently
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground flex items-center gap-2">
            Category Name
            <span className="text-red-500">*</span>
          </label>

          <input
            type="text"
            placeholder="e.g., Work, Personal, Health, Finance..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full bg-background/80 border border-border/50 rounded-xl py-3 px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Choose Color
          </label>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative group">
              <div
                className="absolute inset-0 rounded-xl blur-md opacity-50 group-hover:opacity-70 transition-opacity"
                style={{ backgroundColor: selectedColor }}
              />
              <div
                className="relative w-12 h-12 rounded-xl border-2 border-white/30 flex-shrink-0 shadow-lg transition-transform group-hover:scale-105"
                style={{ backgroundColor: selectedColor }}
              >
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 to-transparent" />
              </div>
            </div>

            {/* Color Options */}
            <div className="flex items-center gap-2 flex-wrap">
              {colorOptions
                .slice(0, isExpanded ? colorOptions.length : 6)
                .map((option) => (
                  <button
                    key={option.color}
                    onClick={() => setSelectedColor(option.color)}
                    className="relative w-9 h-9 rounded-lg flex items-center justify-center transition-all hover:scale-110 group"
                    style={{ backgroundColor: option.color }}
                    title={option.name}
                  >
                    {selectedColor === option.color && (
                      <div className="absolute inset-0 rounded-lg ring-2 ring-offset-2 ring-offset-secondary ring-white" />
                    )}
                    {selectedColor === option.color && (
                      <Check className="w-4 h-4 text-white relative z-10 drop-shadow" />
                    )}
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-white/20 to-transparent" />
                  </button>
                ))}

              {colorOptions.length > 6 && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="w-9 h-9 rounded-lg bg-secondary/50 border border-border/50 hover:bg-secondary transition-colors flex items-center justify-center"
                >
                  <span className="text-xs font-medium text-muted-foreground">
                    {isExpanded ? "−" : "+"}
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!name.trim()}
          className="w-full sm:w-auto bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-3 px-6 rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none flex items-center justify-center gap-2 group"
        >
          <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
          Add Category
        </button>
      </div>
    </div>
  );
}
