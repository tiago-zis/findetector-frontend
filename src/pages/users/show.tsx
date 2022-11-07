import { useShow, useTranslate } from "@pankod/refine-core";
import { Show, Typography, TagField } from "@pankod/refine-antd";
import { IUser } from "interfaces";
const { Title, Text } = Typography;

export const UserShow: React.FC = () => {
    const { queryResult } = useShow<IUser>();
    const { data, isLoading } = queryResult;
    const record = data?.data;
    const t = useTranslate();

    return (
        <Show isLoading={isLoading}>
            <Title level={5}>{t('users.fields.id')}</Title>
            <Text>{record?.id}</Text>

            <Title level={5}>{t('users.fields.name')}</Title>
            <Text>{record?.name}</Text>

            <Title level={5}>{t('users.fields.email')}</Title>
            <Text>{record?.email}</Text>

            <Title level={5}>{t('users.fields.enabled')}</Title>
            <Text>{record?.enabled === true ? t('words.yes') : t('words.no')}</Text>
        </Show>
    );
};