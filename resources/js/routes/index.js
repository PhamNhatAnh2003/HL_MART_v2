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
        path: config.routes.other.customerSupport,
        component: pages.other.customerSupport,
        layout: layouts.other.noHeader,
    },
    {
        path: config.routes.other.register,
        component: pages.other.register,
        layout: layouts.other.noHeader,
    },
    {
        path: config.routes.user.userInfor,
        component: pages.user.userInfor,
        layout: layouts.user.default,
    },
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
        path: config.routes.user.success,
        component: pages.user.success,
        layout: layouts.user.default,
    },
    {
        path: config.routes.user.orderDetail,
        component: pages.user.orderDetail,
        layout: layouts.user.default,
    },
    {
        path: config.routes.user.productList,
        component: pages.user.productList,
        layout: layouts.user.default,
    },
    {
        path: config.routes.user.billards,
        component: pages.user.billards,
        layout: layouts.user.default,
    },
    {
        path: config.routes.user.step2,
        component: pages.user.step2,
        layout: layouts.user.default,
    },
    {
        path: config.routes.user.step3,
        component: pages.user.step3,
        layout: layouts.user.default,
    },
    {
        path: config.routes.staff.productManage,
        component: pages.staff.productManage,
        layout: layouts.staff.default,
        role: "staff",
    },
    {
        path: config.routes.admin.dashboard,
        component: pages.admin.dashboard,
        role: "admin",
    },
    {
        path: config.routes.admin.productManage,
        component: pages.admin.productManage,
        role: "admin",
    },
    {
        path: config.routes.admin.userManage,
        component: pages.admin.userManage,
        role: "admin",
    },
    {
        path: config.routes.admin.orderManage,
        component: pages.admin.orderManage,
        role: "admin",
    },
    {
        path: config.routes.admin.billiardManage,
        component: pages.admin.billiardManage,
        role: "admin",
    },
];

const privateRoutes = [
    // { path: config.routes.admin.dashboard, component: pages.admin.dashboard, role: 'admin' },
    // { path: config.routes.admin.productDetail, component: pages.admin.productDetail, role: 'admin' },
    // { path: config.routes.admin.productList, component: pages.admin.productList, role: 'admin' },
    // { path: config.routes.admin.productCreate, component: pages.admin.productCreate, role: 'admin' },
    // { path: config.routes.admin.customers, component: pages.admin.customers, role: 'admin' },
];

export { publicRoutes, privateRoutes };
