import * as React from "react";

export type Props = {
  onBack?: () => void;
};

export default function Header({ onBack: goBack }: Props) {
  return (
    <header>
      {goBack === undefined ? (
        undefined
      ) : (
        <button className="back" onClick={goBack}>
          Go Back
        </button>
      )}
    </header>
  );
}
