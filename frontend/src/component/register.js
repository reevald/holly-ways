import { useContext, useState } from "react";
import { UserContext } from "../context/authContext";
import { ModalContext } from "../context/modalContext";
import { useHistory } from "react-router-dom";

import { useMutation } from "react-query";

import { API } from "../config/api";

function CompRegister() {
  const history = useHistory();
  const api = API();

  const [, dispatchUser] = useContext(UserContext);
  const [stateModal, dispatchModal] = useContext(ModalContext);

  // Show modal login handler
  const openModalLogin = () => dispatchModal({ type: 'OPEN_MODAL_LOGIN' });
  // Show modal register handler
  const openModalRegister = () => dispatchModal({ type: 'OPEN_MODAL_REGISTER' });
  const closeModalRegister = () => dispatchModal({ type: 'CLOSE_MODAL' });

  // Form register handler
  const [dataForm, setDataForm] = useState({
    email: "",
    password: "",
    fullName: "",
  });

  // Message register handler
  const [message, setMessage] = useState(null);
  const generateMessage = (msg) => {
    return (
      <div className="w-full py-2 text-center bg-red-100 text-red-900 rounded-md mb-3">
        {msg}
      </div>
    );
  }

  const onChangeHandler = (event) => {
    setDataForm({
      ...dataForm,
      [event.target.name]: event.target.value,
    })
  };

  const onSubmitHandler = useMutation(async (event) => {
    event.preventDefault();

    // Data body
    const reqBody = JSON.stringify(dataForm);

    const config = {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8"
      },
      body: reqBody
    }

    // Insert data to database
    const response = await api.post("/register", config);

    if (response.status === "success") {
      dispatchUser({
        type: 'LOGIN_SUCCESS',
        payload: response.data,
      });
      closeModalRegister();
      history.push('/');
    }

    if (response.status === "failed") {
      setMessage(generateMessage(
        response.message
      ));
      console.log(response);
      console.log("Login gagal");
    }
  });
  return (
    <>
      <div
        onClick={openModalRegister}
        className='cursor-pointer text-xs font-bold bg-white px-4 py-1.5 text-red-hw rounded-lg'>
        Register
      </div>

      {/* Modal register */}
      <div
        style={{
          display: stateModal.isOpenModalRegister,
        }}
        className="fixed inset-x-0 top-0 w-full h-screen flex flex-col justify-center items-center">
        <div
          className='flex-none fixed inset-x-0 top-0 h-screen bg-gray-900 bg-opacity-60'
          onClick={closeModalRegister}
        />
        <div className='z-10 bg-white px-5 py-8 rounded-lg flex flex-col max-w-xs w-full'>
          <div className="text-2xl font-bold mb-6">
            Register
          </div>
          {message && message}
          <form
            onSubmit={(e) => onSubmitHandler.mutate(e)}
            className="flex flex-col mb-3">
            <input
              className="mb-3 border-2 border-gray-hw-200 rounded-md p-1 bg-gray-100"
              name="email"
              type="email"
              placeholder="Email"
              value={dataForm.email}
              onChange={onChangeHandler}
              required
            />
            <input
              className="mb-3 border-2 border-gray-hw-200 rounded-md p-1 bg-gray-100"
              name="password"
              type="password"
              placeholder="Password"
              value={dataForm.password}
              onChange={onChangeHandler}
              required
            />
            <input
              className="mb-6 border-2 border-gray-hw-200 rounded-md p-1 bg-gray-100"
              name="fullName"
              type="text"
              placeholder="Full Name"
              value={dataForm.fullName}
              onChange={onChangeHandler}
              required
            />
            <button className="bg-red-hw text-white w-full py-2 rounded-lg" type="submit">
              Register
            </button>
          </form>
          <div className="text-sm text-center">
            Already have an account? Click <b className="cursor-pointer" onClick={openModalLogin}>Here</b>
          </div>
        </div>
      </div>
    </>
  );
}

export default CompRegister;