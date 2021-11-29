import { combineReducers } from "redux";
import authReducer from "./authReducer";
import domainReducer from "./domainReducer";
import errorReducer from "./errorReducer";

export default combineReducers({
  auth: authReducer,
  errors: errorReducer,
  domain: domainReducer
});
