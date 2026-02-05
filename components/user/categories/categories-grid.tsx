import { CategoryCard, Category } from "./category-card";
import { FolderOpen } from "lucide-react";

interface CategoriesGridProps {
  categories: Category[];
  onDelete?: (categoryId: string) => void;
  onCategoryClick?: (category: Category) => void;
  isAdminView?: boolean;
}

export function CategoriesGrid({
  categories,
  onDelete,
  onCategoryClick,
  isAdminView = false,
}: CategoriesGridProps) {
  if (categories.length === 0) {
    return (
      <div className="bg-gradient-to-br from-secondary/60 to-secondary/30 rounded-2xl p-12 sm:p-16 border border-border/50 text-center backdrop-blur-sm">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl" />
            <div className="relative bg-secondary/80 p-6 rounded-full border border-border/50">
              <FolderOpen className="w-12 h-12 text-muted-foreground" />
            </div>
          </div>
          <div>
            <p className="text-foreground text-xl font-semibold mb-2">
              No categories yet
            </p>
            <p className="text-muted-foreground text-sm max-w-md mx-auto">
              Create your first category above to start organizing your tasks
              efficiently
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-foreground">Your Categories</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {categories.length}{" "}
            {categories.length === 1 ? "category" : "categories"} created
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            onDelete={onDelete}
            onClick={onCategoryClick}
            isAdminView={isAdminView}
          />
        ))}
      </div>
    </div>
  );
}
