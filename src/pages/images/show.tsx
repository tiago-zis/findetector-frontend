import { useShow } from "@pankod/refine-core";
import { Show } from "@pankod/refine-antd";
import { IImage } from "interfaces";
import { useEffect } from "react";

import {
    ShowItem
} from "../../components/image";

export interface IShowProps {
    id: number | null;
    updateList: (() => void)
}

export const ImageShow: React.FC<IShowProps> = ({ id, updateList }) => {
    const { queryResult, setShowId } = useShow<IImage>();
    const { data, isLoading } = queryResult;
    const record: any = data?.data;

    useEffect(() => {
        if (id) {
            setShowId(id);
        }
    }, [id])

    return (
        <Show
            breadcrumb={<></>}
            title=""
            isLoading={isLoading}
            headerButtons={<></>}
        >

            <ShowItem item={record} updateList={updateList} />
        </Show>
    );
};