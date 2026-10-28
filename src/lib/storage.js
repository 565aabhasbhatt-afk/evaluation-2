import { initialData } from "../data/data";

const KEY = "skillsphereData";

export function saveData(data) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function loadData() {
  const data = localStorage.getItem(KEY);

  if (data) {
    return JSON.parse(data);
  }

  return initialData;
}

export function clearData() {
  localStorage.removeItem(KEY);
}

export { KEY as STORAGE_KEY };
