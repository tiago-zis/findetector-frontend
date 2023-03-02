import React, { useEffect, useState } from 'react';

import {
    Checkbox,
    Col,
    Form,
    Input,
    Modal,
    Row,
    Typography,
    useForm
} from "@pankod/refine-antd";
import { HttpError, useLogout, useTranslate } from '@pankod/refine-core';
import { Constants } from 'helpers/constants';
import { useFromErrorsProviver } from 'helpers/formErrorsProvider';
const { Paragraph, Text } = Typography;

export const TermsOfUseModal: React.FC = (props: any) => {

    const [visible, setVisible] = useState(false);
    const [terms, setTerms] = useState<any>({});
    const [accept, setAccept] = useState(false);
    const { mutate } = useLogout();
    const t = useTranslate();

    const { formProps, form, saveButtonProps } = useForm<any>({
        onMutationError: (httpError: HttpError) => {
            form?.setFields(useFromErrorsProviver(httpError));
        },
        onMutationSuccess: (data, variables: any, context) => {
            try {
                let profile = JSON.parse(localStorage.getItem(Constants.AUTH_KEY) || '');
                profile['termsOfUse'] = null;
                localStorage.setItem(Constants.AUTH_KEY, JSON.stringify(profile));
                setVisible(false);
            } catch (error) {
                mutate();
            }                        
        },
        successNotification(data, values, resource) {
            return {
                message: `${t('phrases.termsOfUseAccepted')}`,
                description: `${t('phrases.termsOfUse')}`,
                type: "success",
            };
        },
        resource: "termsofuse/accept",
        action: "create",
        redirect: false
    });

    const handleOk = () => {
        form.submit();
    };

    const handleCancel = () => {
        mutate();
    }

    useEffect(() => {
        init();
    }, [])

    const init = () => {
        try {
            const profile = JSON.parse(localStorage.getItem(Constants.AUTH_KEY) || '');

            if (profile?.termsOfUse) {
                setVisible(true);
                const termsOfUse = profile.termsOfUse;
                setTerms(termsOfUse);
            }
        } catch (error) { 
            mutate();
         }

    }

    return <Modal
        title={`${t('phrases.termsOfUse')}`}
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        cancelText={t('buttons.cancel')}
        okText={t('buttons._confirm')}
        bodyStyle={{ maxHeight: 400, overflow: 'auto' }}
        okButtonProps={{ disabled: !accept }}
    >

        <Form
            {...formProps}
            layout="vertical"
            resource={'users'}
            initialValues={{
                id: terms?.id,
            }}
        >

            <Form.Item
                name="id"
                noStyle={true}
            >
                <Input type='hidden' />
            </Form.Item>

            {
                accept && <Form.Item
                    name="accept"
                    noStyle={true}
                    initialValue={1}
                >
                    <Input type='hidden' />
                </Form.Item>
            }

            <Row gutter={16} >
                <Col span={24}>
                    <Text>{terms?.content}</Text>
                    <Paragraph strong style={{ marginTop: 10, textAlign: 'right', color: 'rgba(0, 0, 0, 0.60)' }}>{`${t('words.version')} ${terms?.version}`}</Paragraph>
                </Col>

                <Col span={24} style={{ marginTop: 20 }}>
                    <Form.Item
                        name="acceptConfirmation"
                        noStyle={true}
                        getValueFromEvent={(e) => setAccept(e.target.checked)}
                    >
                        <Checkbox>{t('phrases.acceptTheTerms')}</Checkbox>
                    </Form.Item>
                </Col>
            </Row>
        </Form>

    </Modal>
};