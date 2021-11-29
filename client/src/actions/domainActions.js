import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";

import { GET_DOMAINS_OWNER, GET_ERRORS } from "./types";

export const getDomainsOwnerAction = (params) => dispatch => {
    axios
    .post("/api/domains/get_domains_owner", params)
    .then(res => {
        console.log(res);
        dispatch({
          type: GET_DOMAINS_OWNER,
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