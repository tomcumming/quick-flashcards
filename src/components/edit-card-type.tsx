import * as React from "react";

import Header from "./header";
import useVoices from "../hooks/voices";
import { CardType, QuestionType } from "../data";

const noVoiceSelected = "__none";

export type Props = {
  cardTypeId: "new" | number;
  initialValue: CardType;
  onConfirm: (id: "new" | number, cardType: CardType) => void;
  onBack: () => void;
};

export default function EditCardType({
  cardTypeId,
  initialValue,
  onConfirm,
  onBack
}: Props) {
  const [currentValue, setCurrentValue] = React.useState(initialValue);

  const voices = useVoices();
  const selectedVoiceUri =
    currentValue.voiceUri === undefined
      ? noVoiceSelected
      : currentValue.voiceUri;

  const onFormSubmit = React.useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      onConfirm(cardTypeId, currentValue);
    },
    [cardTypeId, currentValue]
  );

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
        <div className="edit-group vertical-stretch">
          <label>Question Type</label>
          <select
            value={currentValue.questionType}
            onChange={e =>
              setCurrentValue({
                ...currentValue,
                questionType: e.target.value as QuestionType
              })
            }
          >
            {Object.entries(QuestionType).map(([t, l]) => (
              <option key={l} value={l}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div className="edit-group vertical-stretch">
          <label>Speech Voice</label>
          <select
            value={selectedVoiceUri}
            onChange={e =>
              setCurrentValue({
                ...currentValue,
                voiceUri:
                  e.target.value === noVoiceSelected
                    ? undefined
                    : e.target.value
              })
            }
          >
            <option disabled value={noVoiceSelected}>
              None selected
            </option>
            {voices.map(v => (
              <option key={v.voiceURI} value={v.voiceURI}>
                {v.lang} - {v.name}
              </option>
            ))}
          </select>
        </div>
        <input type="submit" value="save" />
      </form>
    </>
  );
}
