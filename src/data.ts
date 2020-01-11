export type SavedData = {
  nextUnique: number;

  cardTypes: { [id: number]: CardType };
  cardGroups: { [id: number]: CardGroup };
};

export enum QuestionType {
  "Show" = "show",
  "Speak" = "speak",
  "Show and speak" = "show-and-speak"
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

export const defaultSavedData: SavedData = {
  nextUnique: 1,
  cardTypes: {},
  cardGroups: {}
};

export const emptyCardType: CardType = {
  name: "",
  questionType: QuestionType["Show and speak"]
};

export const emptyCardGroup: CardGroup = {
  name: "",
  cards: {}
};

export function freshId(data: SavedData): [SavedData, number] {
  return [{ ...data, nextUnique: data.nextUnique + 1 }, data.nextUnique];
}
