import {refreshToken} from "../actions/auth";

export const jwt = ({dispatch, getState}) => {
    return (next) => (action) => {
        if (typeof action === 'function') {
            if (getState().auth && getState().auth.token) {
                const newToken = getState().auth.refreshToken;
                const tokenExpiration = getState().auth.expirationDate;
                var timeNow = new Date().getSeconds();

                if ((tokenExpiration - timeNow < 5)) {

                    if (!getState().auth.refreshingPromise) {
                        return refreshToken(dispatch, newToken).then(() => next(action));
                    } else {
                        return getState().auth.refreshingPromise.then(() => next(action));
                    }
                }
            }
        }
        return next(action);
    };
}