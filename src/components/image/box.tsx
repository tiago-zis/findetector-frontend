import { Button, Dropdown, Menu, Radio, Typography } from "@pankod/refine-antd";
import { useTranslate } from "@pankod/refine-core";
import { IImageBoxProps } from "interfaces";
import { DownloadOutlined } from '@ant-design/icons';
import { useEffect, useState } from "react";
const { Text } = Typography;

export const ImageBox: React.FC<IImageBoxProps> = ({
    imageWidth,
    imageHeight,
    offsetWidth,
    offsetHeight,
    p1,
    p2,
    id,
    isValid,
    score,
    checkValidCallback,
    downloadCallBack
}) => {
    const widthDiff = 1.0 - (offsetWidth / imageWidth);
    const heightDiff = 1.0 - (offsetHeight / imageHeight);
    const left = (p1.x - (p1.x * widthDiff));
    const top = (p1.y - (p1.y * heightDiff));
    const width = (p2.x - p1.x) - ((p2.x - p1.x) * widthDiff);
    const height = (p2.y - p1.y) - ((p2.y - p1.y) * heightDiff);

    const t = useTranslate();
    const [value, setValue] = useState<boolean|null>(null);

    useEffect(() => {
        setValue(isValid);
    }, [isValid])

    const menu = (
        <Menu>
            <Menu.Item key={1}>
                <Text ellipsis strong>
                    {`${t('words.confidence')}: ${score ? (score * 100).toFixed(2) : 0}%`}
                </Text>
            </Menu.Item>
            <Menu.Item key={2}>
                <Text ellipsis strong style={{marginRight: 10}}>
                    {t('phrases.isValidDetection')}
                </Text>
                <Radio.Group onChange={(e: any) => {
                    checkValidCallback(e, id);
                    setValue(e.target.value);
                }} value={value}>
                    <Radio value={true}>{t("words.yes")}</Radio>
                    <Radio value={false}>{t("words.no")}</Radio>
                </Radio.Group>

            </Menu.Item>
            <Menu.Item key={3}>
                <Button icon={<DownloadOutlined />} onClick={() => downloadCallBack(id)}>{t('words.download')}</Button>
            </Menu.Item>
        </Menu>
    );

    return (
        <Dropdown overlay={menu} placement="bottomLeft">
            <div
                style={{
                    width: `${width}px`,
                    height: `${height}px`,
                    left: `${left}px`,
                    top: `${top}px`,
                    border: "solid",
                    borderColor: "#f0ffff",
                    position: "absolute",
                    zIndex: "1000",
                    cursor: "pointer"
                }}
            ></div>
        </Dropdown>
    );
};