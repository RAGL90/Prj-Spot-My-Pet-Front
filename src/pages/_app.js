import React from "react";
import { Provider } from "react-redux";
import store from "@/core/redux/store";
import "@/styles/globals.css";

//NO BORRAR!
export default function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}
