import { LinkedinOutlined } from "@ant-design/icons"
import { Card, Descriptions, Space } from "antd"

export const AboutPage = () => {
    return (
        <Card>
            <Descriptions title="About" layout="vertical" column={2}>
                <Descriptions.Item span={2}>
                    <Space direction="vertical" style={{width: '50%'}}>
                    <p>This is a free tools website that helps others have productive work. We offer a variety of tools and resources that can help you improve your productivity. 
                        I believe that everyone has the potential to be productive, and we are here to help you reach your full potential. So if you're looking for ways to improve your productivity, be sure to check out our website!</p>
                    </Space>
                </Descriptions.Item>
                <Descriptions.Item label="Email" span={1}>
                    cvtamle@gmail.com
                </Descriptions.Item>
                <Descriptions.Item label="Location" span={1}>
                    Ho Chi Minh City, Vietnam
                </Descriptions.Item>
                <Descriptions.Item label={"LinkedIn"}>
                     <a href="https://www.linkedin.com/in/lvtam/" target="_blank">https://www.linkedin.com/in/lvtam/</a>
                </Descriptions.Item>
            </Descriptions>
        </Card>
    )
}