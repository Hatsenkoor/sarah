import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";

import { GET_DOMAINS_OWNER, MODIFY_PRICE, GET_ERRORS, CREATE_IPFS } from "./types";

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

export const modifyDomainAction = (params) => dispatch => {
   axios
   .post("./api/domains/modify_price", params)
   .then(res => {
      dispatch({
        type: MODIFY_PRICE,
        payload: res.data
      })
   })
   .catch(err => {
     dispatch({
       type: GET_ERRORS,
       payload: err.response.data
     })
   });
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