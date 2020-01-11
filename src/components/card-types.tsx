import * as React from "react";

import { SavedData } from "../data";
import Header from "./header";

export type Props = {
  cardTypes: SavedData["cardTypes"];
  onBack: () => void;
  onEdit: (id: "new" | number) => void;
};

export default function CardTypes({ cardTypes, onBack, onEdit }: Props) {
  const cardTypesList = Object.entries(cardTypes);

  return (
    <>
      <Header onBack={onBack} />
      <div className="page-padding vertical-stretch">
        <h1>Card Types</h1>
        <button className="full-width" onClick={() => onEdit("new")}>
          Create New
        </button>
        {cardTypesList.length === 0 ? (
          undefined
        ) : (
          <div className="card-types-list vertical-stretch">
            <h2>Edit Existing:</h2>
            {cardTypesList.map(([id, ct]) => (
              <button
                key={id}
                className="full-width"
                onClick={() => onEdit(parseInt(id))}
              >
                {ct.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
