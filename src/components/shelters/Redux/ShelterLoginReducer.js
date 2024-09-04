import { SHELTER_LOGGED_IN, SHELTER_LOGGED_OUT } from "./ShelterLoginAction";

// ShelterLoginReducer.js
const initialState = {
  isShelterLoggedIn: false,
};

const shelterLoginReducer = (state = initialState, action) => {
  switch (action.type) {
    case SHELTER_LOGGED_IN:
      return { ...state, isShelterLoggedIn: true };
    case SHELTER_LOGGED_OUT:
      return { ...state, isShelterLoggedIn: false };
    default:
      return state;
  }
};

export default shelterLoginReducer;
