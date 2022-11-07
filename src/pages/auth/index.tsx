import { AuthPage as AntdAuthPage, FormProps } from "@pankod/refine-antd";
import { useRouterContext, useTranslate } from "@pankod/refine-core";
import { useEffect } from "react";
import { notification } from "@pankod/refine-antd";

const authWrapperProps = {
    style: {
        //background: "radial-gradient(50% 50% at 50% 50%,rgba(255, 255, 255, 0) 0%,rgba(0, 0, 0, 0.5) 100%),url('images/login-bg.png')",
        backgroundSize: "cover",
    },
};

const renderAuthContent = (content: React.ReactNode) => {
    const { Link } = useRouterContext();

    return (
        <div
            style={{
                maxWidth: 408,
                margin: "auto",
            }}
        >
            <Link to="/">
                <h1 className="ant-typography" style={{ width: '100%', textAlign: 'center' }}>Project</h1>
            </Link>
            {content}
        </div>
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
