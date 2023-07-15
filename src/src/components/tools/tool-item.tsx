import { Card, Space } from "antd";
import { ToolInformationDto } from "../../models";
import { CodeFilled } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { ToolCategory } from "../../constants";

export interface IToolProps {
    tool: ToolInformationDto;
}
export const ToolItem = (props: IToolProps) => {
    const navigate = useNavigate();
    const { tool } = props;

    const goDetail = () => {
        navigate(`/${tool.category}/show/${tool.id}`);
    }
    return (
        <Card bordered style={{margin: 4}} className="tool-item" onClick={goDetail}>
            <Space>
                <CodeFilled></CodeFilled>
                {tool.name}
            </Space>
        </Card>
    )
}