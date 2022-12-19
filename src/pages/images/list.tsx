import {
    useTranslate,
    IResourceComponentsProps,
    CrudFilters,
    HttpError,
    getDefaultFilter,
} from "@pankod/refine-core";

import {
    useSimpleList,
    Row,
    AntdList,
    Col,
    Form,
    Input,
    Icons,
    Typography,
    Drawer,
} from "@pankod/refine-antd";

const { Text } = Typography;
const { SearchOutlined } = Icons;

import {
    ImageItem, StatusFilter,
} from "../../components/image";

import { IImage } from "interfaces";
import { FilesForm } from "components/form/files";
import { useState } from "react";
import { ImageShow } from "./show";

export const ImageList: React.FC<IResourceComponentsProps> = () => {
    const t = useTranslate();
    const [open, setOpen] = useState(false);
    const [imageId, setImageId] = useState<number | null>(null);


    const { listProps, searchFormProps, filters, queryResult } = useSimpleList<
        IImage,
        HttpError,
        IImage
    >({
        pagination: { pageSize: 12, defaultCurrent: 2 },
        onSearch: ({ file, status }) => {

            const productFilters: CrudFilters = [];

            productFilters.push({
                field: "status",
                operator: "in",
                value: status?.length > 0 ? status : undefined,
            });

            productFilters.push({
                field: "file.originalName",
                operator: "contains",
                value: file?.originalName ? file?.originalName : undefined,
            });

            return productFilters;
        },

    });

    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };

    const showItem = (id: any) => {
        showDrawer();
        setImageId(id);
    }

    return (
        <>
            <FilesForm onChange={(e: any) => { queryResult.refetch() }} form={null} name="images" accept=".jpg,.png" maxFiles={200} label={""} listType="picture"></FilesForm>

            <Form
                {...searchFormProps}
                onValuesChange={() => {
                    searchFormProps.form?.submit();
                }}
                initialValues={{
                    file: {
                        originalName: getDefaultFilter("file.originalName", filters, "contains"),
                    },
                    status: getDefaultFilter("status", filters, "in"),
                }}
            >
                <Row
                    gutter={[16, 16]}
                    style={{ background: "#fff", padding: "16px 24px" }}
                >
                    <Col xs={24} sm={20}>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                flexWrap: "wrap",
                                gap: "8px",
                                marginBottom: "16px",
                            }}
                        >
                            <Text style={{ fontSize: "24px" }} strong>
                                {t("words.images")}
                            </Text>
                            <Form.Item name={["file", "originalName"]} noStyle>
                                <Input
                                    style={{
                                        width: "400px",
                                    }}
                                    placeholder={t("phrases.imageSearch")}
                                    suffix={<SearchOutlined />}
                                />
                            </Form.Item>
                            <div></div>
                        </div>
                        <AntdList
                            grid={{
                                gutter: 8,
                                xs: 1,
                                sm: 1,
                                md: 2,
                                lg: 3,
                                xl: 4,
                                xxl: 4,
                            }}
                            style={{
                                height: "100%",
                                overflow: "auto",
                                paddingRight: "4px",
                            }}
                            {...listProps}
                            renderItem={(item) => (
                                <ImageItem item={item} showItem={showItem} />
                            )}
                        />
                    </Col>
                    <Col xs={0} sm={4}>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                height: "40px",
                                marginBottom: "16px",
                            }}
                        >
                            <Text style={{ fontWeight: 500 }}>
                                {t("phrases.tagFilterDescription")}
                            </Text>
                        </div>
                        <Form.Item name="status">
                            <StatusFilter />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>

            <Drawer title={t('phrases.imageVisualization')}
                destroyOnClose={true}
                placement="right"
                bodyStyle={{ padding: 0 }}
                width={"50%"}
                zIndex={1001}
                onClose={onClose}
                visible={open}>
                <ImageShow id={imageId} updateList={() => {queryResult.refetch()}} />
            </Drawer>
        </>
    );
};
