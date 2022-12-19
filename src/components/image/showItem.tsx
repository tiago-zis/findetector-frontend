import { useTranslate } from "@pankod/refine-core";

import {
    Card,
    Divider,
    InputNumber,
    Icons,
    Typography,
    TagField,
} from "@pankod/refine-antd";

const { Text, Paragraph } = Typography;
const { CheckOutlined, UploadOutlined, LoadingOutlined } = Icons;
import moment from "moment";
import { IImage} from "interfaces";
import { ImageContainer } from "./imageContainer";

type ImageItemProps = {
    item: IImage;
    updateList: (() => void)
    updateStock?: (changedValue: number, clickedProduct: IImage) => void;
};

export const ShowItem: React.FC<ImageItemProps> = ({
    item,
    updateList,
    updateStock,
}) => {
    const t = useTranslate();

    if (!item)
        return <></>

    return (
        <Card>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    height: "100%",
                }}
            >
                <div style={{ textAlign: "center" }}>
                    <ImageContainer id={item.id} fileName={item.file.originalName} data={item?.processedData} updateCallback={updateList} />
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

                {
                    item.status === 'finished' &&
                    <Paragraph
                        ellipsis={{ rows: 3, tooltip: true }}
                        style={{ marginBottom: "8px" }}
                    >
                        {`${t('images.fields.processingDate')}: ${moment(item.processingDate).format('DD/MM/YYYY HH:mm')}`}
                    </Paragraph>
                }



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
