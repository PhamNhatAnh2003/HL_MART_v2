import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Fragment } from "react";

import { publicRoutes, privateRoutes } from "../routes";
import layouts from "../layouts";

const App = () => {
    return (
        <Router>
            <div className="App">
                <Routes>
                    {publicRoutes.map((route, index) => {
                        const Page = route.component;

                        let Layout = layouts.admin.default;
                        if (route.layout === null) {
                            Layout = Fragment; // No layout
                        } else if (route.layout) {
                            Layout = route.layout; // Custom layout if provided
                        }

                        return (
                            <Route
                                key={index}
                                path={route.path}
                                element={
                                    <Layout>
                                        <Page />
                                    </Layout>
                                }
                            />
                        );
                    })}

                    {/* {privateRoutes.map((route, index) => {
                        const Page = route.component;

                        let Layout = layouts.admin.default;

                        if (route.layout === null) {
                            Layout = Fragment; // No layout
                        } else if (route.layout) {
                            Layout = route.layout; // Custom layout if provided
                        }

                        const currentRole = route.role || null;
                        let forbidden = false;
                        if (currentRole !== null && currentRole !== role) {
                            forbidden = true;
                        }
                        return (
                            <Route
                                key={index}
                                path={route.path}
                                element={
                                    <ProtectedRoute
                                        isAuthenticated={isAuthenticated}
                                        nextUrl={route.path}
                                        forbidden={forbidden}
                                    >
                                        <Layout>
                                            <Page />
                                        </Layout>
                                    </ProtectedRoute>
                                }
                            />
                        );
                    })} */}
                </Routes>
            </div>
        </Router>
    );
};

export default App;
