import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Fragment } from "react";

import { publicRoutes, privateRoutes } from "../routes";
import layouts from "../layouts";
import Filter from "../components/Filter";
import Step2 from "../Pages/user/Cart/Step/Step2";
import UserInfor from "../Pages/user/UserInfor";

const App = () => {
    return (
        // <UserInfor />
        // <Step2 />
        // <Filter />
        <Router>
            <div className="App">
                <Routes>
                    {publicRoutes.map((route, index) => {
                        const Page = route.component;

                        let Layout = layouts.admin.default;
                        if (route.layout === null) {
                            Layout = Fragment;
                        } else if (route.layout) {
                            Layout = route.layout;
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
                </Routes>
            </div>
        </Router>
    );
};

export default App;
