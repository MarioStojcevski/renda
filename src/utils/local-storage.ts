export const readFromLocalStorage = <T>(key: string): T | null => {
  const data = localStorage.getItem(key);

  if (data) {
    return JSON.parse(data) as T;
  }

  return null;
};

export const deleteFromLocalStorage = (key: string): void => {
  localStorage.removeItem(key);
};

export const writeToLocalStorage = (key: string, value: any): void => {
  localStorage.setItem(key, JSON.stringify(value));
};
