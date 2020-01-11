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
      <div className="main-menu vertical-stretch">
        <button onClick={onEditCardTypes} className="full-width">
          Card Types
        </button>
        <button onClick={onEditCardGroups} className="full-width">
          Card Groups
        </button>
        <button onClick={onStudy} className="full-width">
          Study
        </button>
      </div>
    </>
  );
}
