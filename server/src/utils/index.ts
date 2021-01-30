export const getByValue = (
  map: Map<string, string>,
  searchValue: string
): string | null => {
  for (let [key, value] of map.entries()) {
    if (value === searchValue) return key;
  }

  return null;
};

export const capitalize = (str: string) => str[0].toUpperCase() + str.slice(1);
