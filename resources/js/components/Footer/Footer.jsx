import styles from "./Footer.module.scss"
import images from "~/assets/images";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faShoppingCart,
    faTruck,
    faGift,
    faExchangeAlt,
} from "@fortawesome/free-solid-svg-icons";
import {
    faChevronDown,
    faChevronUp,
    faHeart,
} from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames/bind";
const cx = classNames.bind(styles);

const Footer =() =>{

return (
    <div className={styles.footer}>
        <div
            className={styles.footerContent}
            // style={{
            //     background: `url(${images.footerDown})`,
            // }}
        >
            <nav className={styles.footerNav}>
                <div className={styles.footerDesc}>
                    <h1 className={styles.footerLogoText}>HL_Mart</h1>
                    {/* <p>Hàng hóa chất lượng, giá cả phải chăng!</p>
                    <p>Đầy đủ nhu yếu phẩm, tiện lợi cho mọi nhà!</p>
                    <p>Cửa hàng tạp hóa thân thiện, phục vụ tận tâm!</p> */}
                    <p>
                        HL Mart mang đến cho bạn trải nghiệm mua sắm tiện lợi
                        với hàng ngàn sản phẩm tươi ngon, chính hãng, và giá cả
                        hợp lý. Chúng tôi cam kết mang lại dịch vụ nhanh chóng,
                        an toàn và chất lượng đến tận tay khách hàng.
                    </p>
                </div>
                <div className={styles.info}>
                    <ul>
                        <li>
                            <strong>Dịch vụ</strong>
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
                            <FontAwesomeIcon icon={faGift} /> Ưu đãi{" "}
                        </li>
                    </ul>
                    <ul>
                        <li>
                            <strong>Về chúng tôi</strong>
                        </li>
                        <li>Email: </li>
                        <li>SDT: </li>
                        <li>Chính sách bán hàng</li>
                    </ul>
                </div>
            </nav>
        </div>
        {/* <!-- Bottom Section --> */}
        <div className={cx("footer-bottom")}>
            <p className={cx("footer-powered")}>
                Sản Phẩm được để dành tặng cho gia đình
                <span className={cx("highlight-orange")}>Bố H</span>và 　
                <span className={cx("highlight-orange")}>Mẹ L</span>
            </p>
        </div>
    </div>
);
}
export default Footer;