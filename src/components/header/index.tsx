import {
    useGetLocale,
    useSetLocale,
    useGetIdentity,
    useTranslate,
} from "@pankod/refine-core";

import {
    AntdLayout,
    Menu,
    Icons,
    Dropdown,
    Avatar,
    Typography,
    Space,
    Grid,
    Row,
    Col,
} from "@pankod/refine-antd";

import { useTranslation } from "react-i18next";
const { DownOutlined } = Icons;

const { Text } = Typography;
const { useBreakpoint } = Grid;

import "./style.less";

export const Header: React.FC = () => {
    const { i18n } = useTranslation();
    const locale = useGetLocale();
    const changeLanguage = useSetLocale();
    const { data: user } = useGetIdentity();
    const screens = useBreakpoint();
    const t = useTranslate();

    const currentLocale = locale();

    
    const menu = (
        <Menu selectedKeys={currentLocale ? [currentLocale] : []}>
            {[...(i18n.languages ?? [])].sort().map((lang: string) => (
                <Menu.Item
                    key={lang}
                    onClick={() => changeLanguage(lang)}
                    icon={
                        <span style={{ marginRight: 8 }}>
                            <Avatar
                                size={16}
                                src={`/images/flags/${lang}.svg`}
                            />
                        </span>
                    }
                >
                    {lang === "en" ? "English" : "Português"}
                </Menu.Item>
            ))}
        </Menu>
    );

    return (
        <AntdLayout.Header
            style={{
                padding: "0px 24px",
                height: "64px",
                backgroundColor: "#FFF",
            }}
        >
            <Row align="middle" justify={screens.sm ? "space-between" : "end"}>
                <Col xs={0} sm={12}>
                    
                </Col>
                <Col>
                    <Space size="middle">
                        <Dropdown overlay={menu}>
                            <a
                                style={{ color: "inherit" }}
                                onClick={(e) => e.preventDefault()}
                            >
                                <Space>
                                    <Avatar
                                        size={16}
                                        src={`/images/flags/${currentLocale}.svg`}
                                    />
                                    <div
                                        style={{
                                            display: screens.lg
                                                ? "block"
                                                : "none",
                                        }}
                                    >
                                        {currentLocale === "en"
                                            ? "English"
                                            : "Português"}
                                        <DownOutlined
                                            style={{
                                                fontSize: "12px",
                                                marginLeft: "6px",
                                            }}
                                        />
                                    </div>
                                </Space>
                            </a>
                        </Dropdown>
                        <Text ellipsis strong>
                            {user?.name}
                        </Text>
                        <Avatar
                            size="large"
                            icon={<Icons.UserOutlined />}
                            //src={user?.avatar}
                            alt={user?.name}
                        />
                    </Space>
                </Col>
            </Row>
        </AntdLayout.Header>
    );
};
