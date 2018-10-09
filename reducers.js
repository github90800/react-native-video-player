import { combineReducers } from 'redux';

const userReducer = function(state = null, action){

    switch(action.type){
        case "UDPATE_USER":
            return action.payload;
        default:
            return state;
    }
}

export default combineReducers({
    user: userReducer,
})

