import React, { useContext, useState } from "react";
import classNames from "classnames/bind";
import styles from "./Login.module.scss";
import { useNavigate } from "react-router";
import Button from "~/components/Button";
import { Input, PasswordInput } from "~/components/Input";
import { CheckboxInput } from "~/components/Checkbox";
import images from "~/assets/images";
import axios from "axios";
import { Link } from "react-router-dom";
import config from "~/config";
import { AuthContext } from "~/context/AuthContext";
import showToast from "~/components/message";

const cx = classNames.bind(styles);

const Login = () => {
    const { handleLogin } = useContext(AuthContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(false);
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            email: email,
            password: password,
            // remember: remember,
        };
        try {
            // Call API
            const response = await axios.post(
                "http://127.0.0.1:8000/api/login",
                payload
            );
            if (response.status === 200) {
                const user = response.data.user;
                handleLogin(user.token, user.role, user.id);
                const role = user.role;
                if (role === "user") {
                    showToast("Đăng nhập thành công");
                    navigate(config.routes.user.home);
                } else if (role === "admin") {
                    showToast("Đăng nhập thành công");
                    navigate(config.routes.admin.dashboard);
                } else if (role === "staff"){
                    showToast("Đăng nhập thành công");
                    navigate(config.routes.staff.productManage);
                }
            }
            console.log(response);
        } catch (error) {
            showToast(error.response.data.message);
        }
    };

    return (
        <div className={cx("container")}>
            <div className={cx("main")}>
                <div className={cx("left-content")}>
                    <div className={cx("login-header")}>
                        <img
                            className={cx("logo")}
                            src={images.logo}
                            alt="logo"
                        />
                    </div>
                    <form
                        onSubmit={(e) => handleSubmit(e)}
                        className={cx("login-form")}
                    >
                        <div className={cx("login-input")}>
                            <Input
                                large
                                medium
                                required
                                label="Email"
                                width="300px"
                                value={email}
                                setValue={setEmail}
                            />
                        </div>
                        <div className={cx("login-input")}>
                            <PasswordInput
                                large
                                medium
                                required
                                label="Password"
                                width="300px"
                                password={password}
                                setPassword={setPassword}
                            />
                        </div>
                        <div className={cx("login-checkbox")}>
                            <CheckboxInput
                                onChange={() => setRemember(!remember)}
                            >
                                Ghi nhớ đăng nhập
                            </CheckboxInput>
                        </div>
                        <div className={cx("submit-btn")}>
                            <Button primary >
                                Đăng Nhập
                            </Button>
                        </div>
                    </form>
                    <div className={cx("login-footer")}>
                        <span>Bạn chưa có tài khoản?  </span>
                        <Link to={config.routes.other.register}>
                            Đăng Ký
                        </Link>
                    </div>
                </div>
                <div className={cx("right-content")}>
                    <div className={cx("login-image")}>
                        <img src={images.logo2} alt="login" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
