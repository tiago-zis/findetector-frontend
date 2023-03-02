import { AuthProvider, useTranslate } from "@pankod/refine-core";
import { notification } from "@pankod/refine-antd";

import decodeJwt from 'jwt-decode';
import axios from "axios";

export const axiosInstance = axios.create();
import { Constants } from './helpers/constants';


export const TOKEN_KEY = "refine-auth";

export const authProvider: AuthProvider = {

    login: async ({ email, password }) => {

        return fetch(`${Constants.API_URL}/api/login_check`,
            {
                method: 'POST',
                body: JSON.stringify({ username: email, password }),
                headers: new Headers({ 'Content-Type': 'application/json' }),
            })
            .then(async response => {
                if (response.status === 401) {
                    const res = await response.json();

                    return Promise.reject({ message: res && res.message ? res.message : 'app.errors.invalid_credentials' });
                }

                if (response.status < 200 || response.status >= 300) {
                    throw new Error(response.statusText);
                }

                return response.json();
            })
            .then(({ token }) => {
                const decodedToken = decodeJwt(token);
                localStorage.setItem(Constants.TOKEN_KEY, token);
                localStorage.setItem(Constants.AUTH_KEY, JSON.stringify(decodedToken));

                return Promise.resolve();
            })
            .catch((e) => {
                throw new Error(e.message ? e.message : 'app.errors.network')
            });

    },
    register: ({ email, password }) => {
        // We suppose we actually send a request to the back end here.
        if (email && password) {

            return fetch(`${Constants.API_URL}/register`,
                {
                    method: 'POST',
                    body: JSON.stringify({ email, plainPassword: password }),
                    headers: new Headers({ 'Content-Type': 'application/json' }),
                })
                .then(async response => {

                    if (response.status === 400) {
                        const res = await response.json();
                        const children = res.children;
                        let message = "";

                        if (children.email && children.email.errors && children.email.errors.length > 0) {
                            children.email.errors.map((el: any) => message += el.message + '\n');
                        }

                        if (children.name && children.name.errors && children.name.errors.length > 0) {
                            children.name.errors.map((el: any) => message += el.message + '\n');
                        }

                        if (children.password && children.password.errors && children.password.errors.length > 0) {
                            children.password.errors.map((el: any) => message += el.message + '\n');
                        }

                        return Promise.reject({ message: message });
                    } else if (response.status < 200 || response.status >= 300) {
                        const res = await response.json();

                        return Promise.reject({ message: res && res.message ? res.message : 'Ocorreu um erro durante a inscrição! Tente novamente mais tarte.' });
                    }

                    return response.json();
                })
                .then((values) => {
                    notification.success({
                        message: "Sucesso!",
                        description: `Inscrição realizada com sucesso. Um email de verificação foi encaminhado para o endereço "${email}".`,
                    });

                    return Promise.resolve(values);
                })
                .catch((e) => {
                    throw new Error(e.message ? e.message : 'app.errors.network')
                });

        }

        return Promise.reject();
    },

    forgotPassword: ({ email }) => {
        // We suppose we actually send a request to the back end here.
        if (email) {

            return fetch(`${Constants.API_URL}/reset-password`,
                {
                    method: 'POST',
                    body: JSON.stringify({ email }),
                    headers: new Headers({ 'Content-Type': 'application/json' }),
                })
                .then(async response => {
                    if (response.status === 400) {
                        const res = await response.json();
                        const children = res.children;
                        let message = "";

                        if (children.email && children.email.errors && children.email.errors.length > 0) {
                            children.email.errors.map((el: any) => message += el.message + '\n');
                        }

                        notification.error({
                            message: "Redefinir a senha",
                            description: message,
                        });

                        return Promise.reject({ message: message });
                    } else if (response.status < 200 || response.status >= 300) {
                        const res = await response.json();

                        notification.error({
                            message: "Redefinir a senha",
                            description: res && res.message ? res.message : 'Ops! Ocorreu um erro durante a operação.',
                        });

                        return Promise.reject({ message: res && res.message ? res.message : 'app.errors.forgot_password_error' });
                    }

                    return response.json();
                })
                .then((values) => {

                    notification.success({
                        message: "Redefinir a senha",
                        description: `O link para redefinir a senha foi enviado para "${email}"`,
                    });

                    return Promise.resolve(values);
                })
                .catch((e) => {
                    throw new Error(e.message ? e.message : 'app.errors.network')
                });

        }
        return Promise.reject();
    },
    updatePassword: ({ password, confirmPassword }) => {

        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');

        if (password && confirmPassword && token) {

            const attr = {
                plainPassword: {
                    first: password,
                    second: confirmPassword
                }
            }

            return fetch(`${Constants.API_URL}/reset-password/reset/${token}`,
                {
                    method: 'POST',
                    body: JSON.stringify(attr),
                    headers: new Headers({ 'Content-Type': 'application/json' }),
                })
                .then(async response => {
                    if (response.status === 400) {
                        const res = await response.json();

                        if (res.message) {
                            return Promise.reject({ message: res.message });
                        }

                        const errors = res?.children?.plainPassword?.children?.first?.errors;
                        let message = "";

                        if (errors && errors.length > 0) {
                            errors.map((el: any) => message += el.message + '\n');
                        }

                        return Promise.reject({ message: message });
                    } else if (response.status < 200 || response.status >= 300) {
                        const res = await response.json();

                        return Promise.reject({ message: res && res.message ? res.message : 'app.errors.reset_password_error' });
                    }

                    return response.json();
                })
                .then((values) => {
                    notification.success({
                        message: "Atualizar senha",
                        description: "A senha foi atualizada com sucesso",
                    });
                    return Promise.resolve(values);
                })
                .catch((e) => {
                    throw new Error(e.message ? e.message : 'app.errors.network')
                });
        }
        return Promise.reject();
    },

    logout: () => {
        localStorage.removeItem(Constants.TOKEN_KEY);
        localStorage.removeItem(Constants.AUTH_KEY);
        return Promise.resolve();
    },
    checkError: ({statusCode}) => {
        if (statusCode === 401) {
            localStorage.removeItem(Constants.TOKEN_KEY);
            localStorage.removeItem(Constants.AUTH_KEY);
            return Promise.reject({ logoutUser: true });
        } else if (statusCode === 403) {
            return Promise.reject({ redirectTo: '/unauthorized', logoutUser: false });
        }

        return Promise.resolve();
    },
    checkAuth: () => {
        const token = localStorage.getItem(Constants.TOKEN_KEY);

        if (token) {
            return Promise.resolve();
        }

        return Promise.reject();
    },
    getPermissions: () => {
        const profile = localStorage.getItem(Constants.AUTH_KEY);

        if (profile) {
            const parsedUser = JSON.parse(profile);
            return Promise.resolve({ roles: parsedUser.roles });
        }
        return Promise.reject();
    },
    getUserIdentity: async () => {
        const token = localStorage.getItem(Constants.TOKEN_KEY);
        const profile = localStorage.getItem(Constants.AUTH_KEY);

        if (!token || !profile) {
            return Promise.reject();
        }

        const user = JSON.parse(profile);

        return Promise.resolve({
            ...user,            
        });
    },
};
