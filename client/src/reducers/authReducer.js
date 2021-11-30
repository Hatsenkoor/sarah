import { LOGIN_WALLET, SET_CURRENT_USER, USER_LOADING, IS_UNIQUE_DOMAIN, INSERT_OWNER_LOGIN, CREATE_IPFS, INSERT_OWNER_DOMAIN, CHANGE_OWNER_DOMAIN } from "../actions/types";

const isEmpty = require("is-empty");

const initialState = {
  isAuthenticated: false,
  isUniqueDomain: false,
  insertLoginSuccess: false,
  insertOwnerLoginFlag: false,
  user: {},
  loading: false,
  success: false,
  status: "",
  ipfsHash : ""
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_CURRENT_USER:
      return {
        ...state,
        isAuthenticated: !isEmpty(action.payload),
        user: action.payload
      };
    case USER_LOADING:
      return {
        ...state,
        loading: true
      };
    case LOGIN_WALLET:
      return{
        ...state,
        status: action.payload.state,
        success: action.payload.success
      }
    case IS_UNIQUE_DOMAIN:
      return {
        ...state,
        isUniqueDomain: action.payload.uniqueFlag,
        status: action.payload.status,
        success: action.payload.success
      }
    case INSERT_OWNER_LOGIN:
      return {
        ...state,
        insertOwnerLoginFlag: action.payload
      }
    case CREATE_IPFS:
      return {
        ...state,
        status: action.payload.state,
        success: action.payload.success,
        ipfsHash: action.payload.CID
      }
    case INSERT_OWNER_DOMAIN:
      return {
        ...state,
        status: action.payload.status,
        success: action.payload.success
      }
    default:
      return state;
  }
}
