//Actions:
export const SHELTER_LOGGED_IN = "SHELTER_LOGGED_IN";
export const SHELTER_LOGGED_OUT = "SHELTER_LOGGED_OUT";

//Funciones:
export const loginShelter = () => ({
  //Para un booleano no es necesario declarar un payload
  type: SHELTER_LOGGED_IN,
});
export const logoutShelter = () => ({
  type: SHELTER_LOGGED_OUT,
});
