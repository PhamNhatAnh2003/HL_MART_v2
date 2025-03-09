import classNames from "classnames/bind";

import styles from "./Rating.module.scss";
import { useEffect, useState } from "react";
import Star from "./Star";

const cx = classNames.bind(styles);

const Rating = ({ id, rate, small = false, medium = false, large = false }) => {
    const [rateList, setRateList] = useState([0, 0, 0, 0, 0]);

    const updateRate = () => {
        if (isNaN(rate) || rate < 0 || rate > 5) return;
        const fulls = Math.floor(rate);
        const last = Math.round((rate - fulls) * 100);
        setRateList(() => {
            const array = [0, 0, 0, 0, 0];
            let i = 0;
            for (i; i < fulls; i++) {
                array[i] = 100;
            }
            if (i < array.length) {
                array[i] = last;
            }
            return array;
        });
    };

    useEffect(() => {
        if (rate < 0) {
            setRateList([0, 0, 0, 0, 0]);
        } else if (rate > 5) {
            setRateList([100, 100, 100, 100, 100]);
        } else {
            updateRate();
        }
    }, [rate]);

    return (
        <div className={cx("rating")}>
            {rateList.map((rt, index) => (
                <Star
                    key={`rating-${id}-${index}`}
                    small={small}
                    medium={medium}
                    large={large}
                    rate={rt}
                />
            ))}
        </div>
    );
};

export default Rating;
