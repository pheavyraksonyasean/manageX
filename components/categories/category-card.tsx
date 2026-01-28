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
}

export function CategoryCard({
  category,
  onDelete,
  onClick,
}: CategoryCardProps) {
  return (
    <div
      className="bg-secondary/60 rounded-xl p-4 border border-border hover:border-muted-foreground flex items-center justify-between transition-colors group cursor-pointer"
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
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete?.(category.id);
          }}
          className="p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
