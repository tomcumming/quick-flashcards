import * as React from "react";

import MainMenu from "./mainmenu";
import CardTypes from "./card-types";
import CardGroups from "./card-groups";
import EditCardType from "./edit-card-type";
import {
  QuestionType,
  emptyCardType,
  CardType,
  freshId,
  SavedData
} from "../data";
import useData from "../hooks/data";

type State =
  | { type: "main-menu" }
  | { type: "card-types" }
  | { type: "card-groups" }
  | { type: "edit-card-type"; id: "new" | number }
  | { type: "edit-card-group"; id: "new" | number };

const initialAppState: State = { type: "main-menu" };

export default function App({}: {}) {
  const [data, setData] = useData();

  const [state, setState] = React.useState(initialAppState);

  if (state.type === "main-menu") {
    return (
      <MainMenu
        onEditCardTypes={() => setState({ type: "card-types" })}
        onEditCardGroups={() => setState({ type: "card-groups" })}
        onStudy={() => alert("on study")}
      />
    );
  } else if (state.type === "card-types") {
    return (
      <CardTypes
        cardTypes={data.cardTypes}
        onBack={() => setState({ type: "main-menu" })}
        onEdit={id => setState({ type: "edit-card-type", id })}
      />
    );
  } else if (state.type === "card-groups") {
    return (
      <CardGroups
        cardGroups={data.cardGroups}
        onBack={() => setState({ type: "main-menu" })}
        onEdit={id => setState({ type: "edit-card-group", id })}
      />
    );
  } else if (state.type === "edit-card-type") {
    return (
      <EditCardTypeScreen
        data={data}
        setData={setData}
        id={state.id}
        setState={setState}
      />
    );
  } else {
    throw new Error("Unknown app state");
  }
}

function EditCardTypeScreen({
  data,
  setData,
  id,
  setState
}: {
  data: SavedData;
  setData: (data: SavedData) => void;
  id: "new" | number;
  setState: (state: State) => void;
}) {
  const onSaveCardType = React.useCallback(
    (id: "new" | number, cardType: CardType) => {
      let [data2, id2] = id === "new" ? freshId(data) : [data, id];

      const cardTypes = {
        ...data2.cardTypes,
        [id2]: cardType
      };

      setData({ ...data2, cardTypes });
      setState({ type: "card-types" });
    },
    [data, setData]
  );

  const card = id === "new" ? emptyCardType : data.cardTypes[id];

  return (
    <EditCardType
      cardTypeId={id}
      initialValue={card}
      onConfirm={onSaveCardType}
      onBack={() => setState({ type: "card-types" })}
    />
  );
}
