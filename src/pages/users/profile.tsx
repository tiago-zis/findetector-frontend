import { HttpError, IResourceComponentsProps, useApiUrl, useTranslate } from "@pankod/refine-core";

import {
    Form,
    useForm,
    Row,
    Col,
    Edit,
    Input,
    Upload,
    Space,
    Avatar,
    Typography,
    Icons,
    Divider,
    Checkbox
} from "@pankod/refine-antd";

import { IUser } from "interfaces";
import { useFromErrorsProviver } from '../../helpers/formErrorsProvider';
import { Constants } from '../../helpers/constants';
import axios from 'axios';
import { useState } from "react";

const { Text } = Typography;

export interface IProps extends IResourceComponentsProps {
    updateCallback: Function;
}

export const UserProfile: React.FC<IProps> = ({ updateCallback, ...rest }) => {

    const t = useTranslate();
    const profile = localStorage.getItem(Constants.AUTH_KEY);
    let user: any = null;

    if (profile) {
        user = JSON.parse(profile);
    }

    const { formProps, form, saveButtonProps } = useForm<IUser>({
        onMutationError: (httpError: HttpError) => {
            form?.setFields(useFromErrorsProviver(httpError));
        },
        onMutationSuccess: (data, variables: any, context) => {
            user.username = variables.name;
            user.email = variables.email;
            localStorage.setItem(Constants.AUTH_KEY, JSON.stringify(user));
            updateCallback(user);
        },
        resource: "users",
        action: "edit",
        id: user?.id,
        redirect: false
    });

    const { initialValues } = formProps;
    const apiUrl = useApiUrl();
    const [image, setImage] = useState<any>(user?.image);
    const [changePassword, setChangePassword] = useState(false);

    const uploadProps = {
        action: `${apiUrl}/user/image/upload`,
        multiple: false,
        headers: {
            Authorization: `Bearer ${localStorage.getItem(Constants.TOKEN_KEY)}`,
        },

        customRequest({
            action,
            data,
            file,
            filename,
            headers,
            onError,
            onProgress,
            onSuccess,
            withCredentials,
        }: any) {

            const formData = new FormData();
            formData.append(filename, file, file.name);

            axios
                .post(action, formData, {
                    withCredentials,
                    headers,
                    onUploadProgress: ({ total, loaded }) => {
                        onProgress({ percent: Math.round((loaded / total) * 100).toFixed(2) }, file);
                    },
                })
                .then(({ data: response }) => {
                    console.log(file, response)
                    setImage(response);
                    onSuccess(response, file);
                    
                    if (user) {
                        user.image = {id:response.id, name: response.name};
                        localStorage.setItem(Constants.AUTH_KEY, JSON.stringify(user));
                        updateCallback(user);
                    }
                })
                .catch(onError);


            return {
                abort() {
                    console.log('upload progress is aborted.');
                },
            };
        },
    };

    const onChange = (e:any) => {
        setChangePassword(e.target.checked);
    }

    return <Edit
        title={t('phrases.updateProfile')}
        saveButtonProps={saveButtonProps}
        goBack={false}
        breadcrumb={false}
        resource={'users'}
        headerButtons={<></>}
    >
        <Form
            {...formProps}
            layout="vertical"
            initialValues={initialValues}
            resource={'users'}
        >

            <Row gutter={16} >
                <Col span={12} offset={6}>
                    <Upload.Dragger
                        {...uploadProps}
                        maxCount={1}
                        listType="picture-card"
                        style={{ maxHeight: 230, maxWidth: 230 }}
                        onRemove={() => setImage(null)}
                        showUploadList={false}
                    >

                        <Space direction="vertical">


                            {
                                !image &&
                                <Avatar
                                    size={150}
                                    icon={<Icons.UserOutlined />}
                                />
                            }

                            {
                                image &&

                                <Avatar
                                    size={200}
                                    src={`${apiUrl}/file/restore/${image.id}`}
                                    alt="Store Location"
                                />
                            }

                            {
                                !image &&

                                <Text
                                    style={{
                                        fontWeight: 800,
                                        fontSize: "16px",
                                        marginTop: "8px",
                                    }}
                                >
                                    {t(
                                        "phrases.addPicture",
                                    )}
                                </Text>
                            }


                        </Space>

                    </Upload.Dragger>
                </Col>
            </Row>

            <Divider></Divider>

            <Row gutter={[64, 0]} wrap>
                <Col xs={24} lg={24}>




                    <Form.Item
                        label={t("users.fields.name")}
                        name="name"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label={t("users.fields.email")}
                        name="email"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Input type="email" />
                    </Form.Item>

                    <Checkbox onChange={onChange} style={{marginBottom:5}}>{t('phrases.updatePassword')}</Checkbox>

                    {
                        changePassword &&
                        <Form.Item
                            label={t("users.fields.plainPassword")}
                            name="plainPassword"
                            rules={[
                                {
                                    required: initialValues?.id ? false : true,
                                    min: 8,
                                },
                            ]}
                        >
                            <Input type="password" />
                        </Form.Item>
                    }

                </Col>
            </Row>
        </Form>
    </Edit>
};