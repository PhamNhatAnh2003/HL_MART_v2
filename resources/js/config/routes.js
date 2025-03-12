const routes = {
    admin: {
        dashboard: '/admin',
        productDetail: '/admin/product/:id',
        productList: '/admin/products',
        productCreate: '/admin/product/create',
        customers: '/admin/customers',
    },

    user: {
        home: '/',
        productList: '/products',
        productDetail: '/product/:productId/:variantId',
        cart: '/cart',
        cartStep2: '/cart/step/2',
        cartStep3: '/cart/step/3',
        cartStep4: '/cart/step/4',
    },

    other: {
        login: '/login',
        register: '/register',
        forbidden: '/forbidden',
    },
};

export default routes;
