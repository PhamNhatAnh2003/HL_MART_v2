import classNames from "classnames/bind";

import styles from "./ProductDetail.module.scss";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Rating from "~/components/Rating";
import Button from "~/components/Button";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Slider from "./Slider/Slider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faBars,
    faChevronLeft,
    faClock,
    faDoorOpen,
    faLocation,
    faLocationArrow,
    faLocationDot,
    faMoneyBill,
} from "@fortawesome/free-solid-svg-icons";
import CommentInput from "./CommentInput/CommentInput";
import images from "~/assets/images";
import { Input } from "~/components/Input";
import config from "~/config";

const cx = classNames.bind(styles);

const ProductDetail = () => {
    const navigate = useNavigate();
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState([]);

    const fetchReviews = async () => {
        try {
            const response = await axios.get("/api/reviews", {
                params: { product_id: productId },
            });
            if (response.status === 200) {
                setReviews(response.data.reviews);
                console.log("Danh sách đánh giá: ", response.data.reviews);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const fetchProduct = async () => {
        try {
            const response = await axios.get("/api/product", {
                params: { id: productId },
            });
            if (response.status === 200) {
                setProduct(response.data.product);
                console.log("Danh sách đánh giá: ", response.data.product);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchProduct();
        fetchReviews();
    }, [productId]);

    const formatDateTime = (dateTimeString) => {
        const date = new Date(dateTimeString);

        const hours = date.getHours().toString().padStart(2, "0");
        const minutes = date.getMinutes().toString().padStart(2, "0");
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Tháng trong JS bắt đầu từ 0
        const year = date.getFullYear();

        return `${hours}:${minutes} ${day}-${month}-${year}`;
    };

    const handleComment = () => {
        fetchProduct();
        fetchReviews();
    };

    return (
        <>
            {product && (
                <main className={cx("product-detail")}>
                    <div className={cx("content")}>
                        <div
                            className={cx("back-btn")}
                            onClick={() => navigate(-1)}
                        >
                            <span>
                                <Button primary>
                                    <FontAwesomeIcon icon={faChevronLeft} />
                                    Quay lại
                                </Button>
                            </span>
                        </div>
                        <div className={cx("line")}></div>

                        <div className={cx("first-content")}>
                            <div className={cx("slider-box")}>
                                <Slider medias={product.media ?? []} />
                            </div>

                            <div className={cx("detail-box")}>
                                <div className={cx("detail")}>
                                    <div className={cx("name")}>
                                        <strong>Tên sản phẩm:</strong>{" "}
                                        <span>{product.name}</span>
                                    </div>
                                    <div className={cx("price")}>
                                        <strong>Giá bán lẻ:</strong>
                                        <span>{product.price}đ</span>
                                    </div>
                                    <div className={cx("price")}>
                                        <strong>Giam gia:</strong>
                                        <span>{product.discount_price}đ</span>
                                    </div>
                                    <div className={cx("description")}>
                                        <strong>Mô tả:</strong>{" "}
                                        <span>{product.description}</span>
                                    </div>
                                    <div className={cx("stock")}>
                                        <strong>Số lượng:</strong>{" "}
                                        <span>{product.stock}</span>
                                    </div>
                                    <div className={cx("star")}>
                                        <strong>Đánh giá</strong>{" "}
                                        <span>
                                            <Rating rate={product.rating} />
                                        </span>
                                    </div>
                                    <div className={cx("shipping")}>
                                        <strong>Vận chuyển:</strong>{" "}
                                        <span>Pham Nhat Anh</span>
                                    </div>
                                    <div className={cx("hoho")}>
                                        <strong>Xuất xứ:</strong>{" "}
                                        <span>Pham Nhat Anh</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={cx("line")}></div>
                        <CommentInput
                            productId={productId}
                            onUpload={handleComment}
                        />

                        <div className={cx("comment-box")}>
                            {reviews.length > 0 &&
                                reviews.map((review, index) => (
                                    <div key={index} className={cx("comment")}>
                                        <div className={cx("comment-left")}>
                                            <img
                                                src={
                                                    review.user.avatar ??
                                                    images.avatarUser
                                                }
                                                alt="avatar"
                                            />
                                        </div>
                                        <div className={cx("comment-right")}>
                                            <p className={cx("user-name")}>
                                                {review.user.name}
                                            </p>
                                            <p className={cx("user-comment")}>
                                                {review.comment}
                                            </p>
                                            {review.image && (
                                                <img
                                                    className={cx(
                                                        "image-commnet"
                                                    )}
                                                    src={review.image}
                                                    alt="img-commnet"
                                                />
                                            )}
                                            <p className={cx("user-time")}>
                                                {formatDateTime(
                                                    review.created_at
                                                )}
                                            </p>
                                            <Rating rate={review.rating} />
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                </main>
            )}
        </>
    );
};

export default ProductDetail;
