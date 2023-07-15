import { IResourceComponentsProps } from "@refinedev/core";
import { Card } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { AllToolsData } from "../../tools/all-tool";
import { ToolEnum } from "../../constants";
import { GuidGenerator } from "../../tools/dev/guid-generator";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {  faArrowLeftLong } from '@fortawesome/free-solid-svg-icons'

export const DevToolShow: React.FC<IResourceComponentsProps> = () => {
  let { id } = useParams();
  const navigate = useNavigate();
  const tool = AllToolsData.find(t => t.id == id);

  const renderTool = () => {
    switch (tool?.id) {
      case ToolEnum.GUIDGenerator:
        return <GuidGenerator />
      default:
        return <div>Not found</div>
    }
  }

  return (
    <Card style={{ minHeight: 500 }}>
      <h2>
        <FontAwesomeIcon icon={faArrowLeftLong} style={{ marginRight: 20, cursor: 'pointer'  }} onClick={() => { navigate(`/${tool?.category}`) }} />
        {tool?.name}
      </h2>
      {renderTool()}
    </Card>
  )
};
