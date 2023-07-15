import { IResourceComponentsProps } from "@refinedev/core";
import { Button, Card, Col, Row } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { AllToolsData } from "../../tools/all-tool";
import { ToolEnum } from "../../constants";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { VNGrossNetCalculation } from "../../tools/hr/vn-gross-net-calculation";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeftLong } from '@fortawesome/free-solid-svg-icons'
import { ShareButton } from "../../components/share-button";

export const HrToolShow: React.FC<IResourceComponentsProps> = () => {
  let { id } = useParams();
  const navigate = useNavigate();
  const tool = AllToolsData.find(t => t.id == id);

  const renderTool = () => {
    switch (tool?.id) {
      case ToolEnum.GrossNetCalculation:
        return <VNGrossNetCalculation />
      default:
        return <div>Not found</div>
    }
  }

  return (
    <Card
      style={{ minHeight: 500, background: tool?.background ?? 'white' }}
    >
      <Row>
        <Col span={16}>
          <h2>
            <FontAwesomeIcon icon={faArrowLeftLong} style={{ marginRight: 20, cursor: 'pointer' }} onClick={() => { navigate(`/${tool?.category}`) }} />
            {tool?.name}
          </h2>
        </Col>
        <Col span={8} style={{textAlign: 'right'}}>
          <ShareButton />
        </Col>
      </Row>
      {renderTool()}
    </Card>
  )
};
