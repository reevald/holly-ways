import { Route, Switch, Redirect } from 'react-router-dom';
import { useContext, useEffect, useCallback, useState } from 'react';
import { UserContext } from './context/authContext';
import './App.css';

// Pages
import HomePage from "./pages/home";
import AddRFPage from './pages/addRaiseFund';
import DetailDonatePage from './pages/detailDonate';
import DetailMyRFPage from './pages/detailMyRaiseFund';
import ListMyRFPage from './pages/listMyRaiseFund';
import ProfilePage from './pages/profile';
import UpdateRFPage from './pages/updateRaiseFund';

import CompLoadingFullScreen from './component/loading';

import { API } from './config/api';

// Reference:
// https://dev.to/nilanth/how-to-create-public-and-private-routes-using-react-router-72m
// https://github.com/ilhamfathoni2/integration-dewe-tour/blob/master/client/src/App.js
function PrivateRoute({ children, ...rest }) {
  const [stateUser,] = useContext(UserContext);
  const isLogin = stateUser.isLogin;
  console.log("isLogin PrivateRoute", isLogin);

  if (isLogin === null) {
    return null; // alt : <></>
  } else {
    return (
      <Route
        {...rest}
        // error when use history.push() (error render?) (condition: not login, if login is ok)
        render={() => isLogin ? children : <Redirect to='/' />}
      />
    );
  }
}

function App() {
  const [,dispatchUser] = useContext(UserContext);
  const [isCheckLoading, setIsCheckLoading] = useState(true);

  const checkUserLogin = useCallback(async () => {
    const api = API(); // inside scope checkUserLogin to avoid infinite loop
    // because every rander make api get update
    try {
      // Using bearer for jwt token (but bearer is only be used over https?)
      // ref: https://swagger.io/docs/specification/authentication/basic-authentication/
      // ref: https://swagger.io/docs/specification/authentication/bearer-authentication/
      // ref: https://stackoverflow.com/a/34022350
      const config = {
        method: "GET",
        headers: {
          Authorization: "Bearer " + localStorage.token
        }
      };
      const response = await api.get("/check-auth", config);
      setIsCheckLoading(false);

      // handle invalid token and error server
      if (response.status === "failed") {
        return dispatchUser({
          type: "AUTH_ERROR"
        });
      }

      if (response.status === "success") {
        return dispatchUser({
          type: "AUTH_SUCCESS",
          payload: response.data,
        });
      }

    } catch (error) {
      console.log(error);
    }
  }, [dispatchUser]);

  // Ref: https://reactjs.org/docs/hooks-effect.html
  // Avoid warning : "React Hook useEffect has a missing dependency blabla",
  // Ref: https://stackoverflow.com/a/60327893 (useCallback)
  useEffect(() => {
    console.log("running"); // for checking infinite loop
    checkUserLogin();
  }, [checkUserLogin]);

  if (isCheckLoading) {
    return (
      <CompLoadingFullScreen />
    );
  } else {
    return (
      <>
        <Switch>
          <Route exact path="/" component={HomePage} />
          <PrivateRoute>
            <Route exact path="/raise-fund/:id" component={DetailDonatePage} />
            <Route exact path="/my-raise-fund/:id" component={DetailMyRFPage} />
            <Route exact path="/add-raise-fund" component={AddRFPage} />
            <Route exact path="/my-raise-fund" component={ListMyRFPage} />
            <Route exact path="/profile" component={ProfilePage} />
            <Route exact path="/update-raise-fund/:id" component={UpdateRFPage} />
          </PrivateRoute>
        </Switch>
      </>
    );
  }
}

export default App;
