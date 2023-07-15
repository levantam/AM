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
        <Row gutter={{xs: 8, sm: 16, md: 24, lg: 32} }>
            {
                tools.map(t => <Col span={colspan ?? 4} key={t.id}>
                    <ToolItem tool={t} />
                </Col>)
            }
        </Row>
    )
}