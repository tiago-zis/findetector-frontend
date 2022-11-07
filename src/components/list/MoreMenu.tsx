import {
    useTranslate,
    useNavigation,
    useDelete,
} from "@pankod/refine-core";

import {
    Menu,
    Icons,
    Popconfirm,
} from "@pankod/refine-antd";

;

const { FormOutlined, EyeFilled, DeleteFilled } = Icons;

interface Props {
    id: number;
    resource: string;
    canEdit?: boolean;
    canDelete?: boolean;
    canShow?: boolean;
}


export const MoreMenu: React.FC<Props> = ({ id, resource, canEdit = true, canDelete = false, canShow = true }) => {

    const { edit, show } = useNavigation();
    const t = useTranslate();
    const { mutate: mutateDelete } = useDelete();

    return <Menu mode="vertical">
        {
            canEdit &&

            <Menu.Item
                key="1"
                style={{
                    fontSize: 15,
                    fontWeight: 500,
                }}
                icon={
                    <FormOutlined
                        style={{ color: "green", fontSize: "15px" }}
                    />
                }
                onClick={() => edit(resource, id)}
            >
                {t("buttons.edit")}
            </Menu.Item>
        }


        {
            canShow &&

            <Menu.Item
                key="2"
                style={{
                    fontSize: 15,
                    fontWeight: 500,
                }}
                icon={
                    <EyeFilled
                        style={{ color: "green", fontSize: "15px" }}
                    />
                }
                onClick={() => show(resource, id)}
            >
                {t("buttons.show")}
            </Menu.Item>
        }


        {
            canDelete &&

            <Popconfirm
                title={t('phrases.deleteConfirmation')}
                onConfirm={() => {
                    mutateDelete({
                        resource: resource,
                        id,
                        mutationMode: "undoable",
                    });
                }}
                onCancel={() => { }}
                okText={t('words.yes')}
                cancelText={t('words.no')}
            >

                <Menu.Item
                    key="3"
                    style={{
                        fontSize: 15,
                        fontWeight: 500,
                    }}
                    icon={
                        <DeleteFilled
                            style={{ color: "red", fontSize: "15px" }}
                        />
                    }
                >
                    {t("buttons.delete")}
                </Menu.Item>
            </Popconfirm>
        }

    </Menu>
}
