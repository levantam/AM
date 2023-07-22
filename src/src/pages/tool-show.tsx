import { IResourceComponentsProps } from "@refinedev/core";
import { Card, Col, Row } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeftLong } from '@fortawesome/free-solid-svg-icons'
import { AllToolsData } from "../tools/all-tool";
import { VNGrossNetCalculation } from "../tools/hr/vn-gross-net-calculation";
import { ToolEnum } from "../constants";
import { GuidGenerator } from "../tools/dev/guid-generator";
import { ShareButton } from "../components/share-button";
import { BranchNameGenerator } from "../tools/dev/branch-name-generator";

export const ToolShow: React.FC<IResourceComponentsProps> = () => {
    let { id } = useParams();
    const navigate = useNavigate();
    const tool = AllToolsData.find(t => t.id == id);

    const renderTool = () => {
        switch (tool?.id) {
            // dev tools
            case ToolEnum.GUIDGenerator:
                return <GuidGenerator />
            case ToolEnum.BranchNameCreator:
                return <BranchNameGenerator />

            // HR tools
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
                <Col span={8} style={{ textAlign: 'right' }}>
                    <ShareButton />
                </Col>
            </Row>
            {renderTool()}
        </Card>
    )
};
