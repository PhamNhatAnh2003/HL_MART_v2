import React, { useContext, useState, useEffect } from "react";
import classNames from "classnames/bind";
import styles from "./UserInfor.module.scss";
import { Input } from "~/components/Input";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import Button from "~/components/Button";
import images from "~/assets/images";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DefaultInput } from "~/components/Input";
import Dropdown from "~/components/Dropdown";
import { AuthContext } from "~/context/AuthContext";
import { useNavigate } from "react-router-dom";
import config from "~/config";
import Card from "~/components/Card";

const cx = classNames.bind(styles);

export default function UserInfor() {
    const {
        user,
        userId,
        currentUser,
        setCurrentUser,
        updateUser,
        setHeadPhone,
    } = useContext(AuthContext);
    const navigate = useNavigate();
    const [favoriteProducts, setFavoriteProduct] = useState([]);

    useEffect(() => {
        if (currentUser.phone) {
            const phone = currentUser.phone;
            if (phone.startsWith("+")) {
                setHeadPhone(phone.slice(0, 3));
                setCurrentUser((prev) => ({
                    ...prev,
                    phone: phone.slice(3),
                }));
            } else {
                setHeadPhone("+84");
            }
        }
    }, [currentUser.phone]);

    useEffect(() => {
        const fetchFavorite = async () => {
            try {
                const response = await axios.get(
                    `/api/favorites_home?user_id=${userId}`
                );
                console.log(response);
                if (response.status === 200) {
                    setFavoriteProduct(response.data.products.data);
                }
            } catch (error) {
                console.log(error);
            }
        };

        fetchFavorite();
    }, [user]);

    return (
        <>
            {currentUser && (
                <div className={cx("container")}>
                    <div className={cx("header-title")}>
                        <div className={cx("header-avatar")}>
                            <img
                                className={cx("avatar")}
                                src={
                                    currentUser.avatar instanceof File
                                        ? URL.createObjectURL(
                                              currentUser.avatar
                                          )
                                        : currentUser.avatar ??
                                          images.avatarUser
                                }
                                alt="avatarUser"
                            />
                            <label
                                htmlFor="avatar-input"
                                className={cx("camera-icon")}
                            >
                                <FontAwesomeIcon icon={faCamera} />
                                <input
                                    name="avatar-input"
                                    id="avatar-input"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            setCurrentUser((prev) => ({
                                                ...prev,
                                                avatar: file,
                                            }));
                                        }
                                    }}
                                    type="file"
                                    hidden
                                />
                            </label>
                        </div>
                        <div className={cx("title")}>
                            <p className={cx("title1")}>
                                Xin chào {currentUser.name}
                            </p>
                            <p
                                className={cx("title2")}
                                onClick={() =>
                                    navigate(config.routes.user.orderDetail)
                                }
                            >
                                Xem chi tiết các đơn hàng
                            </p>
                        </div>
                    </div>
                    <div className={cx("container-input")}>
                        <div className={cx("header-profile-tile")}>
                            <h2>Chỉnh sửa hồ sơ</h2>
                            {/* <h3>Cập nhật lần cuối ngày 1 tháng 8</h3> */}
                        </div>
                        <div className={cx("list-input")}>
                            <div className={cx("input-column")}>
                                <DefaultInput
                                    value={currentUser.name || ""} // Chuỗi rỗng nếu không có giá trị
                                    setValue={(value) =>
                                        setCurrentUser({
                                            ...currentUser,
                                            name: value,
                                        })
                                    }
                                    placeholder="Tên"
                                    label="Tên"
                                    inputClassName={cx("input")}
                                />
                                {/* <DefaultInput
                                    value={currentUser.birth || ""}
                                    setValue={(value) =>
                                        setCurrentUser({
                                            ...currentUser,
                                            birth: value,
                                        })
                                    }
                                    type="date"
                                    placeholder="Chọn ngày sinh"
                                    label="📅 Ngày sinh"
                                    inputClassName={cx("input")}
                                /> */}
                                <DefaultInput
                                    value={currentUser.address || ""} // Chuỗi rỗng nếu không có giá trị
                                    setValue={(value) =>
                                        setCurrentUser({
                                            ...currentUser,
                                            address: value,
                                        })
                                    }
                                    placeholder="Địa chỉ"
                                    label="Địa chỉ"
                                    inputClassName={cx("input")}
                                />
                            </div>
                            <div className={cx("input-column")}>
                                <DefaultInput
                                    value={currentUser.email || ""} // Chuỗi rỗng nếu không có giá trị
                                    setValue={(value) =>
                                        setCurrentUser({
                                            ...currentUser,
                                            email: value,
                                        })
                                    }
                                    placeholder="Email"
                                    label="Email"
                                    inputClassName={cx("input")}
                                />
                                <div className={cx("phone-input")}>
                                    <DefaultInput
                                        value={currentUser.phone || ""} // Đảm bảo luôn có giá trị chuỗi
                                        setValue={(value) =>
                                            setCurrentUser({
                                                ...currentUser,
                                                phone: value,
                                            })
                                        }
                                        placeholder="09120000000"
                                        width="100%"
                                        label="Số điện thoại"
                                        inputClassName={cx("input")}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className={cx("button-submit")}>
                            <Button
                                large
                                primary
                                shadow
                                width="140px"
                                onClick={() => updateUser(currentUser)}
                            >
                                Lưu
                            </Button>
                            <Button large primary shadow width="140px">
                                Hủy
                            </Button>
                        </div>
                    </div>

                    <div className={cx("favorite")}>
                        <section className={cx("newStyleSection")}>
                            <h2 className={cx("sectionHeading")}>
                                SẢN PHẨM YÊU THÍCH
                            </h2>
                            <div className={cx("productList")}>
                                {favoriteProducts.map((product, index) => (
                                    <Card key={index} product={product} />
                                ))}
                            </div>
                        </section>
                    </div>
                </div>
            )}
        </>
    );
}
