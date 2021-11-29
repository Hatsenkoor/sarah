import { GET_DOMAINS_OWNER } from "../actions/types";

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
      default:
        return state;
    }
  }