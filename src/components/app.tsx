import * as React from "react";

import MainMenu from "./mainmenu";
import EditCardType from "./edit-card-type";
import { QuestionType, emptyCardType, CardType, freshId } from "../data";
import useData from "../hooks/data";

type State =
  | { type: "main-menu" }
  | { type: "edit-card-type"; id: "new" | number };

const initialAppState: State = { type: "main-menu" };

export default function App({}: {}) {
  const [data, setData] = useData();

  const [state, setState] = React.useState(initialAppState);

  const onSaveCardType = React.useCallback(
    (id: "new" | number, cardType: CardType) => {
      let [data2, id2] = id === "new" ? freshId(data) : [data, id];

      const cardTypes = {
        ...data2.cardTypes,
        [id2]: cardType
      };

      setData({ ...data2, cardTypes });
    },
    [data, setData]
  );

  if (state.type === "main-menu") {
    return (
      <MainMenu
        onEditCardTypes={() => alert("edit card types")}
        onEditCardGroups={() => alert("edit card groups")}
        onStudy={() => alert("on study")}
      />
    );
  } else if (state.type === "edit-card-type") {
    const card = state.id === "new" ? emptyCardType : data.cardTypes[state.id];

    return (
      <EditCardType
        cardTypeId={state.id}
        initialValue={card}
        onConfirm={onSaveCardType}
        onBack={() => alert("back pressed")}
      />
    );
  } else {
    throw new Error("Unknown app state");
  }
}
