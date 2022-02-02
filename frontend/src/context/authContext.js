/**
 * Note : https://www.react.express/hooks/usereducer
 * The useReducer hook is similar to useState, but gives us a more 
 * structured approach for updating complex values.
 * 
 * We typically use useReducer when our state has multiple sub-values, 
 * e.g. an object containing keys that we want to update independently.
 * 
 * useContext
 * We frequently use contexts for values which will be used throughout
 * our app, such as theme constants or localized strings.
 */

import { createContext, useReducer } from "react";

export const UserContext = createContext();

const initialState = {
  isLogin: null,
  user: {}
};

const reducer = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case 'LOGIN_SUCCESS':
      localStorage.setItem("token", payload.user.token);
      return {
        isLogin: true,
        user: payload.user
      }
    case 'LOGOUT':
      localStorage.removeItem("token");
      return {
        isLogin: false,
        user: {}
      }
    case 'AUTH_SUCCESS':
      localStorage.setItem("token", payload.user.token);
      return {
        isLogin: true,
        user: payload.user
      }
    case 'AUTH_ERROR':
      localStorage.removeItem("token");
      return {
        isLogin: false,
        user: {}
      }
    default:
      throw new Error();
  }
};

export const UserContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <UserContext.Provider value={[state, dispatch]}>
      {children}
    </UserContext.Provider>
  );
};

/**
 * Algoritma:
 * Triger dispatch melalui event pada DOM dengan argument
 * semisal {type:<status login>, payload:<data>} maka akan diteruskan oleh
 * function reducer lalu ke function action kemudian dilakukan
 * destructure objek baru {type, payload} = action lalu
 * dilakukan switch by type untuk melakukan pembaruan state
 */