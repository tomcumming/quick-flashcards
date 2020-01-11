import * as React from "react";

import EditCardType from "./edit-card-type";
import { QuestionType } from "../data";

export default function App({}: {}) {
  return (
    <EditCardType
      cardTypeId="new"
      initialValue={{ name: "", questionType: QuestionType["show-and-speak"] }}
    />
  );
}
