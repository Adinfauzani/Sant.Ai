const OLD = "santet:";
const NEW = "sant-ai:";

export function getStorage(key: string): string | null {
  if (typeof window === "undefined") return null;
  const newKey = NEW + key;
  let val = localStorage.getItem(newKey);
  if (val !== null) return val;
  const oldKey = OLD + key;
  val = localStorage.getItem(oldKey);
  if (val !== null) {
    localStorage.setItem(newKey, val);
    localStorage.removeItem(oldKey);
  }
  return val;
}

export function setStorage(key: string, value: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(NEW + key, value);
  localStorage.removeItem(OLD + key);
}
