import { Col, Row } from "antd";
import { ToolInformationDto } from "../../models"
import { ToolItem } from "./tool-item";

export interface IToolListProps {
    tools: ToolInformationDto[],
    colspan?: number
}
export const ToolList = (props: IToolListProps) => {
    const {tools, colspan} = props;

    return (
        <Row>
            {
                tools.map(t => <Col span={colspan ?? 4}>
                    <ToolItem key={t.id} tool={t} />
                </Col>)
            }
        </Row>
    )
}