const routes = {
    admin: {
        dashboard: "/admin/dashboard",
        // productDetail: "/admin/product/:id",
        productManage: "/admin/managers",
        userManage: "/admin/userManage",
        orderManage: "/admin/orderManage",
    },

    user: {
        home: "/home",
        productList: "/productList",
        productDetail: "/product/:productId",
        userInfor: "/userInfor",
        categoryProduct: "/category/:categoryId",
        cart: "/cart",
        step2: "/cart/step2",
        step3: "/cart/step3",
        // map: '/map',
    },

    other: {
        login: "/login",
        register: "/register",
        landing: "/",
        forbidden: "/forbidden",
        test: "/test",
    },
};


export default routes;
