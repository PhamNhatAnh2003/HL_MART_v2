import classNames from "classnames/bind";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

import styles from "./Slider.module.scss";
import "./Carousel.scss";

const cx = classNames.bind(styles);

const responsive = {
    desktop: {
        breakpoint: { max: 4000, min: 1280 },
        items: 1,
    },
    laptop: {
        breakpoint: { max: 1280, min: 1024 },
        items: 1,
    },
    tablet: {
        breakpoint: { max: 1024, min: 768 },
        items: 1,
    },
    minitablet: {
        breakpoint: { max: 768, min: 480 },
        items: 1,
    },
    mobile: {
        breakpoint: { max: 480, min: 0 },
        items: 1,
    },
};

const Slider = ({ medias = [] }) => {
    console.log(medias);
    console.log("Type of medias:", typeof medias);
    return (
        
        <div className={cx("slider")}>
            <Carousel
                responsive={responsive}
                infinite={false}
                showDots={true}
                keyBoardControl={true}
            >
                {medias &&
                    medias.length > 0 &&
                    medias.map((item, index) => {
                        if (item === null) {
                            return;
                        }
                        const extension = item.split(".").pop().toLowerCase();
                        return (
                            <div
                                key={`media-item-${index}`}
                                className={cx("slider-item")}
                            >
                                {extension === "mp4" ? (
                                    <video
                                        controls
                                        autoPlay
                                        style={{
                                            minWidth: "100%",
                                            height: "100%",
                                        }}
                                    >
                                        <source src={item} type="video/mp4" />
                                        Your browser does not support the video
                                        tag.
                                    </video>
                                ) : (
                                    <img src={item} alt="item" />
                                )}
                            </div>
                        );
                    })}
            </Carousel>
        </div>
    );
};

export default Slider;
