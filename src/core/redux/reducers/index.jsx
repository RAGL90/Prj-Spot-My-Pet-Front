const { combineReducers } = require("redux");
import shelterLoginReducer from "@/components/shelters/Redux/ShelterLoginReducer";
import LoginReducer from "@/components/users/LoginRedux";

const rootReducer = combineReducers({
  login: LoginReducer,
  shelterLogin: shelterLoginReducer,
});

export default rootReducer;
