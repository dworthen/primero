import "../wdyr";
import "core-js/stable";
import "regenerator-runtime/runtime";

import { render } from "react-dom";

// TODO: not sure why this lint rule suppression is necessary
/* eslint-disable-next-line import/no-unresolved */
import App from "../app";
import serviceWorker from "../service-worker";
import ErrorLogger from "../libs/error-logger";

serviceWorker();

ErrorLogger.startErrorListeners();

render(<App />, document.getElementById("root"));
