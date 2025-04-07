import classNames from "classnames/bind";
import styles from "./Card.module.scss";
import Rating from "../Rating";
import Button from "../Button";
import images from "~/assets/images";
import { useNavigate } from "react-router-dom";
import { useCart } from "~/hooks/useCart";
import { formatPrice } from "~/utils/format";

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
    const navigate = useNavigate();
    const { addToCart } = useCart(); // 🔥 Lấy hàm addToCart từ context

    const handleSeeDetail = () => {
        navigate(`/product/${product.id}`);
    };

    const handleAddToCart = () => {
        addToCart(product); // 🔥 Gọi hàm thêm vào giỏ hàng
    };

    return (
        <div className={cx("card")}>
            <div className={cx("avatar")}>
                <img
                    onClick={handleSeeDetail}
                    src={product.avatar ?? images.product}
                    alt="avatar"
                />
            </div>

            <div onClick={handleSeeDetail} className={cx("content")}>
                <div className={cx("name")}>{product.name}</div>
                <div className={cx("price-and-distance")}>
                    <span className={cx("price-label")}>Giá bán:</span>
                    <div className={cx("price-container")}>
                        {product.discount_price &&
                        product.discount_price <
                            product.price ? (
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
                </div>
                <div className={cx("number")}>
                    (<span>{product.number}</span> Đánh giá)
                </div>
            </div>
            <Button
                className={cx("view-btn")}
                small
                primary
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
