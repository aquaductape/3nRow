export const getByValue = (
  map: Map<string, string>,
  searchValue: string
): string | null => {
  for (let [key, value] of map.entries()) {
    if (value === searchValue) return key;
  }

  return null;
};
