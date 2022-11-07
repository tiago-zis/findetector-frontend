import {
    useTranslate,
    IResourceComponentsProps,
    useNavigation,
} from "@pankod/refine-core";

import {
    List,
    Table,
    useTable,
    Dropdown,
    Menu,
    Icons,
} from "@pankod/refine-antd";

import { IUser } from "interfaces";

const { FormOutlined, EyeFilled } = Icons;

export const UserList: React.FC<IResourceComponentsProps> = () => {
    const { tableProps } = useTable<IUser>();
    const { edit, show } = useNavigation();
    const t = useTranslate();

    const moreMenu = (id: number) => (
        <Menu mode="vertical">
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
                onClick={() => edit("users", id)}
            >
                {t("buttons.edit")}
            </Menu.Item>

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
                onClick={() => show("users", id)}
            >
                {t("buttons.show")}
            </Menu.Item>
        </Menu>
    );

    return (
        <>
            <List>
                <Table {...tableProps} rowKey="id">
                    <Table.Column
                        dataIndex="id"
                        align="center"
                        title={t("users.fields.id")}
                    />

                    <Table.Column
                        dataIndex="name"
                        title={t("users.fields.name")}
                    />

                    <Table.Column
                        dataIndex="email"
                        title={t("users.fields.email")}
                    />

                    <Table.Column
                        dataIndex="isVerified"
                        title={t("users.fields.isVerified")}
                        render={((value: boolean) => value === true ? t('words.yes') : t('words.no'))}
                    />
                    
                    <Table.Column
                        dataIndex="enabled"
                        title={t("users.fields.enabled")}
                        render={((value: boolean) => value === true ? t('words.yes') : t('words.no'))}
                    />

                    <Table.Column<IUser>
                        fixed="right"
                        title={t("table.actions")}
                        dataIndex="actions"
                        key="actions"
                        align="center"
                        render={(_, record) => (
                            <Dropdown
                                overlay={moreMenu(record.id)}
                                trigger={["click"]}
                            >
                                <Icons.MoreOutlined
                                    style={{
                                        fontSize: 24,
                                    }}
                                />
                            </Dropdown>
                        )}
                    />
                </Table>
            </List>

        </>
    );
};
