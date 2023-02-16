import "./style.less";
import { MenuIcon } from "components";

type TitleProps = {
    collapsed: boolean;
};

export const Title: React.FC<TitleProps> = ({ collapsed }) => {
    return (
        <div className="logo">
            {collapsed ? (
                <MenuIcon style={{ color: "white" }} />
            ) : (
                <h1 className="ant-typography" style={{width:'100%', textAlign:'center', color:"#ffffff", marginTop:15}}>Project</h1>
            )}
        </div>
    );
};
