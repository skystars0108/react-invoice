import React from 'react'
import { Navigate} from 'react-router-dom';

import { getLocalStorage } from './helper';
const PrivateRoute = (Component) => {
    const checkAuth = getLocalStorage().CNF;
    return (
        checkAuth ? (
            <Component/>
        ) : (
            <Navigate to ="/" />
        )
    )
}
export default PrivateRoute;