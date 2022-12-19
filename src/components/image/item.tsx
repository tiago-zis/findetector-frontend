import { useTranslate, useApiUrl } from "@pankod/refine-core";

import {
    Card,
    Divider,
    InputNumber,
    Icons,
    Dropdown,
    Menu,
    Typography,
    Image,
    TagField,
} from "@pankod/refine-antd";

const { Text, Paragraph } = Typography;
const { CloseCircleOutlined, EyeOutlined, CheckOutlined, UploadOutlined, LoadingOutlined } = Icons;
import moment from "moment";
import { IImage } from "interfaces";

type ImageItemProps = {
    item: IImage;
    updateStock?: (changedValue: number, clickedImage: IImage) => void;
    showItem: (id?: number) => void;
};

export const ImageItem: React.FC<ImageItemProps> = ({
    item,
    updateStock,
    showItem,
}) => {
    const t = useTranslate();
    const apiUrl = useApiUrl();

    return (
        <Card
            style={{
                margin: "8px",
            }}
            bodyStyle={{ height: "350px" }}
        >
            <div style={{ position: "absolute", top: "10px", right: "5px" }}>
                <Dropdown
                    overlay={
                        <Menu mode="vertical">
                            {updateStock && (
                                <Menu.Item
                                    key="1"
                                    style={{
                                        fontWeight: 500,
                                    }}
                                    icon={
                                        <CloseCircleOutlined
                                            style={{
                                                color: "red",
                                            }}
                                        />
                                    }
                                    onClick={() => updateStock(0, item)}
                                >
                                    {t("stores.buttons.outOfStock")}
                                </Menu.Item>
                            )}
                            <Menu.Item
                                key="2"
                                style={{
                                    fontWeight: 500,
                                }}
                                icon={
                                    <EyeOutlined
                                        style={{
                                            color: "green",
                                        }}
                                    />
                                }
                                onClick={() => showItem(item.id)}
                            >
                                {t("actions.show")}
                            </Menu.Item>
                        </Menu>
                    }
                    trigger={["click"]}
                >
                    <Icons.MoreOutlined
                        style={{
                            fontSize: 24,
                        }}
                    />
                </Dropdown>
            </div>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    height: "100%",
                }}
            >
                <div style={{ textAlign: "center" }}>
                    <Image
                        width={'80%'}
                        src={`${apiUrl}/image/restore/${item.id}`}
                        alt={item.file.originalName}
                    />
                </div>
                <Divider />
                <Paragraph
                    ellipsis={{ rows: 2, tooltip: true }}
                    style={{
                        fontSize: "14px",
                        fontWeight: 800,
                        marginBottom: "8px",
                    }}
                >
                    {item.file.originalName}
                </Paragraph>
                <Paragraph
                    ellipsis={{ rows: 3, tooltip: true }}
                    style={{ marginBottom: "8px" }}
                >
                    {`${t('images.fields.creationDate')}: ${moment(item.creationDate).format('DD/MM/YYYY HH:mm')}`}
                </Paragraph>



                <Text
                    className="item-id"
                    style={{
                        fontSize: "18px",
                        fontWeight: 700,
                        color: "#999999",
                    }}
                >
                    {
                        item.status === 'uploaded' &&
                        <TagField icon={<UploadOutlined />} color="blue" value={t(`words.${item.status}`)} />
                    }

                    {
                        item.status === 'processing' &&
                        <TagField icon={<LoadingOutlined />} color="yellow" value={t(`words.${item.status}`)} />
                    }

                    {
                        item.status === 'finished' &&
                        <TagField icon={<CheckOutlined />} color="green" value={t(`words.${item.status}`)} />
                    }

                </Text>

                {updateStock && (
                    <div id="stock-number">
                        <InputNumber
                            size="large"
                            keyboard
                            min={0}
                            value={0}
                            onChange={(value: number | null) =>
                                updateStock(value ?? 0, item)
                            }
                            style={{ width: "100%" }}
                        />
                    </div>
                )}
            </div>
        </Card>
    );
};
