import classNames from "classnames/bind";
import styles from "./Card.module.scss";
import Rating from "../Rating";
import Button from "../Button";
import images from "~/assets/images";
import { useNavigate } from "react-router-dom";
import { useCart } from "~/hooks/useCart";
import { formatPrice } from "~/utils/format";
import React, { useEffect, useState, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "~/context/AuthContext";
import showToast from "~/components/message";

const cx = classNames.bind(styles);

const Product = {
    id: 5,
    avatar: images.product,
    name: "Products",
    price: "50k",
    stock: "50",
    sold: "51.09k",
    number: 1500,
    rate: 3.6,
};

const Card = ({ product = Product }) => {
    const [isFavorite, setIsFavorite] = useState(false);
    const navigate = useNavigate();
    const { addToCart } = useCart(); // 🔥 Lấy hàm addToCart từ context
    const { user: loginedProfile } = useContext(AuthContext);
    const handleSeeDetail = () => {
        navigate(`/product/${product.id}`);
    };

    const handleAddToCart = () => {
        addToCart(product); // 🔥 Gọi hàm thêm vào giỏ hàng
    };

    const handleToggleFavorite = async () => {
        try {
            const res = await axios.post(
                "http://127.0.0.1:8000/api/favorite-toggle",
                {
                    user_id: loginedProfile?.id,
                    product_id: product.id,
                }
            );

            if (res.data.status) {
                setIsFavorite(res.data.is_favorite);
                showToast(res.data.message);
            }
        } catch (err) {
            console.error("Lỗi khi xử lý yêu thích:", err);
        }
    };

    useEffect(() => {
        const fetchFavoriteStatus = async () => {
            try {
                const res = await axios.get(
                    `http://127.0.0.1:8000/api/is-favorite`,
                    {
                        params: {
                            user_id: loginedProfile?.id,
                            product_id: product.id,
                        },
                    }
                );
                setIsFavorite(res.data.is_favorite); // true hoặc false
             } catch (err) {
                console.error("Không thể kiểm tra trạng thái yêu thích:", err);
                }
             };

         if (loginedProfile?.id) {
             fetchFavoriteStatus();
                }
    }, [loginedProfile, product.id]);

    return (
        <div className={cx("card")}>
            <div className={cx("avatar")}>
                <img
                    onClick={handleSeeDetail}
                    src={product.avatar ?? images.product}
                    alt="avatar"
                />
                <div
                    className={cx("favorite-icon", { active: isFavorite })}
                    onClick={() => {
                        handleToggleFavorite();
                    }}
                >
                    <FontAwesomeIcon icon={faHeart} />
                </div>
            </div>

            <div onClick={handleSeeDetail} className={cx("content")}>
                <div className={cx("name")}>{product.name}</div>
                <div className={cx("price-and-distance")}>
                    <span className={cx("price-label")}>Giá bán:</span>
                    <div className={cx("price-container")}>
                        {product.discount_price &&
                        product.discount_price < product.price ? (
                            <>
                                <span className={cx("discount-price")}>
                                    {formatPrice(product.discount_price)}
                                </span>
                                <span className={cx("original-price")}>
                                    {formatPrice(product.price)}
                                </span>
                            </>
                        ) : (
                            <span className={cx("normal-price")}>
                                {formatPrice(product.price)}
                            </span>
                        )}
                    </div>
                </div>

                <div className={cx("rating-box")}>
                    <Rating rate={product.rating} />
                    <div className={cx("number")}>
                        (<span>{product.number}</span> Đánh giá)
                    </div>
                </div>

                <div className={cx("number")}>
                    Đã bán: <span>{product.sold}</span> {product.unit}
                </div>
                <div className={cx("number")}>
                    SL trong kho: <span>{product.stock}</span> {product.unit}
                </div>
            </div>
            <Button
                className={cx("view-btn")}
                secondary
                curved
                shadow
                onClick={handleAddToCart}
            >
                Thêm vào giỏ
            </Button>
        </div>
    );
};

export default Card;
