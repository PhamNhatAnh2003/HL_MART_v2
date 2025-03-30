import config from "~/config";
import pages from "~/pages";
import layouts from "~/layouts";

const publicRoutes = [
    {
        path: config.routes.user.home,
        component: pages.user.home,
        layout: layouts.user.default,
    },
    {
        path: config.routes.user.productDetail,
        component: pages.user.productDetail,
        layout: layouts.user.default,
    },


    // {
    //     path: config.routes.other.landing,
    //     component: pages.other.landing,
    //     layout: layouts.other.noHeader,
    // },
    {
        path: config.routes.other.login,
        component: pages.other.login,
        layout: layouts.other.noHeader,
    },
    {
        path: config.routes.other.register,
        component: pages.other.register,
        layout: layouts.other.noHeader,
    },
    // {
    //     path: config.routes.other.test,
    //     component: pages.other.test,
    //     layout: layouts.other.noHeader,
    // },
    // {
    //     path: config.routes.user.userInfor,
    //     component: pages.user.userInfor,
    //     layout: layouts.user.default,
    // },
    {
        path: config.routes.user.categoryProduct,
        component: pages.user.categoryProduct,
        layout: layouts.user.default,
    },
    {
        path: config.routes.user.cart,
        component: pages.user.cart,
        layout: layouts.user.default,
    },
    {
        path: config.routes.user.productList,
        component: pages.user.productList,
        layout: layouts.user.default,
    },
    // {
    //     path: config.routes.admin.restaurantList,
    //     component: pages.admin.restaurantList,
    //     role: "admin",
    // },
    // { path: config.routes.admin.productDetail, component: pages.admin.productDetail, role: 'admin' },
];

const privateRoutes = [
    // { path: config.routes.admin.dashboard, component: pages.admin.dashboard, role: 'admin' },
    // { path: config.routes.admin.productDetail, component: pages.admin.productDetail, role: 'admin' },
    // { path: config.routes.admin.productList, component: pages.admin.productList, role: 'admin' },
    // { path: config.routes.admin.productCreate, component: pages.admin.productCreate, role: 'admin' },
    // { path: config.routes.admin.customers, component: pages.admin.customers, role: 'admin' },
];

export { publicRoutes, privateRoutes };
