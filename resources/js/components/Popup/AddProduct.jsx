import { useState,useEffect } from "react";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes, faPen } from "@fortawesome/free-solid-svg-icons";
import ImageUploading from "react-images-uploading";
import axios from "axios";

import { DefaultInput } from "../Input";
import Button from "../Button";
import Dropdown from "../Dropdown";

import styles from "./AddProduct.module.scss";
import classNames from "classnames/bind";
const cx = classNames.bind(styles);

const AddProduct = ({ onClose, onReFetch }) => {
    const [name, setName] = useState("");
    const [desc, setDesc] = useState("");
    const [priceStart, setPriceStart] = useState("");
    const [priceEnd, setPriceEnd] = useState("");
    const [avatar, setAvatar] = useState();
    const [images, setImages] = useState([]);
    const [imagesFile, setImagesFile] = useState([]);
    const [media, setMedia] = useState([]);
    const [Number, setNumber] = useState("");
    const [Numbers, setNumbers] = useState("");
    const maxNumber = 5;
    const [categories, setCategories] = useState([]); // 🔹 Định nghĩa state cho categories
    const [selectedCategory, setSelectedCategory] = useState(null);

    //   useEffect(() => {
    //       axios
    //           .get("http://localhost:8000/api/categories") // 🔹 Gọi API để lấy danh mục từ backend
    //           .then((response) => {
    //               setCategories(response.data); // 🔹 Cập nhật state categories
    //           })
    //           .catch((error) => {
    //               console.error("Lỗi khi lấy danh mục:", error);
    //           });
    //   }, []);





    const inputRef = React.useRef();

    const [source, setSource] = React.useState();

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        const url = URL.createObjectURL(file);
        setMedia([file]);
        setSource(url);
    };

    const handleChoose = (event) => {
        inputRef.current.click();
    };

    const onAvatarChange = (image) => {
        // console.log(image);
        setAvatar(image);
    };

    const onChange = (imageList, addUpdateIndex) => {
        // console.log(imageList, addUpdateIndex);
        setImages(imageList);
        setImagesFile(imageList.map((image) => image.file));
    };

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        imagesFile.unshift(...media);
        // console.log({ name, description: desc, address, phone, email, price_start: priceStart, price_end: priceEnd, avatar : avatar?.file, media: imagesFile.length > 0 ? imagesFile : media, open_time: `${openTime}:00`, close_time: `${closeTime}:00` });
        try {
            const data = await axios
                .post(
                    "/api/restaurant/create-v",
                    {
                        name,
                        description: desc,
                        address,
                        phone,
                        email,
                        price_start: priceStart,
                        price_end: priceEnd,
                        avatar: avatar?.file,
                        media: imagesFile.length > 0 ? imagesFile : media,
                        open_time: `${openTime}:00`,
                        close_time: `${closeTime}:00`,
                    },
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }
                )
                .then((response) => {
                    // console.log(response);
                    addStyleToRestaurant(response.data.restaurant.id);
                });
        } catch (error) {
            console.error("Error adding restaurant:", error);
            alert("Error adding restaurant" + error?.response?.data?.message);
        }
    };

    const addStyleToRestaurant = async (id) => {
        await axios
            .post(
                "/api/restaurant/style/create",
                {
                    restaurant_id: id,
                    style_id: styles,
                },
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            )
            .then((response) => {
                alert("レストランの追加に成功しました");
                onClose();
                onReFetch();
            })
            .catch((error) => {
                alert(
                    "Error adding style to restaurant " +
                        error?.response?.data?.message
                );
            });
    };

    return (
        <div className={cx("layout")}>
            <div className={cx("popup")}>
                <div className={cx("container")}>
                    <div className={cx("header", "flex-row")}>
                        <h1>
                            <span>THÊM MẶT HÀNG</span>
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
                    <form
                        className={cx("content", "flex-row")}
                        onSubmit={(e) => e.preventDefault()}
                    >
                        <div className={cx("left")}>
                            <div className={cx("content-item", "flex-col")}>
                                <h3 className={cx("title")}>Thông tin chung</h3>
                                <div
                                    className={cx("flex-col")}
                                    style={{ gap: 6 }}
                                >
                                    <DefaultInput
                                        value={name}
                                        setValue={setName}
                                        id=""
                                        label="Tên sản phẩm "
                                    ></DefaultInput>
                                    <DefaultInput
                                        setValue={setDesc}
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
                                    setValue={setAddress}
                                    value={address}
                                    id=""
                                    label="住所"
                                ></DefaultInput>
                                <div
                                    className={cx("flex-row")}
                                    style={{ marginTop: 6 }}
                                >
                                    <DefaultInput
                                        setValue={setPhone}
                                        value={phone}
                                        type="tel"
                                        id=""
                                        label="電話番号"
                                    ></DefaultInput>
                                    <DefaultInput
                                        setValue={setEmail}
                                        value={email}
                                        type="email"
                                        id=""
                                        label="メール"
                                        width={"60%"}
                                    ></DefaultInput>
                                </div>
                            </div> */}

                            <div className={cx("content-item", "flex-col")}>
                                <h3 className={cx("title")}>Giá bán</h3>
                                <div className={cx("flex-row")}>
                                    <DefaultInput
                                        setValue={setPriceStart}
                                        value={priceStart}
                                        id=""
                                        label="Giá bán (đ)"
                                    ></DefaultInput>
                                    <DefaultInput
                                        setValue={setPriceEnd}
                                        value={priceEnd}
                                        id=""
                                        label="Giắ khuyến mãi (đ)"
                                        width={"60%"}
                                    ></DefaultInput>
                                </div>
                            </div>
                            <div className={cx("content-item")}>
                                <h3 className={cx("title")}>Số lượng</h3>
                                <div className={cx("flex-row")}>
                                    <DefaultInput
                                        setValue={setNumber}
                                        // type="time"
                                        value={Number}
                                        id=""
                                        label="HÀNG TRONG KHO"
                                        width={"45%"}
                                    ></DefaultInput>
                                    <DefaultInput
                                        setValue={setNumbers}
                                        // type="time"
                                        value={Numbers}
                                        id=""
                                        label="ĐÃ BÁN"
                                        width={"45%"}
                                    ></DefaultInput>
                                </div>
                            </div>
                        </div>
                        <div className={cx("right")}>
                            <div className={cx("content-item")}>
                                <h3 className={cx("title")}>Sản Phẩm</h3>
                                <div className={cx("flex-row")}>
                                    <div>
                                        <label className={cx("label")}>
                                            AVATAR
                                        </label>
                                        <ImageUploading
                                            value={avatar ? [avatar] : []}
                                            onChange={(imageList) =>
                                                onAvatarChange(imageList[0])
                                            }
                                        >
                                            {({
                                                onImageUpload,
                                                onImageUpdate,
                                            }) => (
                                                <div
                                                    className={cx(
                                                        "upload__avatar-wrapper"
                                                    )}
                                                >
                                                    {avatar ? (
                                                        <img
                                                            src={avatar.dataURL}
                                                            width="120"
                                                            height="120"
                                                            onClick={
                                                                onImageUpdate
                                                            }
                                                        />
                                                    ) : (
                                                        <button
                                                            onClick={
                                                                onImageUpload
                                                            }
                                                        >
                                                            <FontAwesomeIcon
                                                                icon={faPlus}
                                                            ></FontAwesomeIcon>
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </ImageUploading>
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
                                            <input
                                                ref={inputRef}
                                                className={cx(
                                                    "VideoInput_input"
                                                )}
                                                type="file"
                                                onChange={handleFileChange}
                                                accept=".mp4"
                                            />
                                            {!source && (
                                                <button onClick={handleChoose}>
                                                    <FontAwesomeIcon
                                                        icon={faPlus}
                                                    ></FontAwesomeIcon>
                                                </button>
                                            )}
                                            {source && (
                                                <>
                                                    <video
                                                        className={cx(
                                                            "VideoInput_video"
                                                        )}
                                                        width={200}
                                                        height={118}
                                                        controls
                                                        src={source}
                                                    />
                                                    <button
                                                        onClick={() =>
                                                            setSource()
                                                        }
                                                        className={cx(
                                                            "VideoInput_btn"
                                                        )}
                                                    >
                                                        <FontAwesomeIcon
                                                            icon={faTimes}
                                                        ></FontAwesomeIcon>
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className={cx("label")}>
                                        HÌNH ẢNH MÔ TẢ SẢN PHẨM
                                    </label>
                                    <ImageUploading
                                        multiple
                                        value={images}
                                        onChange={onChange}
                                        maxNumber={maxNumber}
                                        dataURLKey="data_url"
                                    >
                                        {({
                                            imageList,
                                            onImageUpload,
                                            onImageUpdate,
                                            onImageRemove,
                                        }) => (
                                            <div
                                                className={cx(
                                                    "upload__image-wrapper"
                                                )}
                                            >
                                                <button
                                                    onClick={onImageUpload}
                                                    className={cx("add-btn")}
                                                >
                                                    <FontAwesomeIcon
                                                        icon={faPlus}
                                                    ></FontAwesomeIcon>
                                                </button>
                                                <div
                                                    className={cx("image-list")}
                                                >
                                                    {imageList.map(
                                                        (image, index) => (
                                                            <div
                                                                key={index}
                                                                className={cx(
                                                                    "image-item"
                                                                )}
                                                            >
                                                                <img
                                                                    src={
                                                                        image[
                                                                            "data_url"
                                                                        ]
                                                                    }
                                                                    alt=""
                                                                    width="150"
                                                                    height="90"
                                                                    onClick={() =>
                                                                        onImageUpdate(
                                                                            index
                                                                        )
                                                                    }
                                                                />
                                                                <div
                                                                    className={cx(
                                                                        "image-item__btn-wrapper"
                                                                    )}
                                                                >
                                                                    <button
                                                                        onClick={() =>
                                                                            onImageRemove(
                                                                                index
                                                                            )
                                                                        }
                                                                    >
                                                                        <FontAwesomeIcon
                                                                            icon={
                                                                                faTimes
                                                                            }
                                                                        ></FontAwesomeIcon>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </ImageUploading>
                                </div>
                            </div>
                        </div>
                    </form>
                    <div className={cx("flex-row")}>
                        <div className={cx("flex-1")}></div>
                        <Button
                            onClick={(e) => onSubmitHandler(e)}
                            small
                            curved
                            type="danger"
                            width={"100px"}
                        >
                            TẢI LÊN
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddProduct;
