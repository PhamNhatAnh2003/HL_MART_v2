const routes = {
    admin: {
        dashboard: "/admin/dashboard",
        // productDetail: "/admin/product/:id",
        productManage: "/admin/managers",
        userManage: "/admin/userManage",
        orderManage: "/admin/orderManage",
        voucherManage: "/admin/manage-vouchers",
        predictProduct: "/admin/predictProducts" ,
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
        success: "/order-success",
        orderDetail: "/order-detail",
        billards: "/order-billards",
    },

    other: {
        login: "/login",
        register: "/register",
        landing: "/",
        forbidden: "/forbidden",
        test: "/test",
        customerSupport: "/customerSupport",
    },

    staff: {
        productManage: "/staff/productManage",
        categoryManage: "/staff/categoryManage",
        orderManage: "/staff/orderManage",
    },
};


export default routes;
