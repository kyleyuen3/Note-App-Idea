interface CategoryCount {
  name: string;
  count: number;
}

interface Props {
  categories: CategoryCount[];
  uncategorizedCount: number;
  totalCount: number;
  selected: string | null;
  onSelect: (category: string | null) => void;
}

export function Sidebar({ categories, uncategorizedCount, totalCount, selected, onSelect }: Props) {
  return (
    <nav className="sidebar">
      <button
        className={`sidebar__item ${selected === null ? "sidebar__item--active" : ""}`}
        onClick={() => onSelect(null)}
      >
        <span>All notes</span>
        <span className="sidebar__count">{totalCount}</span>
      </button>

      {categories.map((c) => (
        <button
          key={c.name}
          className={`sidebar__item ${selected === c.name ? "sidebar__item--active" : ""}`}
          onClick={() => onSelect(c.name)}
        >
          <span>{c.name}</span>
          <span className="sidebar__count">{c.count}</span>
        </button>
      ))}

      {uncategorizedCount > 0 && (
        <button
          className={`sidebar__item ${selected === "__uncategorized__" ? "sidebar__item--active" : ""}`}
          onClick={() => onSelect("__uncategorized__")}
        >
          <span>Uncategorized</span>
          <span className="sidebar__count">{uncategorizedCount}</span>
        </button>
      )}
    </nav>
  );
}
