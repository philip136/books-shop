import {updateObject} from '../../utillity';
import * as actionTypes from '../../actions/actionTypes';

const initialState = {
    orderSuccess: false,
    error: null,
    locations: [],
    room: [],
    isClosed: false
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
        room: action.room,
        orderSuccess: true
    });
};

const closeRoom = (state, action) => {
    return updateObject(state, {
        isClosed: true
    });
};

const reducer = (state=initialState, action) => {
    switch (action.type) {
        case actionTypes.ADD_LOCATION: return addLocation(state, action);
        case actionTypes.SET_LOCATIONS: return setLocations(state, action);
        case actionTypes.GET_ROOM_SUCCESS: return setRoom(state, action);
        case actionTypes.CLOSE_ORDER: return closeRoom(state, action);
        default:
            return state;
    }
};

export default reducer;