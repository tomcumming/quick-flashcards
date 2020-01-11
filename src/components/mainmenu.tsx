import * as React from "react";

import Header from "./header";

export type Props = {
  onEditCardTypes: () => void;
  onEditCardGroups: () => void;
  onStudy: () => void;
};

export default function MainMenu({
  onEditCardTypes,
  onEditCardGroups,
  onStudy
}: Props) {
  return (
    <>
      <Header />
      <div className="main-menu">
        <button onClick={onEditCardTypes}>Card Types</button>
        <button onClick={onEditCardGroups}>Card Groups</button>
        <button onClick={onStudy}>Study</button>
      </div>
    </>
  );
}
