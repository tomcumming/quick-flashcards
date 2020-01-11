export type SavedData = {
  nextUnique: number;

  cardTypes: { [id: number]: CardType };
  cardGroups: { [id: number]: Card };
};

export enum QuestionType {
  "show" = "Show",
  "speak" = "Speak",
  "show-and-speak" = "Show and speak"
}

export type CardType = {
  name: string;
  questionType: QuestionType;
  voiceUri?: string;
};

export type CardGroup = {
  name: string;
  cards: {
    [id: number]: Card;
  };
};

export type Card = {
  cardTypeId: number;

  question: string;
  answer: string;
};
