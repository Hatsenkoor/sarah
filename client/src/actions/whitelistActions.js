import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";
import { GET_ERRORS, ADD_WHITELIST } from "./types";
export const addWhitelistAction = (params) => dispatch => {
    console.log(params);
    axios
    .post("/api/whitelists/add_whitelist", params)
    .then(res => {
        dispatch({
          type: ADD_WHITELIST,
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