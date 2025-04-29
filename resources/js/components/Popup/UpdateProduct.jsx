import { useState, useEffect, useRef } from "react";
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

const UpdateProduct = ({ productId, onClose, onReFetch }) => {
    const inputRef = useRef();
    const [name, setName] = useState("");
    const [desc, setDesc] = useState("");
    const [price, setPrice] = useState("");
    const [Discount_price, setDiscount_price] = useState("");
    const [avatar, setAvatar] = useState(null);
    const [images, setImages] = useState([]);
    const [unit, setUnit] = useState("");
    const [imagesFile, setImagesFile] = useState([]);
    const [media, setMedia] = useState([]);
    const [Number, setNumber] = useState("");
    const [Numbers, setNumbers] = useState("");
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [product, setProduct] = useState(null);
    const maxNumber = 5;
    const [avatarFile, setAvatarFile] = useState(null);
    const [files, setfiles] = useState([]);
    const [source, setSource] = useState();

    // Handle file change (for media and images)
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        const url = URL.createObjectURL(file);
        setMedia([file]);
        setSource(url);
        console.log(media);
    };

    const handleChoose = (event) => {
        inputRef.current.click();
    };

    // Fetch product details when component is mounted
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(
                    `http://127.0.0.1:8000/api/product_v/${productId}`
                );
                console.log(response.data.product);
                if (response.status === 200) {
                    const product = response.data.product; // Lấy dữ liệu product từ API
                    setProduct(product); // Save product details into state
                    setName(product.name);
                    setPrice(product.price);
                    setDesc(product.description);
                    setDiscount_price(product.discount_price);
                    setUnit(product.unit);
                    setNumber(product.stock);
                    setNumbers(product.sold);
                    setAvatar(product.avatar);
                    setfiles(product.media || []); // Nếu media là null hoặc không có, gán mảng rỗng
                    setSelectedCategory(product.category_id);
                }
            } catch (error) {
                console.error("Error fetching product:", error);
            }
        };

        fetchProduct();
    }, [productId]);

    // Fetch categories for product
    useEffect(() => {
        axios
            .get("http://localhost:8000/api/categories")
            .then((response) => {
                setCategories(response.data);
            })
            .catch((error) => {
                console.error("Error fetching categories:", error);
            });
    }, []);

    // Update images and media state when files change
    useEffect(() => {
        const newImages = [];
        let newMedia = "";
        if (Array.isArray(files) && files.length > 0) {
            files.forEach((file) => {
                if (file && !file.includes(".mp4")) newImages.push(file);
                else newMedia = file;
            });
        }
        setImages(newImages);
        setImagesFile(newImages);
        setSource(newMedia);
        setMedia([newMedia]);
    }, [files]);

    const onAvatarChange = (image) => {
        setAvatar(image.dataURL);
        setAvatarFile(image.file);
    };

    const onChange = (imageList, addUpdateIndex) => {
        setImages(imageList);
        setImagesFile(imageList.map((image) => image?.file || image));
    };

    // Submit handler when form is submitted
    const onSubmitHandler = async (e) => {
        e.preventDefault();
        if (media[0]) imagesFile.unshift(media[0]);
        console.log({
            name,
            desc,
            price,
            Discount_price,
            unit,
            Number,
            Numbers,
            avatar,
            images,
            media,
            selectedCategory,
        });

        if (!name || !price || !desc) {
            alert("Vui lòng điền đầy đủ các trường thông tin!");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("description", desc);
            formData.append("price", price);
            formData.append("discount_price", Discount_price || 0);
            formData.append("unit", unit);
            formData.append("sold", Numbers || 0);
            formData.append("stock", Number || 0);

            // Gửi avatar
            if (avatarFile) {
                formData.append("avatar", avatarFile);
            }

            // Merge media (video + ảnh) đúng chuẩn
            let mergedFiles = [...imagesFile];
            if (media[0] && !imagesFile.includes(media[0])) {
                mergedFiles.unshift(media[0]);
            }

            if (mergedFiles.length > 0) {
                mergedFiles.forEach((file, index) => {
                    formData.append(`media[${index}]`, file);
                });
            }
            console.log(...formData);
            const response = await axios.post(
                `/api/product/update/${productId}`,
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );

            if (response.data.success) {
                addCategoryToProduct(response.data.product.id);
            } else {
                alert("Cập nhật sản phẩm thành công!");
            }
        } catch (error) {
            console.error("Error updating product:", error.response);
            alert(
                "Lỗi khi cập nhật sản phẩm: " +
                    (error?.response?.data?.message || "Lỗi không xác định")
            );
        }
    };

    // Add category to the product
    const addCategoryToProduct = async (productId) => {
        if (!selectedCategory) {
            alert("Please select a category!");
            return;
        }

        try {
            const response = await axios.post(
                "/api/product/category/create",
                {
                    product_id: productId,
                    category_id: selectedCategory,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            alert("Product updated successfully!");
            onClose(); // Close modal or popup
            onReFetch(); // Re-fetch or refresh data
        } catch (error) {
            console.error("Error adding category to product:", error);
            alert(
                "Error adding category: " +
                    (error?.response?.data?.message || "Unknown error")
            );
        }
    };

    if (!product) {
        return <div>Loading product...</div>;
    }
    return (
        <div className={cx("layout")}>
            <div className={cx("popup")}>
                <div className={cx("container")}>
                    <div className={cx("header", "flex-row")}>
                        <h1>
                            <span>THÊM MẶT HÀNG</span>
                        </h1>
                        <Button
                            primary
                            className={cx("close-btn")}
                            onClick={() => {
                                onClose();
                            }}
                        >
                            <FontAwesomeIcon icon={faTimes}></FontAwesomeIcon>
                        </Button>
                    </div>
                    <div
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
                                        label="Tên sản phẩm"
                                    ></DefaultInput>
                                    <DefaultInput
                                        setValue={setDesc}
                                        value={desc}
                                        id=""
                                        label="Mô tả sản phẩm"
                                    ></DefaultInput>
                                    <DefaultInput
                                        setValue={setUnit}
                                        value={unit}
                                        id=""
                                        label="Đơn vị tính"
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
                                                ); // Lưu ID danh mục đã chọn
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

                            <div className={cx("content-item", "flex-col")}>
                                <h3 className={cx("title")}>Giá bán</h3>
                                <div className={cx("flex-row")}>
                                    <DefaultInput
                                        setValue={setPrice}
                                        value={price}
                                        id=""
                                        label="Giá bán (đ)"
                                    ></DefaultInput>
                                    <DefaultInput
                                        setValue={setDiscount_price}
                                        value={Discount_price}
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
                                        label="Hàng trong kho"
                                        width={"45%"}
                                    ></DefaultInput>
                                    <DefaultInput
                                        setValue={setNumbers}
                                        // type="time"
                                        value={Numbers}
                                        id=""
                                        label="Đã bán"
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
                                                            src={avatar}
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
                                                <button
                                                    className={cx("btn1")}
                                                    onClick={handleChoose}
                                                >
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
                                                    <Button
                                                        onClick={() => {
                                                            setSource();
                                                            setMedia([]);
                                                        }}
                                                        className={cx(
                                                            "VideoInput_btn"
                                                        )}
                                                    >
                                                        <FontAwesomeIcon
                                                            icon={faTimes}
                                                        ></FontAwesomeIcon>
                                                    </Button>
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
                                                                        image.data_url
                                                                            ? image?.data_url
                                                                            : image
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
                    </div>
                    <div className={cx("flex-row")}>
                        <div className={cx("flex-1")}></div>
                        <Button onClick={(e) => onSubmitHandler(e)} primary>
                            Cập nhật
                        </Button>
                        <Button
                            danger
                            onClick={() => {
                                onClose();
                            }}
                            style={{ marginLeft: "10px" }}
                        >
                            Hủy
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdateProduct;
