import { SavedData, defaultSavedData } from "../data";
import { useCallback, useState } from "react";

const savedDataKey = "quick-flashcards-saved-data";

function loadSaved(): SavedData {
  const stored = window.localStorage.getItem(savedDataKey);
  return stored === null ? defaultSavedData : JSON.parse(stored);
}

function resave(data: SavedData): void {
  window.localStorage.setItem(savedDataKey, JSON.stringify(data));
}

export default function useData(): [SavedData, (data: SavedData) => void] {
  const [localSavedData, setLocalSavedData] = useState(loadSaved());

  const setSavedData = useCallback((data: SavedData) => {
    resave(data);
    setLocalSavedData(data);
  }, []);

  return [localSavedData, setSavedData];
}
