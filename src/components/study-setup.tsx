import * as React from "react";

import Header from "./header";
import { SavedData } from "../data";

export type Props = {
  onBack: () => void;
  onStudy: (groups: Set<number>) => void;
  cardGroups: SavedData["cardGroups"];
};

export default function StudySetup({ onBack, cardGroups, onStudy }: Props) {
  const [selected, setSelected] = React.useState(new Set<number>());

  const toggleSelected = React.useCallback(
    (id: number) => {
      const nextSelected = new Set(selected);
      if (selected.has(id)) nextSelected.delete(id);
      else nextSelected.add(id);
      setSelected(nextSelected);
    },
    [selected, setSelected]
  );

  const cardCount = Object.entries(cardGroups)
    .filter(([id, g]) => selected.has(parseInt(id)))
    .map(([_id, g]) => Object.keys(g.cards).length)
    .reduce((p, c) => p + c, 0);

  return (
    <>
      <Header onBack={onBack} />
      <div className="vertical-stretch page-padding">
        <h1>Choose groups to study</h1>
        {Object.entries(cardGroups).map(([id, g]) => (
          <button
            key={id}
            className="full-width toggle"
            onClick={() => toggleSelected(parseInt(id))}
          >
            {`${selected.has(parseInt(id)) ? "☑" : "☐"} ${g.name}`}
          </button>
        ))}
        <p>{cardCount} cards selected</p>
        <button
          className="full-width"
          disabled={cardCount === 0}
          onClick={() => onStudy(selected)}
        >
          Start Studying
        </button>
      </div>
    </>
  );
}
