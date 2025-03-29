import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Fragment } from "react";

import { publicRoutes, privateRoutes } from "../routes";
import layouts from "../layouts";
import ProductList from "../Pages/user/ProductList";
import Category from "../components/Category/Category";
import HeaderUser from "../layouts/user/components/Header/HeaderUser";
import AddProduct from "../components/Popup/AddProduct";



const App = () => {
    return (

        // <ProductList />
        // <AddProduct />
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
