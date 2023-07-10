import { IResourceComponentsProps } from "@refinedev/core";
import { Card } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { AllToolsData } from "../../tools/all-tool";
import { ToolEnum } from "../../constants";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { VNGrossNetCalculation } from "../../tools/hr/vn-gross-net-calculation";

export const HrToolShow: React.FC<IResourceComponentsProps> = () => {
  let { id } = useParams();
  const navigate = useNavigate();
  const tool = AllToolsData.find(t => t.id == id);

  const renderTool = () => {
    switch (tool?.id) {
      case ToolEnum.GrossNetCalculation:
        return <VNGrossNetCalculation />
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
