import { CategoryCard } from "./CategoryCard";
import type { Category } from "./categoriesData";

type CategoryRowProps = {
  categories: Category[];
  rowOffset?: number;
  onViewPlaylist: () => void;
  onPlayBingo?: () => void;
};

export function CategoryRow({
  categories,
  rowOffset = 0,
  onViewPlaylist,
}: CategoryRowProps) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {categories.map((category, index) => (
        <CategoryCard
          key={category.id}
          category={category}
          index={rowOffset + index}
          onViewPlaylist={onViewPlaylist}
        />
      ))}
    </div>
  );
}
