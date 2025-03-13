import ReactDOM from "react-dom/client";
import reportWebVitals from "./reportWebVitals";
import setupLocatorUI from "@locator/runtime"

import "./style/classes.css";
// @ts-ignore
import "./style/index.css";
// @ts-ignore
import "./App.css";
import "./style/applies.css";

// @ts-ignore
import App from "./App";

setupLocatorUI({adapter:'react'});

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);

root.render(<App />);
reportWebVitals();
