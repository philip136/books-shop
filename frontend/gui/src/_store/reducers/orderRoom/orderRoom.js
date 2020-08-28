import {updateObject} from '../../utillity';
import * as actionTypes from '../../actions/actionTypes';

const initialState = {
    locations: [],
    room: []
};

const addLocation = (state, action) => {
    return updateObject(state, {
        locations: [...state.locations, action.location]
    });
};

const setLocations = (state, action) => {
    return updateObject(state, {
        locations: action.locations
    });
};

const setRoom = (state, action) => {
    return updateObject(state, {
        room: action.room
    });
};

const reducer = (state=initialState, action) => {
    switch (action.type) {
        case actionTypes.ADD_LOCATION: return addLocation(state, action);
        case actionTypes.SET_LOCATIONS: return setLocations(state, action);
        case actionTypes.GET_ROOM_SUCCESS: return setRoom(state, action);
        default:
            return state;
    }
};

export default reducer;