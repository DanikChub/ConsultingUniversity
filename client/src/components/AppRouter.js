import React, { useContext } from 'react';
import {Route, Routes} from "react-router-dom";
import {adminRoutes, authRoutes, publicRoutes, viewerRoutes} from '../routes';

import { Context } from '../index';
import LoginPage from '../pages/LoginPage/LoginPage';
import { observer } from 'mobx-react-lite';
import ErrorPage from '../pages/ErrorPage/ErrorPage';
import { Navigate } from 'react-router-dom';
import ScrollToTop from "./ScrollToTop/ScrollToTop";

function RedirectTo({ role }) {
  if (role == 'USER') {
    return <Navigate to="/user" replace />; // 'replace' prevents adding to history
  } else if (role == 'ADMIN' || 'VIEWER') {
    return <Navigate to="/admin" replace />;
  }
  return <Navigate to="/signin" replace />
}

const AppRouter = observer(() => {
    const {user} = useContext(Context);

  

    return (
        <>
            <ScrollToTop/>
            <Routes className="cotrol_height">
                {user.isAuth && user.user.role == "USER" && authRoutes.map(({path, Component}) =>
                    <Route key={path} path={path} element={Component} exact/>
                )

                }
                {
                    user.isAuth && user.user.role == "ADMIN" && adminRoutes.map(({path, Component}) =>
                        <Route key={path} path={path} element={Component} exact/>
                    )
                }
                {
                    user.isAuth && user.user.role == "VIEWER" && viewerRoutes.map(({path, Component}) =>
                        <Route key={path} path={path} element={Component} exact/>
                    )
                }
                {
                    publicRoutes.map(({path, Component}) =>
                        <Route key={path} path={path} element={Component} exact/>

                    )}
                <Route path="/" element={<RedirectTo role={user.user.role}/>} />
                <Route path="*" element={<ErrorPage/>}/>
            </Routes>
        </>

    );
});

export default AppRouter;