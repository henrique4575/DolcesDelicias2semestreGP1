export type FilterableMenuItem = {
  name: string;
  description: string;
  category: string;
};

function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR")
    .trim();
}

export function filterMenu<T extends FilterableMenuItem>(
  items: T[],
  category: string,
  query: string,
): T[] {
  const normalizedQuery = normalize(query);

  return items.filter((item) => {
    const matchesCategory = category === "todos" || item.category === category;
    const searchable = normalize(`${item.name} ${item.description}`);
    return matchesCategory && searchable.includes(normalizedQuery);
  });
}
