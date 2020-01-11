import * as React from "react";

import useVoices from "../hooks/voices";
import { CardType, QuestionType } from "../data";

const noVoiceSelected = "__none";

export type Props = {
  cardTypeId: "new" | number;
  initialValue: CardType;
};

export default function EditCardType({ initialValue }: Props) {
  const [currentValue, setCurrentValue] = React.useState(initialValue);

  const voices = useVoices();
  const selectedVoiceUri =
    currentValue.voiceUri === undefined
      ? noVoiceSelected
      : currentValue.voiceUri;

  return (
    <React.Fragment>
      <button>Go Back</button>

      <form>
        <div className="edit-group">
          <label>Name</label>
          <input
            type="text"
            value={currentValue.name}
            onChange={e =>
              setCurrentValue({ ...currentValue, name: e.currentTarget.value })
            }
          />
        </div>
        <div className="edit-group">
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
              <option key={t} value={t}>
                {l}
              </option>
            ))}
          </select>
        </div>
        <div className="edit-group">
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
      </form>
    </React.Fragment>
  );
}
