"use client";

import { useState } from "react";
import { Check } from "lucide-react";

interface CategoryFormProps {
  onSubmit: (name: string, color: string) => void;
}

const colorOptions = [
  "#9b87f5", // Purple (light)
  "#7c3aed", // Purple (dark)
  "#06b6d4", // Cyan
  "#f87171", // Red
  "#ec4899", // Pink
  "#10b981", // Green
  "#f59e0b", // Amber
  "#a855f7", // Violet
  "#f472b6", // Pink (light)
];

export function CategoryForm({ onSubmit }: CategoryFormProps) {
  const [name, setName] = useState("");
  const [selectedColor, setSelectedColor] = useState(colorOptions[0]);

  const handleSubmit = () => {
    if (!name.trim()) return;
    onSubmit(name.trim(), selectedColor);
    setName("");
  };

  return (
    <div className="bg-secondary/40 rounded-xl p-4 sm:p-6 border border-border mb-6">
      <h3 className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4">
        Create new Category
      </h3>

      <div className="space-y-4">
        {/* Category Name Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            Category Name
          </label>

          {/* Mobile: Stack vertically, Desktop: Horizontal */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <input
              type="text"
              placeholder="e.g., Work, Personal, Health"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex-1 bg-background border border-border rounded-lg py-2 sm:py-2.5 px-3 sm:px-4 text-sm sm:text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />

            {/* Color Selection Row */}
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Selected Color Preview */}
              <div
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white/20 flex-shrink-0"
                style={{ backgroundColor: selectedColor }}
              />

              {/* Color Options - Scrollable on mobile */}
              <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-hide">
                {colorOptions.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110 flex-shrink-0"
                    style={{ backgroundColor: color }}
                  >
                    {selectedColor === color && (
                      <Check className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Add Button */}
        <button
          onClick={handleSubmit}
          className="w-full sm:w-auto bg-primary text-primary-foreground py-2 sm:py-2.5 px-6 rounded-lg text-sm sm:text-base font-medium hover:bg-primary/90 transition-colors"
        >
          Add category
        </button>
      </div>
    </div>
  );
}
