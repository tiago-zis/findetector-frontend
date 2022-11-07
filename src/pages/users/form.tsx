import { HttpError, IResourceComponentsProps, useTranslate } from "@pankod/refine-core";

import {
    Create,
    Form,
    useForm,
    Row,
    Col,
    Edit,
    Input,
} from "@pankod/refine-antd";

import { IUser } from "interfaces";
import { useFromErrorsProviver } from '../../helpers/formErrorsProvider';

const FormComponent = (props: any) => {
    const t = useTranslate();
    const { formProps } = props;
    const { initialValues } = formProps;
    
    let roles = initialValues?.roles || [];

    return <Form
        {...formProps}
        layout="vertical"
        initialValues={
            {
                name: initialValues?.name,
                email: initialValues?.email,
                type: roles.filter((e: any) => e !== 'ROLE_USER')
            }
        }
    >
        <Row gutter={[64, 0]} wrap>
            <Col xs={24} lg={8}>
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

                {
                    !initialValues?.id &&
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


}

export const UserForm: React.FC<IResourceComponentsProps> = (props: any) => {

    const { formProps, form, saveButtonProps, queryResult, id } = useForm<IUser>({
        onMutationError: (httpError: HttpError) => {
            form?.setFields(useFromErrorsProviver(httpError));
        }
    });

    saveButtonProps.size = 'large';

    if (id) {
        return <Edit
            isLoading={queryResult?.isFetching}
            saveButtonProps={saveButtonProps}
            recordItemId={id}
        >
            <FormComponent formProps={formProps} />
        </Edit>
    }

    return (
        <Create
            isLoading={queryResult?.isFetching}
            saveButtonProps={saveButtonProps}
        >
            <FormComponent formProps={formProps} />
        </Create>
    );
};