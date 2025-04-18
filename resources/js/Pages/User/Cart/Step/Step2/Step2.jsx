import classNames from "classnames/bind";
import styles from "./Step2.module.scss";
import CartStep from "../../Components/CartStep/CartStep";
import { useCart } from "~/hooks/useCart";
import { formatPrice } from "~/utils/format";
import Button from "~/components/Button";
import { useNavigate, useLocation } from "react-router-dom";
import config from "~/config";
import useProfile from "~/hooks/useProfile";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "~/context/AuthContext";
import axios from "axios";
import CartItem from "../../Components/CartItem/CartItem";
import { Modal,Radio } from "antd";
import AddAddress from "../../Components/AddAddress";
import UpdateAddress from "../../Components/UpdateAddress";
import showToast from "~/components/message";

const cx = classNames.bind(styles);

const Step2 = () => {
    const { user: loginedProfile } = useContext(AuthContext);
    const { profile, setProfile } = useProfile();

    const { cart } = useCart();
    const navigate = useNavigate();
    const location = useLocation();

    const [addresses, setAddresses] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState("COD");
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [orderNote, setOrderNote] = useState("");
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [orderItems, setOrderItems] = useState([]);
    const [showAddAddressModal, setShowAddAddressModal] = useState(false);
    const [showUpdateAddressModal, setShowUpdateAddressModal] = useState(false); // State for Update Address modal
    

    // Lấy danh sách ID sản phẩm được chọn từ query
    const queryParams = new URLSearchParams(location.search);
    const itemIds = queryParams.get("items")?.split(",") || [];
    const totalPrice = queryParams.get("totalPrice") || 0;

    // Lọc giỏ hàng để chỉ lấy sản phẩm được chọn
    const selectedCart =
        cart?.filter((item) => itemIds.includes(item.product.id.toString())) ||
        [];

    // Tính tổng
    const totalProducts = selectedCart.length;
    const totalQuantity = selectedCart.reduce(
        (acc, item) => acc + item.quantity,
        0
    );

    // Sử dụng useEffect để cập nhật profile nếu loginedProfile thay đổi
    useEffect(() => {
        if (loginedProfile && loginedProfile.id !== profile?.id) {
            setProfile(loginedProfile);
        }
    }, [loginedProfile, profile, setProfile]);

    const [cachedItemIds, setCachedItemIds] = useState([]);

    // Chỉ cập nhật cachedItemIds khi itemIds thực sự thay đổi
    useEffect(() => {
        if (JSON.stringify(itemIds) !== JSON.stringify(cachedItemIds)) {
            setCachedItemIds(itemIds);
        }
    }, [itemIds, cachedItemIds]);

    // Fetch selected items từ API
    useEffect(() => {
        const fetchSelectedItems = async () => {
            try {
                const response = await axios.post(
                    "http://127.0.0.1:8000/api/cart/selected-items",
                    {
                        user_id: loginedProfile?.id,
                        selected_items: cachedItemIds,
                    }
                );

                if (response.data.status) {
                    setOrderItems(response.data.data.items);
                    console.log("Selected Items:", response.data.data.items);
                } else {
                    console.error(
                        "Lỗi khi lấy sản phẩm:",
                        response.data.message
                    );
                }
            } catch (error) {
                console.error("Lỗi khi gọi API:", error);
            }
        };

        // Chỉ gọi API khi cachedItemIds có thay đổi
        if (loginedProfile?.id && cachedItemIds.length > 0) {
            fetchSelectedItems();
        }
    }, [loginedProfile, cachedItemIds]);

    useEffect(() => {
        const fetchAddresses = async () => {
            try {
                const response = await axios.get(
                    `http://127.0.0.1:8000/api/addresses?user_id=${loginedProfile?.id}`
                );

                if (response.data.status) {
                    setAddresses(response.data.data);
                    // Nếu chưa chọn địa chỉ nào, gán địa chỉ mặc định
                    const defaultAddress = response.data.data.find(
                        (addr) => addr.is_default === 1
                    );
                    if (!selectedAddress && defaultAddress) {
                        setSelectedAddress(defaultAddress);
                    }
                } else {
                    console.error(
                        "Không lấy được địa chỉ:",
                        response.data.message
                    );
                }
            } catch (error) {
                console.error("Lỗi khi gọi API lấy địa chỉ:", error);
            }
        };

        if (loginedProfile?.id) {
            fetchAddresses();
        }
    }, [loginedProfile]);

    const deleteAddress = async (addressId, userId) => {
        try {
            const response = await axios.delete(
                `/api/delete-address/${addressId}`,
                {
                    params: { user_id: userId },
                }
            );

            if (response.status === 200) {
                // Cập nhật danh sách địa chỉ sau khi xóa thành công
                setAddresses((prevAddresses) =>
                    prevAddresses.filter(
                        (address) => address.address_id !== addressId
                    )
                );
                showToast("Địa chỉ đã được xóa thành công!");
            }
        } catch (error) {
            console.error("Error deleting address:", error);
            alert("Có lỗi khi xóa địa chỉ. Vui lòng thử lại!");
        }
    };

    const handleShowModal = () => {
        setShowAddressModal(true);
    };

    // Hàm xử lý chọn địa chỉ
    const handleAddressChange = (address) => {
        setSelectedAddress(address);
    };

    // Hàm đóng modal
    const handleCloseModal = () => {
        setShowAddressModal(false);
    };

    // Hàm xác nhận địa chỉ
    const handleConfirmAddress = () => {
        // Xử lý khi xác nhận địa chỉ
        setShowAddressModal(false);
    };

    // Edit address
    const handleEditAddress = (address) => {
        setSelectedAddress(address);
        setShowUpdateAddressModal(true); // Open Update Address modal
    };

    // Close Update Address Modal
    const handleCloseUpdateAddressModal = () => {
        setShowUpdateAddressModal(false);
    };

    // Hàm xóa địa chỉ
    const handleDeleteAddress = (addressId) => {
        if (loginedProfile?.id) {
            deleteAddress(addressId, loginedProfile.id);
        } else {
            alert("Bạn cần đăng nhập để xóa địa chỉ.");
        }
    };

    const handleAddNewAddress = () => {
        setShowAddAddressModal(true);
    };
    // Hàm thêm địa chỉ mới vào danh sách
    const handleAddAddress = (newAddress) => {
        setAddresses((prevAddresses) => [...prevAddresses, newAddress]);
    };
    const handleCloseAddAddressModal = () => {
        setShowAddAddressModal(false);
    };
    return (
        <div className={cx("cart-page")}>
            <div className={cx("cart-left")}>
                <CartStep step={2} />
                <div className={cx("cart-content")}>
                    <div className={cx("productListContainer")}>
                        <h2 className={cx("title")}>Sản phẩm</h2>
                        <div className={cx("productList")}>
                            <div className={cx("container")}>
                                <div className={cx("columnSTT")}>STT</div>
                                <div className={cx("columnImage")}>Ảnh</div>
                                <div className={cx("columnName")}>
                                    Tên Sản Phẩm
                                </div>
                                <div className={cx("columnUnit")}>ĐVT</div>
                                <div className={cx("columnPrice")}>Giá</div>
                                <div className={cx("columnQuantity")}>
                                    Số Lượng
                                </div>
                            </div>
                            {orderItems.map((item, index) => (
                                <CartItem
                                    key={`cart-item-${index}`}
                                    item={item}
                                    index={index + 1}
                                />
                            ))}
                        </div>
                    </div>

                    <div className={cx("address-shipping")}>
                        <div className={styles.wrapper}>
                            <div className={styles.header}>
                                <h2 className={styles.title}>
                                    Địa chỉ giao hàng
                                </h2>
                                <button
                                    onClick={() => setShowAddressModal(true)}
                                    className={styles.changeButton}
                                >
                                    Thay đổi
                                </button>
                            </div>
                            {selectedAddress && (
                                <div className={styles.addressInfo}>
                                    <p className={styles.name}>
                                        {selectedAddress.receiver_name}
                                    </p>
                                    <p>{selectedAddress.phone}</p>
                                    <p>
                                        {selectedAddress.street_address},{" "}
                                        {selectedAddress.ward},
                                    </p>
                                    <p>
                                        {selectedAddress.district},{" "}
                                        {selectedAddress.province}
                                    </p>
                                </div>
                            )}
                        </div>

                        <Modal
                            title="Chọn địa chỉ giao hàng"
                            open={showAddressModal}
                            onCancel={handleCloseModal}
                            footer={[
                                <Button
                                    style={{ marginRight: "50px" }}
                                    primary
                                    key="back"
                                    onClick={handleCloseModal}
                                >
                                    Đóng
                                </Button>,
                                <Button
                                    style={{ marginLeft: "20px" }}
                                    key="submit"
                                    primary
                                    onClick={handleConfirmAddress}
                                    disabled={!selectedAddress}
                                >
                                    Xác nhận
                                </Button>,
                            ]}
                        >
                            <div>
                                <Radio.Group
                                    onChange={(e) =>
                                        handleAddressChange(e.target.value)
                                    }
                                    value={selectedAddress?.address_id}
                                    style={{ width: "100%" }}
                                >
                                    {addresses.map((address) => (
                                        <Radio
                                            key={address.address_id}
                                            value={address}
                                            style={{ width: "100%" }}
                                        >
                                            <div
                                                className={styles.addressOption}
                                            >
                                                <div
                                                    className={
                                                        styles.addressContent
                                                    }
                                                >
                                                    <p className="name">
                                                        {address.receiver_name}
                                                    </p>
                                                    <p className="phone">
                                                        {address.phone}
                                                    </p>
                                                    <p className="fullAddress">
                                                        {address.street_address}
                                                        , {address.ward},<br />
                                                        {address.district},{" "}
                                                        {address.province}
                                                    </p>
                                                    <div
                                                        className={
                                                            styles.addressActions
                                                        }
                                                    >
                                                        <Button
                                                            primary
                                                            onClick={() =>
                                                                handleEditAddress(
                                                                    address
                                                                )
                                                            }
                                                            className={
                                                                styles.editButton
                                                            }
                                                        >
                                                            Sửa
                                                        </Button>
                                                        <Button
                                                            primary
                                                            onClick={() =>
                                                                handleDeleteAddress(
                                                                    address.address_id
                                                                )
                                                            }
                                                            className={
                                                                styles.deleteButton
                                                            }
                                                        >
                                                            Xóa
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </Radio>
                                    ))}
                                </Radio.Group>

                                {/* Thêm địa chỉ */}
                                <Button
                                    primary
                                    className={styles.addButton}
                                    onClick={handleAddNewAddress}
                                >
                                    Thêm địa chỉ mới
                                </Button>
                                <AddAddress
                                    visible={showAddAddressModal}
                                    onCancel={handleCloseAddAddressModal}
                                    onAddAddress={handleAddAddress}
                                    userId={loginedProfile?.id}
                                />
                            </div>
                        </Modal>
                        <UpdateAddress
                            visible={showUpdateAddressModal}
                            onCancel={handleCloseUpdateAddressModal}
                            address={selectedAddress}
                            userId={loginedProfile?.id}
                            onUpdateAddress={(updatedAddress) => {
                                setAddresses((prevAddresses) =>
                                    prevAddresses.map((addr) =>
                                        addr.address_id ===
                                        updatedAddress.address_id
                                            ? updatedAddress
                                            : addr
                                    )
                                );
                                setShowUpdateAddressModal(false);
                            }}
                        />
                    </div>
                </div>
            </div>

            <div className={cx("cart-right")}>
                <h2>Tổng tiền giỏ hàng</h2>
                {selectedCart.length > 0 ? (
                    <>
                        <div className={cx("cart-right-line")}>
                            <span>Tổng sản phẩm: </span>
                            <span>{totalProducts}</span>
                        </div>
                        <div className={cx("cart-right-line")}>
                            <span>Tổng số lượng: </span>
                            <span>{totalQuantity}</span>
                        </div>
                        <div className={cx("cart-right-line")}>
                            <span>Tổng tiền: </span>
                            <span style={{ fontWeight: 600 }}>
                                {formatPrice(totalPrice)}
                            </span>
                        </div>
                    </>
                ) : (
                    <p>Không có sản phẩm nào được chọn.</p>
                )}
                <div className={cx("cart-right-last-line")}></div>
                <Button
                    primary
                    width="100%"
                    large
                    onClick={() => {
                        const itemsQuery = cachedItemIds.join(",");
                        navigate(
                            `${config.routes.user.step3}?totalPrice=${totalPrice}`
                        );
                    }}
                    disabled={selectedCart.length === 0}
                >
                    Thanh Toán
                </Button>
            </div>
        </div>
    );
};

export default Step2;
