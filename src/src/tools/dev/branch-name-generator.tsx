import { Button, Form, Input, Modal, Radio, Space, notification } from "antd";
import React from "react";
import { faCopy } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


interface BranchNameInput {
    type?: string,
    ticketId?: string,
    ticketTitle?: string
}
const Context = React.createContext({ name: 'Default' });
export const BranchNameGenerator = () => {
    const [api, contextHolder] = notification.useNotification();
    const [form] = Form.useForm<any>();
    const [branchTypes, setBranchType] = React.useState<string[]>(['feature', 'bug', 'hotfix', 'realease', 'chore']);
    const [generatedNames, setGeneratedNames] = React.useState<string[]>([]);

    const onFinish = () => {
        const formValue = form.getFieldsValue();
        const input: BranchNameInput = {
            ...formValue,
            ticketId: sanitizeInput(formValue.ticketId),
            ticketTitle: sanitizeInput(formValue.ticketTitle)
        }
        const names = generateBranchName(input)
        setGeneratedNames(names);
        if (names.length == 1) {
            copyToClipboard(names[0]);
        }
    }

    const sanitizeInput = (str?: string) => {
        return str ? str.replace(/[^a-zA-Z0-9 ]/g, '') : '';
    }

    const generateBranchName = (input: BranchNameInput): string[] => {
        const result: string[] = [
            defaultGenerateMethod(input),
            defaultGenerateMethod(input, false)
        ];
        return result;
    }

    const copyToClipboard = async (val: string) => {
        await navigator.clipboard.writeText(val);
        api.info({
            message: `Copied`,
            description: "Copied to the clipboard",
            placement: 'bottomRight',
        });
    }

    const defaultGenerateMethod = (input: BranchNameInput, includeType: boolean = true, includeTicketId: boolean = true, includeTitle: boolean = true): string => {
        let result = '';

        if (input.type && includeType) {
            result = `${result}${input.type}/`;
        }
        if (input.ticketId && includeTicketId) {
            result = `${result}${input.ticketId}-`;
        }
        if (input.ticketTitle && includeTitle) {
            result = `${result}${input.ticketTitle.replaceAll(" ", "-").replaceAll("--", "-")}`;
        }

        return result.toLowerCase();
    }


    return (
        <Space direction="vertical">
            {contextHolder}
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                initialValues={{ type: 'feature' }}
            >
                <Form.Item name={"type"} label="Branch type">
                    <Radio.Group>
                        {
                            branchTypes.map(t => <Radio.Button key={t} value={t}>{t}</Radio.Button>)
                        }
                    </Radio.Group>
                </Form.Item>
                <p>Ticket Information</p>
                <Space.Compact style={{ width: '100%' }}>

                    <Form.Item name={"ticketId"}>
                        <Input size="large" placeholder="Ticket ID" onPressEnter={onFinish} />
                    </Form.Item>
                    <Form.Item name={"ticketTitle"}>
                        <Input size="large" placeholder="Ticket Title" onPressEnter={onFinish} />
                    </Form.Item>
                    <Form.Item>
                        <Button htmlType="submit" size="large" type="primary">Generate</Button>
                    </Form.Item>
                </Space.Compact>

            </Form>
            {
                generatedNames && generatedNames.length > 0 &&
                <Space style={{ marginTop: 20 }} direction="vertical">
                    <h4>Suggested Names:</h4>
                    {
                        generatedNames.map(n => <Button
                            style={{textAlign: 'left', paddingRight: 40}}
                            onClick={() => copyToClipboard(n)}
                            key={n} type="dashed" block>
                                {n}
                                <FontAwesomeIcon color="orange" icon={faCopy} style={{position: 'absolute', right: 10, top: 10}} />
                            </Button>
                        )
                    }
                </Space>
            }
        </Space>
    );
}
