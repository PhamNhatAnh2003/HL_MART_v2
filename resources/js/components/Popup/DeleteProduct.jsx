import { useState,useEffect } from "react";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes, faPen } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

import { DefaultInput } from "../Input";
import Button from "../Button";
import Dropdown from "../Dropdown";

import styles from "./AddProduct.module.scss";
import classNames from "classnames/bind";
const cx = classNames.bind(styles);

const DeleteProduct = ({ id, onClose, onReFetch }) => {
    const [restaurant, setRestaurant] = useState({});
    const [name, setName] = useState("");
    const [desc, setDesc] = useState("");
    const [priceStart, setPriceStart] = useState("");
    const [priceEnd, setPriceEnd] = useState("");
    const [avatar, setAvatar] = useState(null);
    const [files, setFiles] = useState([]);
    const [medias, setMedias] = useState("");
    const [images, setImages] = useState([]);
    const [openTime, setOpenTime] = useState("");
    const [closeTime, setCloseTime] = useState("");
    const [categories, setCategories] = useState([]); // 🔹 Định nghĩa state cho categories
    const [selectedCategory, setSelectedCategory] = useState(null);

    // const fetchRestaurantStyles = async (id) => {
    //     console.log("fetchRestaurantStyles", id);
    //     try {
    //         const response = await axios.get(
    //             `/api/restaurant/styles?restaurant_id=${id}`
    //         );
    //         if (response.status === 200) {
    //             console.log("fetchRestaurantStyles", response);
    //             setStyles(response.data.data[0].style_id);
    //         }
    //     } catch (error) {
    //         console.error("Error fetching restaurant styles:", error);
    //     }
    // };

    // useEffect(() => {
    //     const fetchRestaurant = async () => {
    //         try {
    //             const response = await axios.get(`/api/restaurant?id=${id}`);
    //             if (response.status === 200) {
    //                 setRestaurant(response.data.restaurant);
    //                 setName(response.data.restaurant.name);
    //                 setDesc(response.data.restaurant.description);
    //                 setAddress(response.data.restaurant.address);
    //                 setPhone(response.data.restaurant.phone);
    //                 setPriceStart(response.data.restaurant.price_start);
    //                 setPriceEnd(response.data.restaurant.price_end);
    //                 setMail(response.data.restaurant.email);
    //                 setAvatar(response.data.restaurant.avatar);
    //                 setFiles(
    //                     response.data.restaurant.media
    //                         ? response.data.restaurant.media
    //                         : []
    //                 );
    //                 setOpenTime(response.data.restaurant.open_time);
    //                 setCloseTime(response.data.restaurant.close_time);
    //                 fetchRestaurantStyles(response.data.restaurant.id);
    //             }
    //         } catch (error) {
    //             console.error("Error fetching restaurant:", error);
    //         }
    //     };

    //     fetchRestaurant();
    // }, []);

    // useEffect(() => {
    //     const newImages = [];
    //     let newMedias = "";
    //     files.forEach((file) => {
    //         if (file && !file.includes(".mp4")) newImages.push(file);
    //         else newMedias = file;
    //     });
    //     setImages(newImages);
    //     setMedias(newMedias);
    // }, [files]);

    const onSubmitHandler = async () => {
        try {
            const response = await axios.delete(`/api/restaurant/delete/${id}`);
            if (response.status === 200) {
                // console.log(response);
                alert(response.data.message);
                onClose();
                onReFetch();
            }
        } catch (error) {
            console.error("Error deleting restaurant:", error);
            alert("Error deleting restaurant" + error?.response?.data?.message);
        }
    };

    return (
        <div className={cx("layout")}>
            <div className={cx("popup")}>
                <div className={cx("container")}>
                    <div className={cx("header", "flex-row")}>
                        <h1>
                            <span>XÁC NHẬN XÓA SẢN PHẨM</span>
                        </h1>
                        <button
                            className={cx("close-btn")}
                            onClick={() => {
                                onClose();
                            }}
                        >
                            <FontAwesomeIcon icon={faTimes}></FontAwesomeIcon>
                        </button>
                    </div>
                    <form className={cx("content", "flex-row")}>
                        <div className={cx("left")}>
                            <div className={cx("content-item", "flex-col")}>
                                <h3 className={cx("title")}>Thông tin chung</h3>
                                <div
                                    className={cx("flex-col")}
                                    style={{ gap: 6 }}
                                >
                                    <DefaultInput
                                        readOnly
                                        value={name}
                                        id=""
                                        label="Tên sản phẩm"
                                    ></DefaultInput>
                                    <DefaultInput
                                        readOnly
                                        value={desc}
                                        id=""
                                        label="Mô tả sản phẩm"
                                    ></DefaultInput>
                                    <Dropdown
                                        id="category"
                                        label="Danh mục"
                                        title="Chọn danh mục"
                                        selected={
                                            categories.find(
                                                (option) =>
                                                    option.id ===
                                                    selectedCategory
                                            )?.name || "Chưa chọn"
                                        }
                                        setValue={(value) => {
                                            const selectedOption =
                                                categories.find(
                                                    (option) =>
                                                        option.name === value
                                                );
                                            if (selectedOption) {
                                                setSelectedCategory(
                                                    selectedOption.id
                                                );
                                            }
                                        }}
                                        width="100%"
                                    >
                                        {categories.map((option) => (
                                            <div key={option.id}>
                                                {option.name}
                                            </div>
                                        ))}
                                    </Dropdown>
                                </div>
                            </div>

                            {/* <div className={cx("content-item", "flex-col")}>
                                <h3 className={cx("title")}>連絡先</h3>
                                <DefaultInput
                                    readOnly
                                    value={address}
                                    id=""
                                    label="住所"
                                ></DefaultInput>
                                <div
                                    className={cx("flex-row")}
                                    style={{ marginTop: 6 }}
                                >
                                    <DefaultInput
                                        readOnly
                                        value={phone}
                                        type="tel"
                                        id=""
                                        label="電話番号"
                                    ></DefaultInput>
                                    <DefaultInput
                                        readOnly
                                        value={mail}
                                        type="mail"
                                        id=""
                                        label="メール"
                                        width={"60%"}
                                    ></DefaultInput>
                                </div>
                            </div> */}

                            <div className={cx("content-item", "flex-col")}>
                                <h3 className={cx("title")}>Giá cả</h3>
                                <div className={cx("flex-row")}>
                                    <DefaultInput
                                        readOnly
                                        value={priceStart}
                                        id=""
                                        label="Giá bán (đ)"
                                    ></DefaultInput>
                                    <DefaultInput
                                        readOnly
                                        value={priceEnd}
                                        id=""
                                        label="Giá khuyến mãi (đ)"
                                        width={"60%"}
                                    ></DefaultInput>
                                </div>
                            </div>
                            <div className={cx("content-item")}>
                                <h3 className={cx("title")}>Số lượng</h3>
                                <div className={cx("flex-row")}>
                                    <DefaultInput
                                        readOnly
                                        value={openTime}
                                        id=""
                                        label="Hàng trong kho"
                                        width={"45%"}
                                    ></DefaultInput>
                                    <DefaultInput
                                        readOnly
                                        value={closeTime}
                                        id=""
                                        label="Đã bán"
                                        width={"45%"}
                                    ></DefaultInput>
                                </div>
                            </div>
                        </div>
                        <div className={cx("right")}>
                            <div className={cx("content-item")}>
                                <h3 className={cx("title")}>Sản phẩm</h3>
                                <div className={cx("flex-row")}>
                                    <div>
                                        <label className={cx("label")}>
                                            AVATAR
                                        </label>
                                        <div
                                            className={cx(
                                                "upload__avatar-wrapper"
                                            )}
                                        >
                                            <img
                                                src={avatar}
                                                width="120"
                                                height="120"
                                            />
                                        </div>
                                    </div>
                                    <div className={cx("VideoInput")}>
                                        <label className={cx("label")}>
                                            VIDEO
                                        </label>
                                        <div
                                            className={cx(
                                                "VideoInput_container"
                                            )}
                                        >
                                            {medias && (
                                                <video
                                                    className={cx(
                                                        "VideoInput_video"
                                                    )}
                                                    width={200}
                                                    height={118}
                                                    controls
                                                    src={medias}
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <label className={cx("label")}>
                                    HÌNH ẢNH MÔ TẢ SẢN PHẨM
                                </label>
                                <div className={cx("upload__image-wrapper")}>
                                    <div className={cx("image-list")}>
                                        {images.length > 0 &&
                                            images.map((image, index) => (
                                                <div
                                                    key={index}
                                                    className={cx("image-item")}
                                                >
                                                    <img
                                                        src={image}
                                                        alt=""
                                                        width="150"
                                                        height="90"
                                                    />
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                    <div className={cx("flex-row")}>
                        <div className={cx("flex-1")}></div>
                        <Button
                            onClick={() => {
                                onClose();
                            }}
                            curved
                            secondary
                            width={"120px"}
                        >
                            HỦY
                        </Button>
                        <Button
                            onClick={(e) => onSubmitHandler()}
                            curved
                            type="danger"
                            width={"100px"}
                        >
                            XÓA
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteProduct;
