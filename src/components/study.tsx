import * as React from "react";
import { SavedData, Card, CardType, QuestionType } from "../data";

import Header from "./header";
import Speak from "./speak";

export type Props = {
  onBack: () => void;
  groupIds: Set<number>;
  cardGroups: SavedData["cardGroups"];
  cardTypes: SavedData["cardTypes"];
};

type State = "asking" | "showing";

export default function Study({
  onBack,
  groupIds,
  cardGroups,
  cardTypes
}: Props) {
  const allCards = React.useRef(getAllCards(cardGroups, groupIds));
  const [queue, setQueue] = React.useState(
    shuffleQueue(allCards.current.keys())
  );
  const [correct, setCorrect] = React.useState(0);
  const [state, setState] = React.useState<State>("asking");

  const currentCard = allCards.current.get(queue[0]) as Card;
  const currentType = cardTypes[currentCard.cardTypeId];

  return (
    <>
      <Header onBack={onBack} />
      <div className="page-padding vertical-stretch">
        {state === "asking" ? (
          <Asking
            card={currentCard}
            cardType={currentType}
            onShow={() => setState("showing")}
          />
        ) : (
          <Showing
            cardId={queue[0]}
            card={currentCard}
            cardType={currentType}
          />
        )}
      </div>
    </>
  );
}

function Asking({
  card,
  cardType,
  onShow
}: {
  card: Card;
  cardType: CardType;
  onShow: () => void;
}) {
  return (
    <>
      <div className="question">
        {cardType.questionType === QuestionType.Speak ? "🔊" : card.question}
      </div>
      {cardType.questionType !== QuestionType.Show &&
      cardType.voiceUri !== undefined ? (
        <Speak voice={cardType.voiceUri} text={card.question} />
      ) : (
        undefined
      )}
      <button className="full-width" onClick={onShow}>
        Check Answer
      </button>
    </>
  );
}

function Showing({
  cardId,
  card,
  cardType
}: {
  cardId: number;
  card: Card;
  cardType: CardType;
}) {
  return (
    <>
      <div className="question">{card.question}</div>
      {cardType.questionType !== QuestionType.Show &&
      cardType.voiceUri !== undefined ? (
        <Speak voice={cardType.voiceUri} text={card.question} />
      ) : (
        undefined
      )}
      <div className="answer">{card.answer}</div>
      <div className="answer-buttons">
        <button className="remove">✘</button>
        <button className="add">✔</button>
      </div>
    </>
  );
}

function getAllCards(
  cardGroups: SavedData["cardGroups"],
  groupIds: Set<number>
): Map<number, Card> {
  return new Map(
    Object.entries(cardGroups)
      .filter(([id, g]) => groupIds.has(parseInt(id)))
      .flatMap(([_id, g]) => Object.entries(g.cards))
      .map(([id, card]) => [parseInt(id), card])
  );
}

function shuffleQueue(ids: Iterable<number>): number[] {
  const ids2 = Array.from(ids);
  return ids2.sort(() => Math.random() - 0.5);
}
