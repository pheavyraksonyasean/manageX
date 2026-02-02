import { CategoryCard, Category } from "./category-card";

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
      <div className="bg-secondary/40 rounded-xl p-12 border border-border text-center">
        <p className="text-muted-foreground text-lg">No categories yet</p>
        <p className="text-muted-foreground text-sm mt-2">
          Create your first category to organize your tasks
        </p>
      </div>
    );
  }

  return (
    <div className="bg-secondary/40 rounded-xl p-6 border border-border">
      <h3 className="text-lg font-semibold text-foreground mb-4">Categories</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
