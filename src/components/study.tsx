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

type QuestionState = "asking" | "showing";

type QueueState = {
  queue: number[];
  right: { [cardId: number]: number };
};

export default function Study({
  onBack,
  groupIds,
  cardGroups,
  cardTypes
}: Props) {
  const allCards = React.useRef(getAllCards(cardGroups, groupIds));
  const [queue, setQueue] = React.useState(newQueueState(allCards.current));
  const [state, setState] = React.useState<QuestionState>("asking");

  const onAnswer = React.useCallback(
    (answer: boolean) => {
      console.log(queue);
      setQueue(advanceQueue(queue, answer));
      setState("asking");
    },
    [queue, setQueue]
  );

  console.log("*", queue.queue);
  console.log(queue.right);

  const currentCard = allCards.current.get(queue.queue[0]) as Card;
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
            card={currentCard}
            cardType={currentType}
            onAnswer={onAnswer}
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
  card,
  cardType,
  onAnswer
}: {
  card: Card;
  cardType: CardType;
  onAnswer: (correct: boolean) => void;
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
        <button className="remove" onClick={() => onAnswer(false)}>
          ✘
        </button>
        <button className="add" onClick={() => onAnswer(true)}>
          ✔
        </button>
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

function newQueueState(allCards: Map<number, Card>): QueueState {
  return {
    queue: shuffleQueue(allCards.keys()),
    right: Object.fromEntries(Array.from(allCards.keys()).map(id => [id, 0]))
  };
}

function shuffleQueue(ids: Iterable<number>): number[] {
  const ids2 = Array.from(ids);
  return ids2.sort(() => Math.random() - 0.5);
}

function advanceQueue(queue: QueueState, answeredCorrect: boolean): QueueState {
  const current = queue.queue[0];
  const rest = queue.queue.slice(1);

  if (answeredCorrect) {
    const currentRight = queue.right[current] + 1;

    const right = {
      ...queue.right,
      [current]: currentRight
    };

    rest.splice((currentRight + 1) * 2, 0, current);

    const allRight = Object.values(right).every(x => x > 0);
    const totalRight = Object.values(right).reduce((p, c) => p + c, 0);

    return {
      queue:
        allRight && totalRight % rest.length === 0 ? shuffleQueue(rest) : rest,
      right
    };
  } else {
    rest.splice(1, 0, current);

    return {
      queue: rest,
      right: { ...queue.right, [current]: 0 }
    };
  }
}
