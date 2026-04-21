import React, { useContext } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import { adminRoutes, authRoutes, publicRoutes, viewerRoutes } from '../routes';
import { Context } from '../index';

import LoginPage from '../pages/LoginPage/LoginPage';
import ErrorPage from '../pages/ErrorPage/ErrorPage';
import SetInitialPasswordPage from '../pages/SetInitialPasswordPage/SetInitialPasswordPage';

import ScrollToTop from './ScrollToTop/ScrollToTop';
import {
    ADMIN_ROUTE,
    SET_INITIAL_PASSWORD_ROUTE,
    USER_ROUTE,
} from '../shared/utils/consts';

function RedirectTo({ role }: { role?: string }) {
    if (role === 'USER') {
        return <Navigate to={USER_ROUTE} replace />;
    }

    if (role === 'ADMIN' || role === 'VIEWER') {
        return <Navigate to={ADMIN_ROUTE} replace />;
    }

    return <Navigate to="/signin" replace />;
}

const AppRouter = observer(() => {
    const { user } = useContext(Context);

    const mustChangePassword = Boolean(user.user?.must_change_password);

    return (
        <>
            <ScrollToTop />

            <Routes>
                {/* Если пользователь обязан сменить пароль — пускаем только на эту страницу */}
                {user.isAuth && mustChangePassword ? (
                    <>
                        <Route
                            path={SET_INITIAL_PASSWORD_ROUTE}
                            element={<SetInitialPasswordPage />}
                        />
                        <Route
                            path="*"
                            element={<Navigate to={SET_INITIAL_PASSWORD_ROUTE} replace />}
                        />
                    </>
                ) : (
                    <>
                        {user.isAuth &&
                            user.user.role === 'USER' &&
                            authRoutes.map(({ path, Component }) => (
                                <Route key={path} path={path} element={Component} />
                            ))}

                        {user.isAuth &&
                            user.user.role === 'ADMIN' &&
                            adminRoutes.map(({ path, Component }) => (
                                <Route key={path} path={path} element={Component} />
                            ))}

                        {user.isAuth &&
                            user.user.role === 'VIEWER' &&
                            viewerRoutes.map(({ path, Component }) => (
                                <Route key={path} path={path} element={Component} />
                            ))}

                        {publicRoutes.map(({ path, Component }) => (
                            <Route key={path} path={path} element={Component} />
                        ))}

                        <Route path="/" element={<RedirectTo role={user.user.role} />} />

                        {user.isAuth ? (
                            <Route path="*" element={<ErrorPage />} />
                        ) : (
                            <Route path="*" element={<LoginPage />} />
                        )}
                    </>
                )}
            </Routes>
        </>
    );
});

export default AppRouter;