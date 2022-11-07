import { useList } from "@pankod/refine-core";

import {
    Select,
} from "@pankod/refine-antd";

const { Option } = Select;


export const SelectForm: React.FC = (props: any) => {

    const {resource, optionLabel, optionValue} = props;
    const listQueryResult = useList<any>({ resource: resource });

    return <Select showSearch
    filterOption={(input, option) =>
        (option!.children as unknown as string).toLowerCase().includes(input.toLowerCase())
    }
>
    {
        listQueryResult?.data &&
        listQueryResult.data.data.map((el: any) => <Option key={el.id} value={el[optionValue]}>{el[optionLabel]}</Option>)
    }
</Select>
};