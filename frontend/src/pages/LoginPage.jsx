import LoginPageComponent from "./components/LoginPageComponent";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setReduxUserState } from "../redux/actions/userActions";

//api request
const loginUserApiRequest = async (email, password, doNotLogout) => {
  const response = await axios.post("/api/users/login", {
    email,
    password,
    doNotLogout,
  });
  const userInfo = response.data.userLoggedIn;
  // Create a new object with selected properties
  const sanitizedUser = {
    name: userInfo.name,
    lastName: userInfo.lastName,
    isAdmin: userInfo.isAdmin,
    isGRAdmin: userInfo.isGRAdmin,
    doNotLogout: userInfo.doNotLogout,
    productType: userInfo.productType,
    isRTVAdmin: userInfo.isRTVAdmin,
  };
  if (response.data.userLoggedIn.doNotLogout) {
    localStorage.setItem(
      "userInfo",
      JSON.stringify(sanitizedUser)
    );
  } else
    sessionStorage.setItem(
      "userInfo",
      JSON.stringify(sanitizedUser)
    );

  return response.data;
};

//render login page
const LoginPage = () => {
  const reduxDispatch = useDispatch();

  return (
    <LoginPageComponent
      loginUserApiRequest={loginUserApiRequest}
      reduxDispatch={reduxDispatch}
      setReduxUserState={setReduxUserState}
    />
  );
};

export default LoginPage;
