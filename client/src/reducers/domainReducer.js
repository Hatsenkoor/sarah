import { GET_DOMAINS_OWNER, MODIFY_PRICE, CREATE_IPFS } from "../actions/types";

const isEmpty = require("is-empty");

const initialState = {
    status: "",
    success: false,
    domains: []
};

export default function(state = initialState, action) {
    switch (action.type) {
      case GET_DOMAINS_OWNER:
          return {
              ...state,
              status: action.payload.status,
              domains: action.payload.domains,
              success: action.payload.success
          }
          break;  
      case MODIFY_PRICE:
          return {
              ...state,
              status: action.payload.status,
              success: action.payload.success
          }  
          case CREATE_IPFS:
            return {
              ...state,
              status: action.payload.state,
              success: action.payload.success,
              ipfsHash: action.payload.CID
            } 
      default:
        return state;
    }
  }