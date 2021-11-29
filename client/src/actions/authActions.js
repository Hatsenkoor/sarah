import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";

import { GET_ERRORS, SET_CURRENT_USER, USER_LOADING, IS_UNIQUE_DOMAIN, INSERT_OWNER_LOGIN, CREATE_IPFS, INSERT_OWNER_DOMAIN, LOGIN_WALLET } from "./types";

// Register User
export const registerUser = (userData, history) => dispatch => {
  axios
    .post("/api/users/register", userData)
    .then(res => history.push("/login"))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

export const insertOwnerDomainAction = (params) => dispatch => {
  axios
  .post("/api/users/insert_owner_domain", params)
  .then(res => {
      console.log(res);
      dispatch({
        type: INSERT_OWNER_DOMAIN,
        payload: res.data
      })
  })
  .catch(err =>
    dispatch({
      type: GET_ERRORS,
      payload: err.response.data
    })
  );
}

export const createIPFSAction = (params) => dispatch => {
  axios
  .post("/api/users/create_ipfs", params)
  .then(res => {
      console.log(res);
      dispatch({
        type: CREATE_IPFS,
        payload: res.data
      })
  })
  .catch(err =>
    dispatch({
      type: GET_ERRORS,
      payload: err.response.data
    })
  );
}

export const verifyUniqueAction = (domainName) => dispatch => {
  axios
  .post("/api/users/verify_unique", domainName)
  .then(res => {
      console.log(res);
      dispatch({
        type: IS_UNIQUE_DOMAIN,
        payload: res.data
      })
  })
  .catch(err =>
    dispatch({
      type: GET_ERRORS,
      payload: err.response.data
    })
  );
}

export const insertOwnerLoginAction = (params) => dispatch => {
  axios
  .post("/api/users/insert_owner_login", params)
  .then(res => {
      console.log(res);
      dispatch({
        type: INSERT_OWNER_LOGIN,
        payload: res.data.success
      })
  })
  .catch(err =>
    dispatch({
      type: GET_ERRORS,
      payload: err.response.data
    })
  );
}

// Login - get user token
export const loginUser = userData => dispatch => {
  axios
    .post("/api/users/login", userData)
    .then(res => {
      console.log(res);
      // Save to localStorage
      if (res.data.success){
          const { token } = res.data;
          localStorage.setItem("jwtToken", token);
          // Set token to Auth header
          setAuthToken(token);
          // Decode token to get user data
          const decoded = jwt_decode(token);
          // Set current user
          dispatch(setCurrentUser(decoded));
      } else {
        dispatch({
          type: LOGIN_WALLET,
          payload: res.data
        })
      }
      // Set token to localStorage
      
    })
    .catch(err =>
      console.log(err)
      // dispatch({
      //   type: GET_ERRORS,
      //   payload: err.response.data
      // })
    );
};

// Set logged in user
export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  };
};

// User loading
export const setUserLoading = () => {
  return {
    type: USER_LOADING
  };
};

// Log user out
export const logoutUser = () => dispatch => {
  // Remove token from local storage
  localStorage.removeItem("jwtToken");
  // Remove auth header for future requests
  setAuthToken(false);
  // Set current user to empty object {} which will set isAuthenticated to false
  dispatch(setCurrentUser({}));
};
