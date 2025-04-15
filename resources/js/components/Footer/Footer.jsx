import styles from "./Footer.module.scss"
import images from "~/assets/images";
import classNames from "classnames/bind";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faShoppingCart,
    faTruck,
    faGift,
    faExchangeAlt,
} from "@fortawesome/free-solid-svg-icons";


const cx = classNames.bind(styles);


const Footer = () => {
    return (
        <div className={cx("footer")}>
            <div
                className={cx("footerContent")}
                // style={{ background: `url(${images.footerDown})` }}
            >
                <nav className={cx("footerNav")}>
                    <div className={cx("footerDesc")}>
                        <h1 className={cx("footerLogoText")}>HL_Mart</h1>
                        <p>
                            HL Mart mang đến cho bạn trải nghiệm mua sắm tiện lợi
                            với hàng ngàn sản phẩm tươi ngon, chính hãng, và giá cả
                            hợp lý. Chúng tôi cam kết mang lại dịch vụ nhanh chóng,
                            an toàn và chất lượng đến tận tay khách hàng.
                        </p>
                    </div>
                    <div className={cx("info")}>
                        <ul>
                            <li>
                                <span>Dịch vụ</span>
                            </li>
                            <li>
                                <FontAwesomeIcon icon={faShoppingCart} /> Mua hàng
                                trực tuyến
                            </li>
                            <li>
                                <FontAwesomeIcon icon={faTruck} /> Giao hàng nhanh
                            </li>
                            <li>
                                <FontAwesomeIcon icon={faExchangeAlt} />
                                Đổi trả linh hoạt
                            </li>
                            <li>
                                <FontAwesomeIcon icon={faGift} /> Ưu đãi
                            </li>
                        </ul>
                        <ul>
                            <li>
                                <span>Về chúng tôi</span>
                            </li>
                            <li>Email: Anh.pn214987@sis.hust.edu.vn</li>
                            <li>SĐT: 0912198345</li>
                            <li>Chính sách bán hàng</li>
                        </ul>
                    </div>
                </nav>
            </div>

            {/* Bottom Section */}
            <div className={cx("footer-bottom")}>
                <p className={cx("footer-powered")}>
                    Sản phẩm được để dành tặng cho gia đình{" "}
                    <span className={cx("highlight-orange")}>Bố H</span> và{" "}
                    <span className={cx("highlight-orange")}>Mẹ L</span>
                </p>
            </div>
        </div>
    );
};

export default Footer;