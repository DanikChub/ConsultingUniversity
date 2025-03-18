import React, { useContext } from 'react';
import {Route, Routes} from "react-router-dom";
import { adminRoutes, authRoutes, publicRoutes } from '../routes';

import { Context } from '../index';
import LoginPage from '../pages/LoginPage/LoginPage';
import { observer } from 'mobx-react-lite';
import ErrorPage from '../pages/ErrorPage/ErrorPage';

const AppRouter = observer(() => {
    const {user} = useContext(Context);

    console.log(user.isAuth && user.user.role == "USER", user.isAuth && user.user.role == "ADMIN" );

    return (
        <Routes>
            {user.isAuth && user.user.role == "USER" && authRoutes.map(({path, Component}) =>
                <Route key={path} path={path} element={Component} exact/>
            )}
            {
               user.isAuth && user.user.role == "ADMIN" && adminRoutes.map(({path, Component}) =>
                    <Route key={path} path={path} element={Component} exact/>
                )
            }
            {
                publicRoutes.map(({path, Component}) => 
                <Route key={path} path={path} element={Component} exact/>
                
            )}
            <Route path="*" element={<ErrorPage/>}/>
        </Routes>
    );
});

export default AppRouter;