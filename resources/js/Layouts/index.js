import UserLayout from './user/Default/UserLayout';
import AdminLayout from './admin/Default/AdminLayout';
import NoHeaderLayout from './other/NoHeader/NoHeaderLayout';

const layouts = {
    admin: {
        default: AdminLayout,
    },

    user: {
        default: UserLayout,
    },

    other: {
        noHeader: NoHeaderLayout,
    },
};

export default layouts;
