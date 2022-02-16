import { GET_ERRORS, ADD_WHITELIST } from "../actions/types";
const isEmpty = require("is-empty");
const initial = {    
    user: {},
    loading: false,
    success: false,
    status: "",
};

export default function(state = initial, action) {
    switch(action.type) {
        case ADD_WHITELIST:
            return{
                ...state,
                status: action.payload.status,
                success: action.payload.success
            }            
    }
}