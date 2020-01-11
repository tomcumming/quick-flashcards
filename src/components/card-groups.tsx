import * as React from "react";
import Header from "./header";
import { SavedData } from "../data";

export type Props = {
  cardGroups: SavedData["cardGroups"];
  onBack: () => void;
  onEdit: (id: "new" | number) => void;
};

export default function CardGroups({ onBack, onEdit, cardGroups }: Props) {
  const cardGroupsList = Object.entries(cardGroups);

  return (
    <>
      <Header onBack={onBack} />
      <div className="page-padding vertical-stretch">
        <h1>Card Groups</h1>
        <button className="full-width" onClick={() => onEdit("new")}>
          Create New
        </button>
        {cardGroupsList.length === 0 ? (
          undefined
        ) : (
          <div className="card-groups-list vertical-stretch">
            <h2>Edit Existing:</h2>
            {cardGroupsList.map(([id, cg]) => (
              <button
                key={id}
                className="full-width"
                onClick={() => onEdit(parseInt(id))}
              >
                {cg.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
