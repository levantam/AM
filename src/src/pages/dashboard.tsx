import { Card } from "antd";
import { ToolList } from "../components/tools/tool-list";
import { AllToolsData } from "../tools/all-tool";

export const Dashboard = () => {
    const allTools = AllToolsData;
    return (
        <Card title="Danh sách ứng dụng miễn phí">
            <ToolList tools={allTools} colspan={6} />
        </Card>
    );
}