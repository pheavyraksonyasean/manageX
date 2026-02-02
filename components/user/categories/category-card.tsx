import { Trash2, Eye } from "lucide-react";

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
      className="bg-secondary/60 rounded-xl p-4 border border-border hover:border-primary/50 hover:bg-secondary/80 flex items-center justify-between transition-all cursor-pointer group"
      onClick={() => onClick?.(category)}
    >
      <div className="flex items-center gap-3">
        <span
          className="w-4 h-4 rounded-full"
          style={{ backgroundColor: category.color }}
        />
        <span className="font-medium text-foreground">{category.name}</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground">
          {category.taskCount} Tasks
        </span>
        <Eye className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        {onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.(category.id);
            }}
            className={`p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors ${
              isAdminView ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            }`}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
