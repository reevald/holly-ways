import { createContext, useReducer } from "react";

export const ModalContext = createContext();

const initialState = {
  isOpenModalLogin: 'none',
  isOpenModalRegister: 'none',
};

const reducer = (state, action) => {
  const { type } = action;

  switch (type) {
    case 'OPEN_MODAL_LOGIN':
      return {
        isOpenModalLogin: 'flex',
        isOpenModalRegister: 'none',
      }
    case 'OPEN_MODAL_REGISTER':
      return {
        isOpenModalLogin: 'none',
        isOpenModalRegister: 'flex',
      }
    case 'CLOSE_MODAL':
      return {
        isOpenModalLogin: 'none',
        isOpenModalRegister: 'none',
      }
    default:
      throw new Error();
  }
}

export const ModalContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <ModalContext.Provider value={[state, dispatch]}>
      {children}
    </ModalContext.Provider>
  );
};