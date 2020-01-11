import { createElement } from "react";
import { render } from "react-dom";

import App from "./components/app";

function start() {
  const wrapper = document.querySelector("#wrapper");
  if (wrapper === null) throw new Error("Can't find wrapper");

  render(createElement(App), wrapper);
}

start();
