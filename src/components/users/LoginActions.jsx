//Actions:
export const LoggedIn = "LoggedIn";
export const LoggedOut = "LoggedOut";

//Funciones:
export const login = () => ({
  //Para un booleano no es necesario declarar un payload
  type: LoggedIn,
});
export const logout = () => ({
  type: LoggedOut,
});
