import "./style.less";
import { MenuIcon } from "components";
import { useTranslate } from "@pankod/refine-core";

type TitleProps = {
    collapsed: boolean;
};

export const Title: React.FC<TitleProps> = ({ collapsed }) => {
    const t = useTranslate();

    return (
        <div className="logo">
            {collapsed ? (
                <MenuIcon style={{ color: "white" }} />
            ) : (
                <h1 className="ant-typography" style={{width:'100%', textAlign:'center', color:"#ffffff", marginTop:15, fontSize:28}}>{t('words.FinDetector')}</h1>
            )}
        </div>
    );
};
