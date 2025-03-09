import classNames from "classnames/bind";
import styles from "./Card.module.scss";
import Rating from "../Rating";
import Button from "../Button";
import images from "~/assets/images";
// import { useNavigate } from "react-router-dom";

const cx = classNames.bind(styles);

const Product = {
    id: 5,
    avatar: images.product,
    name: "Products",
    price: "50k",
    distance: "2km",
    number: 1500,
    rate: 3.6,
};

// const formatDistance = (distance) => {
//     return `${Math.round(distance)} Km`;
// };

const Card = ({ product = Product }) => {
    // const navigate = useNavigate();

    const handleSeeDetail = () => {
        navigate(`/restaurant/${product.id}`);
    };
    return (
        <div className={cx("card")}>
            <div className={cx("avatar")}>
                <img src={product.avatar ?? images.product} alt="avatar" />
            </div>

            <div className={cx("content")}>
                <div className={cx("name")}>{product.name}</div>
                <div className={cx("price-and-distance")}>
                    <div className={cx("price")}>Gia ban {product.price}</div>
                </div>
                <div className={cx("rating-box")}>
                    <Rating rate={product.rating} />
                </div>
                <div className={cx("number")}>
                    (<span>{product.number}</span> Đánh giá)
                </div>
                <Button
                    className={cx("view-btn")}
                    size="md"
                    curved
                    shadow
                    onClick={handleSeeDetail}
                >
                    Thêm vào giỏ hàng
                </Button>
            </div>
        </div>
    );
};

export default Card;
