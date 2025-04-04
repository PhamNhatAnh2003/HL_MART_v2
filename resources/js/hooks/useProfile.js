import { useState } from 'react';

const useProfile = (initialProfile = {}) => {
    const [profile, setProfile] = useState({
        first_name: '',
        last_name: '',
        phone: '',
        birthday: '',
        gender: '',
        address: '',
        ward: '',
        district: '',
        province: '',
        avatar: '',
        user_id: '',
        ...initialProfile,
    });

    const setProfileField = (field, value) => {
        setProfile((prev) => ({ ...prev, [field]: value }));
    };

    return { profile, setProfile, setProfileField };
};

export default useProfile;
