import UserLayout from './user/Default/UserLayout';
import AdminLayout from './admin/Default/AdminLayout';
import NoHeaderLayout from './other/NoHeader/NoHeaderLayout';
import StaffLayout from './staff/Default/StaffLayout';

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
    staff: {
        default: StaffLayout,
    },
};

export default layouts;
