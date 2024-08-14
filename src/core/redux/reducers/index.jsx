const { combineReducers } = require("redux");
import LoginReducer from "@/components/users/LoginRedux";

const rootReducer = combineReducers({
  login: LoginReducer,
});

export default rootReducer;
