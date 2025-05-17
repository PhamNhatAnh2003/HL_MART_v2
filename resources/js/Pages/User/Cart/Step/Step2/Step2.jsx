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
import { Table, Radio, Modal } from "antd";
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

    // Load selectedAddress từ localStorage khi component mount
    useEffect(() => {
        const savedAddress = localStorage.getItem("selectedAddress");
        if (savedAddress) {
            try {
                setSelectedAddress(JSON.parse(savedAddress));
            } catch (error) {
                console.error("Lỗi khi parse địa chỉ đã lưu:", error);
            }
        }
    }, []);

    // Lưu selectedAddress vào localStorage mỗi khi thay đổi
    useEffect(() => {
        if (selectedAddress) {
            localStorage.setItem(
                "selectedAddress",
                JSON.stringify(selectedAddress)
            );
        }
    }, [selectedAddress]);

    // Fetch địa chỉ và đồng bộ với selectedAddress
    useEffect(() => {
        const fetchAddresses = async () => {
            try {
                const response = await axios.get(
                    `http://127.0.0.1:8000/api/addresses?user_id=${loginedProfile?.id}`
                );

                if (response.data.status) {
                    const fetchedAddresses = response.data.data;

                    if (fetchedAddresses.length > 0) {
                        setAddresses(fetchedAddresses);

                        const defaultAddress = fetchedAddresses.find(
                            (addr) => addr.is_default === 1
                        );

                        const saved = localStorage.getItem("selectedAddress");
                        const savedAddress = saved ? JSON.parse(saved) : null;

                        if (savedAddress) {
                            const stillExists = fetchedAddresses.find(
                                (addr) =>
                                    addr.address_id === savedAddress.address_id
                            );
                            if (stillExists) {
                                setSelectedAddress(stillExists);
                                return;
                            }
                        }

                        if (defaultAddress) {
                            setSelectedAddress(defaultAddress);
                        }
                    } else {
                        // Không có địa chỉ, có thể không cần hiển thị gì hoặc hiển thị thông báo
                        console.log("Chưa có địa chỉ nào.");
                        // Nếu cần, có thể setSelectedAddress(null) để đảm bảo không có địa chỉ mặc định
                        setSelectedAddress(null);
                    }
                } else {
                    // console.error(
                    //     "Không lấy được địa chỉ:",
                    //     response.data.message
                    // );
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
    const handleAddressChange = (addressId) => {
        const selected = addresses.find(
            (addr) => addr.address_id === addressId
        );
        setSelectedAddress(selected);
    };
    // Hàm đóng modal
    const handleCloseModal = () => {
        setShowAddressModal(false);
    };

const handleConfirmAddress = async () => {
    if (!selectedAddress) return;
console.log("selectedAddress:", selectedAddress);
console.log(
    "address_id:",
    selectedAddress ? selectedAddress.id : "Không có id"
);

   try {
    const response = await axios.post(
        "http://127.0.0.1:8000/api/set-default-address", // Đảm bảo đây là endpoint chính xác
        {
            user_id: selectedAddress.user_id, // Đưa user_id vào body thay vì query string
            address_id: selectedAddress.address_id, // Đưa address_id vào body
        }
    );

        // Ẩn modal
        setShowAddressModal(false);

        // Optional: Thông báo thành công / cập nhật lại danh sách địa chỉ
        showToast("Đã thay đổi địa chỉ giao hàng");
        // refreshAddressList(); // Nếu có hàm load lại danh sách địa chỉ
    } catch (error) {
        console.error("Lỗi khi đặt địa chỉ mặc định:", error);
        showToast("Có lỗi xảy ra khi cập nhật địa chỉ giao hàng.");
    }
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


    const columns = [
        {
            title: "STT",
            dataIndex: "ID",
            render: (_, __, index) => index + 1,
        },
        {
            title: "Hình ảnh",
            dataIndex: "avatar",
            key: "avatar",
            render: (avatar) => (
                <img
                    src={avatar}
                    alt="Hình ảnh"
                    style={{
                        width: 60,
                        height: 60,
                        objectFit: "cover",
                        borderRadius: 8,
                    }}
                />
            ),
        },
        {
            title: "Tên sản phẩm",
            dataIndex: "product_name",
            key: "product_name",
        },
        {
            title: "Số lượng",
            dataIndex: "quantity",
            key: "quantity",
        },
        {
            title: "Giá",
            dataIndex: "price",
            key: "price",
            render: (_, record) => {
                if (record.discount_price) {
                    return (
                        <span>
                            <span
                                style={{ color: "#ff4d4f", fontWeight: "bold" }}
                            >
                                {formatPrice(record.discount_price)}
                            </span>{" "}
                            <span
                                style={{
                                    textDecoration: "line-through",
                                    color: "#999",
                                    marginLeft: 8,
                                }}
                            >
                                {formatPrice(record.price)}
                            </span>
                        </span>
                    );
                }
                return <span>{formatPrice(record.price)}</span>;
            },
        },
    ];

    return (
        <div className={cx("cart-page")}>
            <div className={cx("cart-left")}>
                <CartStep step={2} />
                <div className={cx("cart-content")}>
                    <div className={cx("productListContainer")}>
                        <h2 className={cx("title")}>Danh sách sản phẩm</h2>
                        <Table
                            columns={columns}
                            dataSource={orderItems}
                            rowKey={(record) => record.cart_item_id}
                            pagination={false}
                        />
                    </div>

                    <div className={cx("address-shipping")}>
                        <div className={cx("wrapper")}>
                            <div className={cx("header")}>
                                <h2 className={cx("title")}>
                                    Địa chỉ giao hàng
                                </h2>
                                <button
                                    onClick={() => setShowAddressModal(true)}
                                    className={cx("changeButton")}
                                >
                                    Thay đổi
                                </button>
                            </div>

                            {/* Kiểm tra xem có địa chỉ không */}
                            {addresses.length === 0 ? (
                                <div className={cx("no-address")}>
                                    <p>
                                        Chưa có địa chỉ giao hàng. Bạn có thể
                                        thêm địa chỉ mới.
                                    </p>
                                </div>
                            ) : (
                                selectedAddress && (
                                    <div className={cx("addressInfo")}>
                                        <p className={cx("name")}>
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
                                )
                            )}

                            <Modal
                                title="Chọn địa chỉ giao hàng"
                                open={showAddressModal}
                                onCancel={handleCloseModal}
                                footer={[
                                    <button
                                        style={{ marginRight: "10px" }}
                                        className={cx("dangerButton")}
                                        key="back"
                                        onClick={handleCloseModal}
                                    >
                                        Đóng
                                    </button>,
                                    <button
                                        style={{ marginLeft: "10px" }}
                                        key="submit"
                                        className={cx("dangerButton")}
                                        onClick={handleConfirmAddress}
                                        disabled={!selectedAddress}
                                    >
                                        Xác nhận
                                    </button>,
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
                                                value={address.address_id}
                                                style={{ width: "100%" }}
                                            >
                                                <div
                                                    className={cx(
                                                        "addressOption"
                                                    )}
                                                >
                                                    <div
                                                        className={cx(
                                                            "addressContent"
                                                        )}
                                                    >
                                                        <p className="name">
                                                            {
                                                                address.receiver_name
                                                            }
                                                        </p>
                                                        <p className="phone">
                                                            {address.phone}
                                                        </p>
                                                        <p className="fullAddress">
                                                            {
                                                                address.street_address
                                                            }
                                                            , {address.ward},
                                                            <br />
                                                            {
                                                                address.district
                                                            },{" "}
                                                            {address.province}
                                                        </p>
                                                        <div
                                                            className={cx(
                                                                "addressActions"
                                                            )}
                                                        >
                                                            <button
                                                                onClick={() =>
                                                                    handleEditAddress(
                                                                        address
                                                                    )
                                                                }
                                                                className={cx(
                                                                    "editButton"
                                                                )}
                                                            >
                                                                Sửa
                                                            </button>
                                                            <button
                                                                onClick={() =>
                                                                    handleDeleteAddress(
                                                                        address.address_id
                                                                    )
                                                                }
                                                                className={cx(
                                                                    "deleteButton"
                                                                )}
                                                            >
                                                                Xóa
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Radio>
                                        ))}
                                    </Radio.Group>

                                    <button
                                        className={cx("dangerButton")}
                                        onClick={handleAddNewAddress}
                                    >
                                        Thêm địa chỉ
                                    </button>
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
                                addressId={selectedAddress?.address_id}
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
                            `${config.routes.user.step3}?items=${itemsQuery}&totalPrice=${totalPrice}`
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
