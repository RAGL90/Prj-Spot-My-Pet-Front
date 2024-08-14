import reducer from "../reducers";
import { legacy_createStore as createStore } from "redux";

const store = createStore(reducer);

store.subscribe(() => {
  console.log("Estado actualizado: " + store.getState());
});

export default store;
