import store from "./index";
import { checkToken } from "./auth/login/actions";

function init() {
  store.dispatch(checkToken());
}

export default init;
