import React, { useState, useEffect } from "react";
import classNames from "classnames/bind";
import styles from "./SidebarAdmin.module.scss";
import { useNavigate } from "react-router-dom";
import config from "~/config";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
const cx = classNames.bind(styles);

const SidebarAdmin = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const location = useLocation();



    return (
        <div className={cx("drawer-wrapper", { open: isOpen })}>
            <div className={cx("backdrop")} onClick={onClose}></div>

            <div className={cx("drawer")}>
                <div className={cx("drawer-header")}>
                    <h2>Xin chào, Admin</h2>
                </div>

                <div className={cx("drawer-content")}>
                    <div className={cx("tab-menu")}>
                        <div
                            onClick={() => {
                                navigate(config.routes.admin.dashboard);
                                onClose();
                            }}
                            className={cx("tab-item", {
                                active:
                                    location.pathname ===
                                    config.routes.admin.dashboard,
                            })}
                        >
                            Tổng quan
                        </div>
                        <div
                            onClick={() => {
                                navigate(config.routes.admin.productManage);
                                onClose();
                            }}
                            className={cx("tab-item", {
                                active:
                                    location.pathname ===
                                    config.routes.admin.productManage,
                            })}
                        >
                            Quản lý sản phẩm
                        </div>
                        <div
                            onClick={() => {
                                navigate(config.routes.admin.userList);
                                onClose();
                            }}
                            className={cx("tab-item", {
                                active:
                                    location.pathname ===
                                    config.routes.admin.userList,
                            })}
                        >
                            Quản lý người dùng
                        </div>
                        <div
                            onClick={() => {
                                navigate(config.routes.admin.oderList);
                                onClose();
                            }}
                            className={cx("tab-item", {
                                active:
                                    location.pathname ===
                                    config.routes.admin.orderList,
                            })}
                        >
                            Quản lý đơn hàng
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SidebarAdmin;
