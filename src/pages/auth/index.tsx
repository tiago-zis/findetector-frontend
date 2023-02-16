import { AuthPage as AntdAuthPage, Avatar, Dropdown, FormProps, Grid, Menu, Space, Icons } from "@pankod/refine-antd";
import { useGetLocale, useRouterContext, useSetLocale, useTranslate } from "@pankod/refine-core";
import { useEffect } from "react";
import { notification } from "@pankod/refine-antd";
import { useTranslation } from "react-i18next";

const { useBreakpoint } = Grid;
const { DownOutlined } = Icons;

const authWrapperProps = {
    style: {
        background: "radial-gradient(50% 50% at 50% 50%,rgba(255, 255, 255, 0) 0%,rgba(0, 0, 0, 0.5) 100%),url('images/Delphinus capensis_1907147_image_1663875470999.jpg')",
        backgroundSize: "cover",
    },
};

const renderAuthContent = (content: React.ReactNode) => {
    const { Link } = useRouterContext();
    const t = useTranslate();
    const { i18n } = useTranslation();
    const locale = useGetLocale();
    const changeLanguage = useSetLocale();
    const currentLocale = locale();
    const screens = useBreakpoint();

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

            <div style={{ position: 'fixed', top: 20, right: 30 }}>
                <Dropdown overlay={menu}>
                    <a
                        style={{ color: "#ffffff" }}
                        onClick={(e) => e.preventDefault()}
                    >
                        <Space>
                            <Avatar
                                size={24}
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
            </div>

            <div
                style={{
                    maxWidth: 408,
                    margin: "auto",
                }}
            >
                <Link to="/">
                    <h1 className="ant-typography" style={{ width: '100%', textAlign: 'center' }}>{t('words.FinDetector')}</h1>
                </Link>
                {content}

            </div>
        </>


    );
};

export const AuthPage: React.FC<{
    type?: "login" | "register" | "forgotPassword" | "updatePassword";
    formProps?: FormProps;
}> = ({ type, formProps }) => {

    const t = useTranslate();

    useEffect(() => {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);

        if (urlParams.get('confirmation') && type === "login") {

            let message = t('phrases.successVerificationMessage');
            let success = true;

            if (urlParams.get('confirmation') === '0') {
                message = t('phrases.errorVerificationMessage');
                success = false;
            } else if (urlParams.get('confirmation') === '2') {
                message = t('phrases.invalidVerificationMessage');
                success = false;
            }

            if (success) {
                notification.success({
                    message: t('notifications.success'),
                    description: message,
                });
            } else {
                notification.error({
                    message: t('notifications.error_'),
                    description: message,
                });
            }

            window.history.pushState({}, document.title, "/" + "login");
        }
    })


    return (
        <AntdAuthPage
            type={type}
            wrapperProps={authWrapperProps}
            renderContent={renderAuthContent}
            formProps={formProps}
            rememberMe={<></>}
        />
    );
};
