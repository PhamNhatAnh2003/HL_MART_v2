import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import Button from "~/components/Button";
import styles from "./Filter.module.scss";

const Filter = ({ onFilterChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [filters, setFilters] = useState({
        name: "",
        start: "",
        end: "",
        rating: "",
        sort_price: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    const applyFilters = () => {
        onFilterChange(filters);
        setIsOpen(false); // Đóng dropdown sau khi áp dụng
    };

    return (
        <div className={styles["filter-dropdown"]}>
            <button
                className={styles["filter-btn"]}
                onClick={() => setIsOpen(!isOpen)}
            >
                <FontAwesomeIcon icon={faFilter} /> Bộ lọc
            </button>

            {isOpen && (
                <div className={styles["filter-container"]}>
                    <h3>Bộ lọc sản phẩm</h3>
                    <div className={styles["price-range"]}>
                        <input
                            type="number"
                            name="start"
                            placeholder="Giá thấp nhất"
                            value={filters.start}
                            onChange={handleChange}
                        />
                        <input
                            type="number"
                            name="end"
                            placeholder="Giá cao nhất"
                            value={filters.end}
                            onChange={handleChange}
                        />
                    </div>

                    <select
                        name="rating"
                        value={filters.rating}
                        onChange={handleChange}
                    >
                        <option value="">Tất cả đánh giá</option>
                        <option value="4">4★ trở lên</option>
                        <option value="3">3★ trở lên</option>
                        <option value="2">2★ trở lên</option>
                    </select>

                    <select
                        name="sort_price"
                        value={filters.sort_price}
                        onChange={handleChange}
                    >
                        <option value="">Sắp xếp giá bán</option>
                        <option value="asc">Giá tăng dần</option>
                        <option value="desc">Giá giảm dần</option>
                    </select>

                    <Button
                        className={styles["apply-btn"]}
                        onClick={applyFilters}
                    >
                        Áp dụng
                    </Button>
                </div>
            )}
        </div>
    );
};

export default Filter;
