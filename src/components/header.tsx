import * as React from "react";

export type Props = {
  onBack?: () => void;
};

export default function Header({ onBack }: Props) {
  const showTitle = onBack === undefined;

  return (
    <header>
      {!showTitle ? undefined : <div className="title">Quick Flashcards</div>}

      {onBack === undefined ? (
        undefined
      ) : (
        <button className="back" onClick={onBack}>
          Go Back
        </button>
      )}
    </header>
  );
}
