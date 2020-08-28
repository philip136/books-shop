import React from 'react';
import {Redirect, Route} from 'react-router-dom';


export const PrivateRouter = ({component: Component, ...rest}) => {
    return (
        <Route
            {...rest}
            render={props => 
                localStorage.getItem('is_staff') ? (
                    <Component {...props} />
                ) : (
                <Redirect
                    to={{pathname: '/login/', state: {from: props.location}
                }}
                />
            )
        }
        />
    )
};