const { LoggedIn, LoggedOut } = require("./LoginActions");

const initialState = {
  userLog: false,
};

const LoginReducer = (state = initialState, action) => {
  switch (action.type) {
    case LoggedIn:
      return {
        ...state,
        userLog: true,
      };
    case LoggedOut:
      return {
        ...state,
        userLog: false,
      };
    default:
      return state;
  }
};

export default LoginReducer;
