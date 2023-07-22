import { Button, Checkbox, Form, InputNumber, Space, Input, Row, Col, notification, Tag } from "antd"
const { TextArea } = Input;
import React, { useMemo } from "react";
import { useState } from "react";
import { v4 as uuidv4 } from 'uuid';

const Context = React.createContext({ name: 'Default' });

export const GuidGenerator = () => {
    const [api, contextHolder] = notification.useNotification();

    const [form] = Form.useForm();
    const [isGenerate, setIsGenerate] = React.useState<boolean>(false);
    const [generatedValue, setGeneratedValue] = React.useState<string>('');
    const [suggestNumbers, setSuggestNumbers] = React.useState<number[]>([1, 5, 10, 15, 20, 50, 100]);

    React.useEffect(() => {
        
    }, []);

    const onFinish = async (formValues: any) => {
        setIsGenerate(true);
        let generateValue = generateGuidList(formValues.number);
        generateValue = formValues.isUpper ? generateValue.toUpperCase() : generateValue;
        form.setFieldValue('generatedValue', generateValue);
        if (formValues.isCopyToClipboard) {
            await copyToClipboard(generateValue);
        }
    };
    const contextValue = useMemo(() => ({ name: 'Ant Design' }), []);

    const generateGuidList = (count: number): string => {
        let value: string[] = [];
        for (let i = 0; i < count; i++) {
            let data = uuidv4().toString();
            value.push(data);
        }
        return value.join('\n').toString();
    }

    const copyToClipboard = async (val: string) => {
        await navigator.clipboard.writeText(val);
        api.info({
            message: `Copied`,
            description: "Copied to the clipboard",
            placement: 'bottomRight',
        });
    }

    return (
        <Form
            form={form}
            layout="vertical"
            initialValues={{ number: 1, isUpper: true, isCopyToClipboard: true }}
            onFinish={onFinish}
        >
            {contextHolder}
            <Row>

                <Col span={10} style={{ padding: 10 }}>
                    <Form.Item name={"number"} label={<div>
                        Number of Guid to generate 
                        <Space size={[0, 8]} wrap style={{marginLeft: 10}}>
                        {
                            suggestNumbers.map(n => <Tag onClick={() => {form.setFieldValue('number', n)}} color="default" style={{cursor: 'pointer'}}>{n}</Tag>)
                        }
                    </Space>
                    </div>}>
                        <InputNumber style={{ width: '100%' }} autoFocus onPressEnter={onFinish} max={1000} min={0} />
                    </Form.Item>
                    
                    <Space direction="horizontal" style={{ marginBottom: 20 }}>
                        <Form.Item name={"isUpper"} valuePropName="checked" noStyle>
                            <Checkbox>Uppercase</Checkbox>
                        </Form.Item>
                        <Form.Item name={"isCopyToClipboard"} valuePropName="checked" noStyle>
                            <Checkbox>Copy to clipboard</Checkbox>
                        </Form.Item>
                    </Space>
                    <Form.Item name={"number"} >
                        <Button type="primary" htmlType="submit">
                            Generate
                        </Button>
                    </Form.Item>


                </Col>
                <Col span={14} style={{ padding: 10 }}>
                    {
                        isGenerate &&
                        <Form.Item name={"generatedValue"}>
                            <TextArea autoSize style={{ background: '#E6F4FF', color: 'black', width: "100%", maxHeight: 400, minHeight: 400 }}>
                            </TextArea>
                        </Form.Item>

                    }
                </Col>
            </Row>
        </Form>
    )
}