import * as React from "react";
import Header from "./header";
import { CardGroup, freshId, SavedData, Card } from "../data";

export type Props = {
  groupId: "new" | number;
  initialValue: CardGroup;
  cardTypes: SavedData["cardTypes"];
  freshId: () => number;
  onBack: () => void;
  onConfirm: (id: "new" | number, group: CardGroup) => void;
};

export default function EditCardGroup({
  onBack,
  groupId,
  freshId,
  cardTypes,
  initialValue,
  onConfirm
}: Props) {
  const [currentValue, setCurrentValue] = React.useState(initialValue);
  const [lastFreshId, setLastFreshId] = React.useState(0);

  const onFormSubmit = React.useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      onConfirm(groupId, currentValue);
    },
    [groupId, currentValue]
  );

  const onAddNew = React.useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      if (Object.keys(cardTypes).length === 0) {
        alert("You need to make some card types first");
      } else {
        const nextId = freshId();
        setLastFreshId(lastFreshId + 1);
        setCurrentValue({
          ...currentValue,
          cards: {
            ...currentValue.cards,
            [nextId]: {
              cardTypeId: parseInt(Object.keys(cardTypes)[0]),
              question: "",
              answer: ""
            }
          }
        });
      }
    },
    [currentValue, lastFreshId]
  );

  const cards = Object.entries(currentValue.cards);

  return (
    <>
      <Header onBack={onBack} />
      <form onSubmit={onFormSubmit} className="vertical-stretch">
        <div className="edit-group vertical-stretch">
          <label>Name</label>
          <input
            type="text"
            value={currentValue.name}
            onChange={e =>
              setCurrentValue({ ...currentValue, name: e.currentTarget.value })
            }
          />
        </div>

        <h2>Cards</h2>

        {cards.map(([id, card]) => (
          <EditCard
            key={id}
            group={currentValue}
            setGroup={setCurrentValue}
            cardTypes={cardTypes}
            id={parseInt(id)}
            card={card}
          />
        ))}

        <button onClick={onAddNew} className="full-width add">
          Add new card
        </button>

        <input type="submit" value="save" />
      </form>
    </>
  );
}

function EditCard({
  group,
  setGroup,
  cardTypes,
  id,
  card
}: {
  group: CardGroup;
  setGroup: (group: CardGroup) => void;
  cardTypes: SavedData["cardTypes"];

  id: number;
  card: Card;
}) {
  const editCard = React.useCallback(
    (upd: Partial<Card>) => {
      setGroup({
        ...group,
        cards: {
          ...group.cards,
          [id]: { ...card, ...upd }
        }
      });
    },
    [group, card, id]
  );

  return (
    <div className="edit-card vertical-stretch">
      <div className="edit-group vertical-stretch">
        <label>Card Type</label>
        <select
          value={card.cardTypeId}
          onChange={e => editCard({ cardTypeId: parseInt(e.target.value) })}
        >
          {Object.entries(cardTypes).map(([id, ct]) => (
            <option key={id} value={id}>
              {ct.name}
            </option>
          ))}
        </select>
      </div>
      <div className="edit-group vertical-stretch">
        <label>Question</label>
        <input
          type="text"
          value={card.question}
          onChange={e => editCard({ question: e.currentTarget.value })}
        />
      </div>
      <div className="edit-group vertical-stretch">
        <label>Answer</label>
        <input
          type="text"
          value={card.answer}
          onChange={e => editCard({ answer: e.currentTarget.value })}
        />
      </div>
    </div>
  );
}
