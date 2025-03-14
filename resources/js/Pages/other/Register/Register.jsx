import React from "react";
import { useState } from "react";
import classNames from "classnames/bind";
import styles from "./Register.module.scss";

import Button from "~/components/Button";
import { Input, PasswordInput } from "~/components/Input";
import { CheckboxInput } from "~/components/Checkbox";
import images from "~/assets/images";
import config from "~/config";
import { Link } from "react-router-dom";

const cx = classNames.bind(styles);

const Register = () => {
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [remember, setRemember] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert("Mật khẩu không khớp");
            return;
        }

        const payload = {
            name: username,
            email: email,
            password: password,
        };

        axios
            .post("http://127.0.0.1:8000/api/register", payload)
            .then((response) => {
                if (response.status === 201) {
                    alert("Đăng ký thành công");
                    window.location.href = "/login";
                } else {
                    alert("Đăng ký thất bại");
                }
            })
            .catch((error) => {
                alert(error.response.data.message);
            });
    };

    return (
        <>
            <div className={cx("container")}>
                <div className={cx("main")}>
                    <div className={cx("left-content")}>
                        <div className={cx("register-header")}>
                            <img
                                className={cx("logo")}
                                src={images.logo}
                                alt="logo"
                            />
                            <div className={cx("title")}>
                            </div>
                        </div>
                        <form className={cx("register-form")}>
                            <div className={cx("register-input")}>
                                <Input
                                    id="username"
                                    large
                                    required
                                    label="Họ và tên"
                                    width="100%"
                                    value={username}
                                    setValue={setUsername}
                                ></Input>
                                <Input
                                    id="email"
                                    large
                                    required
                                    label="Email"
                                    width="100%"
                                    value={email}
                                    setValue={setEmail}
                                ></Input>
                                <PasswordInput
                                    id="password"
                                    large
                                    required
                                    label="Mật khẩu"
                                    width="100%"
                                    password={password}
                                    setPassword={setPassword}
                                ></PasswordInput>
                                <PasswordInput
                                    id="confirmPassword"
                                    large
                                    required
                                    label="Xác nhận mật khẩu"
                                    width="100%"
                                    value={confirmPassword}
                                    setPassword={setConfirmPassword}
                                ></PasswordInput>
                            </div>
                            <div className={cx("register-checkbox")}>
                                <CheckboxInput
                                    onChange={() => setRemember(!remember)}
                                >
                                    Ghi nhớ trong 30 ngày
                                </CheckboxInput>
                            </div>
                            <div className={cx("submit-btn")}>
                                <Button
                                    onClick={(e) => handleSubmit(e)}
                                    type="danger"
                                    size="md"
                                >
                                    Đăng ký
                                </Button>
                            </div>
                        </form>
                        <div className={cx("register-footer")}>
                            <span>Bạn đã có tài khoản?  </span>
                            <Link to={config.routes.other.login}>
                                Đăng nhập
                            </Link>
                        </div>
                    </div>
                    <div className={cx("right-content")}>
                        <img src={images.login} alt="register"></img>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Register;
