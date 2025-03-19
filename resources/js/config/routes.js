const routes = {
    admin: {
        dashboard: "/admin",
        productDetail: "/admin/product/:id",
        productList: "/admin/products",
        productCreate: "/admin/product/create",
        customers: "/admin/customers",
    },

    user: {
        home: "/home",
        productList: "/products",
        productDetail: "/product/:productId",
        cart: "/cart",
        userInfor: "/userInfor",
        findProduct: "/findProduct",
        favorite: "/favorite",
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
