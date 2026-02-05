import { Trash2, Eye, Folder, ChevronRight } from "lucide-react";

export interface Category {
  id: string;
  name: string;
  color: string;
  taskCount: number;
}

interface CategoryCardProps {
  category: Category;
  onDelete?: (categoryId: string) => void;
  onClick?: (category: Category) => void;
  isAdminView?: boolean;
}

export function CategoryCard({
  category,
  onDelete,
  onClick,
  isAdminView = false,
}: CategoryCardProps) {
  return (
    <div
      className="relative bg-gradient-to-br from-secondary/80 to-secondary/40 rounded-2xl p-5 border border-border/50 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 cursor-pointer group overflow-hidden"
      onClick={() => onClick?.(category)}
    >
      <div
        className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-300"
        style={{
          background: `linear-gradient(135deg, ${category.color}20 0%, transparent 70%)`,
        }}
      />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div
                className="absolute inset-0 rounded-lg blur-md opacity-50"
                style={{ backgroundColor: category.color }}
              />
              <div
                className="relative w-12 h-12 rounded-lg flex items-center justify-center shadow-sm"
                style={{ backgroundColor: category.color }}
              >
                <Folder className="w-6 h-6 text-white drop-shadow" />
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-foreground text-lg group-hover:text-primary transition-colors">
                {category.name}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">Category</p>
            </div>
          </div>

          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.(category.id);
              }}
              className={`p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all duration-200 hover:scale-110 ${
                isAdminView
                  ? "opacity-100"
                  : "opacity-0 group-hover:opacity-100"
              }`}
              title="Delete category"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
          <div className="flex items-center gap-2">
            <div
              className="px-3 py-1.5 rounded-full text-sm font-medium"
              style={{
                backgroundColor: `${category.color}15`,
                color: category.color,
              }}
            >
              {category.taskCount} {category.taskCount === 1 ? "Task" : "Tasks"}
            </div>
          </div>

          <div className="flex items-center gap-1 text-xs text-muted-foreground group-hover:text-primary transition-colors">
            <Eye className="w-3.5 h-3.5" />
            <span className="font-medium">View</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </div>
  );
}
