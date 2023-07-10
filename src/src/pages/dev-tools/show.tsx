import { IResourceComponentsProps } from "@refinedev/core";
import { AntdShowInferencer } from "@refinedev/inferencer/antd";
import { Card } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { AllToolsData } from "../../tools/all-tool";
import { ToolEnum } from "../../constants";
import { GuidGenerator } from "../../tools/guid-generator";
import { ArrowLeftOutlined } from "@ant-design/icons";

export const DevToolShow: React.FC<IResourceComponentsProps> = () => {
  let { id } = useParams();
  const navigate = useNavigate();
  const tool = AllToolsData.find(t => t.id == id);

  const renderTool = () => {
    switch (tool?.id) {
      case ToolEnum.GUIDGenerator:
        return <GuidGenerator />
        defauld:
        return <div>Not found</div>
    }
  }

  return (
    <Card style={{ minHeight: 500 }}>
      <h2>
        <ArrowLeftOutlined style={{marginRight: 20}} onClick={() => {navigate(`/${tool?.category}`)}} />
        {tool?.name}
        </h2>
      {renderTool()}
    </Card>
  )
};
