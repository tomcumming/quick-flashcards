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
  pending: number[];
  wrong: number[];
  right: number[];

  current: number;
  correctInARow: number;
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

  const currentCard = allCards.current.get(queue.current) as Card;
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
  const allIds = shuffleQueue(allCards.keys());

  return {
    pending: allIds.slice(1),
    wrong: [],
    right: [],

    current: allIds[0],
    correctInARow: 0
  };
}

function shuffleQueue(ids: Iterable<number>): number[] {
  const ids2 = Array.from(ids);
  return ids2.sort(() => Math.random() - 0.5);
}

function advanceQueue(queue: QueueState, answeredCorrect: boolean): QueueState {
  const correctInARow = answeredCorrect ? queue.correctInARow + 1 : 0;
  const totalCards =
    queue.pending.length + queue.wrong.length + queue.right.length + 1;

  if (queue.wrong.length > 0) {
    return {
      pending: queue.pending,
      wrong: queue.wrong
        .slice(1)
        .concat(answeredCorrect ? [] : [queue.current]),
      right: queue.right.concat(answeredCorrect ? [queue.current] : []),

      current: queue.wrong[0],
      correctInARow
    };
  } else {
    let next: number;
    if (queue.pending.length > 0 && queue.right.length > 0)
      next = correctInARow % 2 === 0 ? queue.pending[0] : queue.right[0];
    else if (queue.pending.length > 0) next = queue.pending[0];
    else next = queue.right[0];

    const pending = queue.pending.filter(x => x !== next);
    const wrong = queue.wrong.concat(answeredCorrect ? [] : [queue.current]);
    const right = queue.right
      .concat(answeredCorrect ? [queue.current] : [])
      .filter(x => x !== next);

    return {
      pending,
      wrong,
      right: correctInARow % totalCards === 0 ? shuffleQueue(right) : right,

      current: next,
      correctInARow
    };
  }
}
