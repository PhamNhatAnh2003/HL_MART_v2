import React from "react";
import { Layout } from "antd";
import { Layout as AntLayout, Typography } from "antd"; // Đổi tên import
import "antd/dist/reset.css";

const { Sider, Content } = AntLayout;
const { Text } = Typography;
import styles from "./layout.module.scss";


const HeaderComponent = () => {
    return (
        <AntLayout.Header
            style={{
                display: "flex",
                alignItems: "center",
                background: "#fff",
                boxShadow: "0 2px 8px #f0f1f2",
            }}
        >
            <img
                src="https://avatars.githubusercontent.com/u/12101536?s=200&v=4"
                alt="logo"
                style={{ width: 32, marginRight: 10 }}
            />
            <Text strong>Ant Design</Text>
            <div style={{ marginLeft: "auto", display: "flex", gap: "20px" }}>
                <Text>导航目录一</Text>
                <Text>导航目录二</Text>
                <Text>导航目录三</Text>
                <Text>导航目录四</Text>
            </div>
        </AntLayout.Header>
    );
};

const MyLayout = ({ children }) => {
    return (
        <Layout className={styles.container}>
            <HeaderComponent />
            <Layout className={styles.body}>
                <Content className={styles.content}>{children}</Content>
            </Layout>
        </Layout>
    );
};

export default MyLayout;
