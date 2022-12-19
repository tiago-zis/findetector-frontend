import { useEffect, useState } from "react";
import { useTranslate } from "@pankod/refine-core";

import { Button, Space } from "@pankod/refine-antd";
import { STATUS_CHOICES } from '../../helpers/constants';

type StatusItemProps = {
    value?: string[];
    onChange?: (value: string[]) => void;
};

export const StatusFilter: React.FC<StatusItemProps> = ({
    onChange,
    value,
}) => {
    const t = useTranslate();

    const [filterStatus, setFilterStatus] = useState<string[]>(
        value ?? [],
    );

    useEffect(() => {
        if (filterStatus.length > 0) {
            onChange?.(filterStatus);
        }
    }, [filterStatus]);

    const toggleFilter = (clickedItem: string) => {
        const target = filterStatus.findIndex(
            (category) => category === clickedItem,
        );

        if (target < 0) {
            setFilterStatus((prev) => {
                return [...prev, clickedItem];
            });

            onChange?.([...filterStatus, clickedItem]);
        } else {            
            const copyFilterStatus = [...filterStatus];
            copyFilterStatus.splice(target, 1);
            setFilterStatus(copyFilterStatus);
            onChange?.(copyFilterStatus);
        }        
    };


    return (
        <Space wrap>
            <Button
                shape="round"
                type={filterStatus.length === 0 ? "primary" : "default"}
                onClick={() => {
                    setFilterStatus([]);
                    onChange?.([]);
                }}
            >
                {t("words.all")}
            </Button>
            {STATUS_CHOICES.map((val) => (
                <Button
                    key={val.value}
                    shape="round"
                    type={
                        filterStatus.includes(val.value.toString())
                            ? "primary"
                            : "default"
                    }
                    onClick={() => toggleFilter(val.value.toString())}
                >
                    {t(val.name)}
                </Button>
            ))}
        </Space>
    );
};
