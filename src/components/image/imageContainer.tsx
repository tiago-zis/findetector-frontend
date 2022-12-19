import { useTranslate, useApiUrl, useCustomMutation, useNotification } from "@pankod/refine-core";
import { IImageBoxProps } from "interfaces";
import { useEffect, useRef, useState } from "react";
import { ImageBox } from "./box";

type ImageItemProps = {
    id: number;
    fileName: string;
    data: any;
    updateCallback: (() => void)
};

export const ImageContainer: React.FC<ImageItemProps> = ({
    id,
    fileName,
    data,
    updateCallback
}) => {
    const t = useTranslate();
    const apiUrl = useApiUrl();
    const imgRef: any = useRef(null);
    const [boxes, setBoxes] = useState<any>([]);
    const boxList = useRef<any[]>([]);
    const { mutate } = useCustomMutation();
    const { open } = useNotification();

    useEffect(() => {
        window.addEventListener('resize', function () {
            imageOnLoad();
        });
    }, [])

    const downloadCallBack = (uid: string) => {

        mutate(
            {
                url: `${apiUrl}/image/crop`,
                method: "post",
                values: {
                    id: id,
                    uid: uid
                }
            },
            {
                onSuccess: (data, variables, context) => {
                    let base64: any = data.data;
                    const type = base64.split(';')[0].split('/')[1];
                    let a = document.createElement("a");
                    a.href = base64;
                    a.download = `${uid}.${type}`;
                    a.click();
                },
            }
        );

    }

    const checkValidCallback = (e: any, uid: string) => {
        const isValid = e.target.value;

        mutate(
            {
                url: `${apiUrl}/image/isvalid`,
                method: "post",
                values: {
                    id: id,
                    uid: uid,
                    valid: isValid
                }
            },
            {
                onSuccess: (data, variables, context) => {
                    const values: any = data.data;
                    const list = boxList.current;

                    list.map((item: any) => {
                        if (item.id === values.uid) {
                            item.isValid = isValid;
                        }
                    })

                    boxList.current = [...list];
                    console.log(boxList.current)
                    setBoxes([...boxList.current])

                    open?.({
                        message: t('phrases.isValidDetectionMessage'),
                        type: 'success',
                        description: t('words.success')
                    })

                    updateCallback();
                },
            }
        );

    }

    const imageOnLoad = () => {

        let list: any = [];
        const width = data?.width || 0;
        const height = data?.height || 0;

        if (data?.boxes) {

            data?.boxes.map((e: any, i: number) => list.push(
                {
                    imageWidth: width,
                    imageHeight: height,
                    offsetHeight: imgRef.current?.offsetHeight,
                    offsetWidth: imgRef.current?.offsetWidth,
                    p1: e.p1,
                    p2: e.p2,
                    id: e.uid,
                    isValid: e.valid,
                    score: data?.scores[i],
                    downloadCallBack,
                    checkValidCallback
                }
            ))

        }

        boxList.current = [...list];
        setBoxes([...boxList.current]);
    }

    return (


        <div className="ant-image" style={{ width: "80%" }}>

            <img ref={imgRef} onLoad={imageOnLoad} src={`${apiUrl}/image/restore/${id}`}
                alt={fileName} className="ant-image-img" />


            {
                imgRef.current && <span />
            }

            {boxes.map((e: IImageBoxProps, i: any) => <ImageBox key={i}
                {...e}
            />)}
        </div>

    );
};
