import { combineReducers } from "redux";
import authReducer from "./authReducer";
import domainReducer from "./domainReducer";
import whitelistReducer from "./whitelistReducer";

import errorReducer from "./errorReducer";

export default combineReducers({
  auth: authReducer,
  errors: errorReducer,
  domain: domainReducer,  
});
