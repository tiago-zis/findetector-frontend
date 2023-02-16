import {
    useGetLocale,
    useSetLocale,
    useGetIdentity,
    useTranslate,
    useApiUrl,
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
    Drawer
} from "@pankod/refine-antd";

import { useTranslation } from "react-i18next";
const { DownOutlined } = Icons;

const { Text } = Typography;
const { useBreakpoint } = Grid;

import "./style.less";
import { useEffect, useState } from "react";
import { UserProfile } from "../../pages/users";

export const Header: React.FC = () => {
    const { i18n } = useTranslation();
    const locale = useGetLocale();
    const changeLanguage = useSetLocale();
    const { data } = useGetIdentity();
    const screens = useBreakpoint();
    const t = useTranslate();
    const [open, setOpen] = useState(false);
    const currentLocale = locale();
    const [user, setUser] = useState<any>();
    const apiUrl = useApiUrl();

    useEffect(() => {
        if (!user || user?.id !== data?.id) {
            setUser(data);
        }
    }, [data])

    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };

    const updateUserInfo = (user: any) => {
        setUser(user);
        onClose();
    }

    console.log(user)

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
        <>
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
                                {user?.username}
                            </Text>

                            {
                                !user?.image &&

                                <Avatar
                                    size="large"
                                    icon={<Icons.UserOutlined onClick={showDrawer} />}
                                    //src={user?.avatar}
                                    alt={user?.username}
                                />
                            }

                            {
                                user?.image &&
                                <div onClick={showDrawer}>
                                <Avatar
                                    size="large"
                                    src={`${apiUrl}/file/restore/${user?.image.id}`}
                                    //src={user?.avatar}
                                    alt={user?.username}
                                    style={{cursor:"pointer"}}
                                />
                                </div>
                            }



                        </Space>
                    </Col>
                </Row>
            </AntdLayout.Header>

            <Drawer title={t('words.profile')}
                destroyOnClose={true}
                placement="right"
                bodyStyle={{ padding: 0 }}
                width={"30%"}
                zIndex={1001}
                onClose={onClose}
                visible={open}>

                <UserProfile updateCallback={updateUserInfo} />
            </Drawer>
        </>
    );
};
