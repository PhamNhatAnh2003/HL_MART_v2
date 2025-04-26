import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Fragment } from "react";

import { publicRoutes, privateRoutes } from "../routes";
import layouts from "../layouts";
import HeaderAdmin from "../layouts/admin/components/Header/HeaderAdmin";
import Filter from "../components/Filter";
import UserInfor from "../Pages/user/UserInfor";
import { AddPopup } from "../components/Popup";

const App = () => {
    return (
        // <CartItem2 />
        // <HeaderAdmin />
        // <UserInfor />
        // <Step2 />
        // <Filter />
        // <AddPopup />
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
