import React, { lazy, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Route, Routes } from 'react-router-dom';

const Home = lazy(() => import('../pages/Home'));
const EmailVerify = lazy(() => import('../pages/login/EmailVerify'));
const Login = lazy(() => import('../pages/login/Login'));
const PageNotFound = lazy(() => import('../utility/PageNotFound'));
const TopBar = lazy(() => import('../utility/TopBar'));
const LoginProfile = lazy(() => import('../pages/login/LoginProfile'));
const Signup = lazy(() => import('../pages/login/Signup'));


function MainLayout({ children }) {
    return (
        <>
            <TopBar />
            <div style={{ height: "calc(100vh - 75px)" }}>
                {children}
            </div>
        </>
    );
}

function FullLayout({ children }) {
    return (
        <>
            {children}
        </>
    );
}

const authList = [
    {
        title: "",
        path: "/login",
        view: <Login />,
        layout: "full"
    },
    {
        title: "",
        path: "/signup",
        view: <Signup />,
        layout: "full"
    },
    {
        title: "",
        path: "/email",
        view: <EmailVerify />,
        layout: "full"
    },
    {
        title: "",
        path: "/LoginProfile",
        view: <LoginProfile />,
        layout: "full"
    }
];

const publicList = [
    {
        title: "",
        path: "*",
        view: <PageNotFound />,
        layout: "full"
    },
    {
        title: "",
        path: "/",
        view: <Home />,
        layout: "home"
    }
];

export default function RoutesPage() {
    const userData = useSelector((state) => state?.user?.userData);
    const [routesList, setRoutesList] = useState([]);

    useEffect(() => {
        if (userData?._id) {
            setRoutesList([...authList, ...publicList])
        } else {
            setRoutesList(authList);
        }
    }, [userData]);

    return (
        <>
        <Routes>

            {routesList.map((elm) => {
                if (elm.layout === "full") {
                    return <Route key={elm.path} path={elm.path} element={<FullLayout>{elm.view}</FullLayout>} />;
                } else {
                    return (
                        <Route
                            key={elm.path}
                            path={elm.path}
                            element={<MainLayout>{elm.view}</MainLayout>}
                        />
                    );
                }
            })}
        </Routes>
        </>

    );
}
