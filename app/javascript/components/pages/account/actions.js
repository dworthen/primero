import { namespaceActions } from "../../../libs";

import NAMESPACE from "./namespace";

export default namespaceActions(NAMESPACE, [
  "CLEAR_CURRENT_USER",
  "FETCH_CURRENT_USER",
  "FETCH_CURRENT_USER_STARTED",
  "FETCH_CURRENT_USER_SUCCESS",
  "FETCH_CURRENT_USER_FINISHED",
  "FETCH_CURRENT_USER_FAILURE"
]);
