import {
    ConfigProvider, ErrorComponent, Icons, Layout, notificationProvider
} from "@pankod/refine-antd";
import { Refine } from "@pankod/refine-core";
import { RefineKbarProvider } from "@pankod/refine-kbar";
import routerProvider from "@pankod/refine-react-router-v6";
import pt_BR from "antd/lib/locale/pt_BR";
import { authProvider } from "authProvider";
import {accessControlProvider} from "accessProvider";

import { Constants } from "helpers/constants";

import dayjs from "dayjs";
import React, { useEffect } from "react";

import "dayjs/locale/pt-br";
import "styles/antd.less";


import { AuthPage } from "./pages/auth";
import { UserList, UserForm, UserShow } from "./pages/users";
import { ImageList } from "./pages/images";

import { Header, Title } from "components";
import { useTranslation } from "react-i18next";

import dataProvider from './dataProvider';

const App: React.FC = () => {
    const { t, i18n } = useTranslation();

    const i18nProvider = {
        translate: (key: string, params: object) => t(key, params),
        changeLocale: (lang: string) => i18n.changeLanguage(lang),
        getLocale: () => i18n.language,
    }; 

    const locale = i18nProvider.getLocale();

    useEffect(() => {
        if (locale === "pt_BR") {
            dayjs.locale("pt_BR");
        } else {
            dayjs.locale("en");
        }
    }, [locale]);

    return (
        <RefineKbarProvider>
            <ConfigProvider locale={locale === "pt_BR" ? pt_BR : undefined}>
                <Refine
                    routerProvider={{
                        ...routerProvider,
                        routes: [
                            {
                                path: "/register",
                                element: (
                                    <AuthPage
                                        type="register"
                                        formProps={{
                                            initialValues: {
                                                email: "demo@refine.dev",
                                                password: "demodemo",
                                            },
                                        }}
                                    />
                                ),
                            },
                            {
                                path: "/forgot-password",
                                element: <AuthPage type="forgotPassword" />,
                            },
                            {
                                path: "/update-password",
                                element: <AuthPage type="updatePassword" />,
                            },
                        ],
                    }}
                    dataProvider={dataProvider(
                        `${Constants.API_URL}/api`,
                    )}
                    accessControlProvider={accessControlProvider}
                    authProvider={authProvider}
                    i18nProvider={i18nProvider}
                    LoginPage={() => (
                        <AuthPage
                            type="login"
                            formProps={{
                                initialValues: {
                                    email: "admin@email.com",
                                    password: "123456789",
                                },
                            }}                            
                        />
                    )}
                    Title={Title}
                    Header={Header}
                    Layout={Layout}
                    options={{
                        syncWithLocation: true,
                        warnWhenUnsavedChanges: true,
                    }}
                    resources={[                        
                        {
                            name: "images",
                            list: ImageList,
                            icon: <Icons.PictureOutlined />,
                        },                        
                        {
                            name: "users",
                            list: UserList,
                            create: UserForm,
                            edit: UserForm,
                            show: UserShow,
                            icon: <Icons.UserOutlined />,
                        },
                    ]}
                    notificationProvider={notificationProvider}
                    catchAll={<ErrorComponent />}
                />
            </ConfigProvider>
        </RefineKbarProvider>
    );
};

export default App;