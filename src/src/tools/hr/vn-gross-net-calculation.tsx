import { Button, Card, Checkbox, Col, Descriptions, Form, Input, InputNumber, Modal, Radio, Row, Select, Space, Statistic, Tooltip } from "antd"
import React, { useRef, useState } from "react";
import moment from 'moment';
import { calculateSalary, getDefaultGrossNetInput, getRegionConfigs, getRegionMinimumSalary } from "./hr-helper";
import { GrossNetInput, GrossNetResultDto } from "../../models/hr.model";
import CurrencyFormat from 'react-currency-format';
import { DoubleRightOutlined, InfoCircleOutlined, MoneyCollectOutlined, SwapRightOutlined } from "@ant-design/icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGear, faSackDollar } from '@fortawesome/free-solid-svg-icons'
import { Currency } from "../../components/tools/currency";
import { validate } from "uuid";


export const VNGrossNetCalculation = () => {
    const updatedDate = moment("07-01-2023", "MM-DD-YYYY");

    const [form] = Form.useForm<any>();
    const [formDetail] = Form.useForm<any>();

    const [currency, setCurrency] = React.useState<string>('vnd');
    const [regionMapping, setRegionMapping] = React.useState<any[]>([]);
    const [input, setInput] = React.useState<GrossNetInput>(getDefaultGrossNetInput());
    const [output, setOutput] = React.useState<GrossNetResultDto>();
    const [isViewTaxDetail, setIsViewTaxDetail] = React.useState<boolean>(false);
    const refViewDetail = useRef(null)

    const regionConfigs: any[] = getRegionConfigs();

    // modals
    const [isModalRegionOpen, setIsModalRegionOpen] = useState(false);
    const [isModalOtherSettingsOpen, setIsModalOtherSettingsOpen] = useState(false);

    const [isSocialInsuranceBasedOnFullSalary, setIsSocialInsuranceBasedOnFullSalary] = React.useState<boolean>(true);
    const [isIncludeUnionFee, setIsIncludeUnionFee] = React.useState<boolean>(false);

    const initFormValue = {
        isSocialInsuranceBasedOnFullSalary: true,
        currency: 'vnd',
        currencyRate: 23230,
        numberIndependence: 0,
        isIncludeUnionFee: false,
        insurranceAmount: 0,
    }

    React.useEffect(() => {
        initPage();
    }, [])

    const onChangeCurrency = (val: any) => {
        setCurrency(val.target.value);
        form.setFieldValue('amount', 0);
        setOutput(undefined);
    }

    const initPage = () => {
        const mapping = regionConfigs.map(t => {
            return {
                label: t.name,
                options: input.provinceRegionMappingConfig?.filter(m => m.region == t.id).map(t => { return { label: t.provinceName, value: `${t.region}-${t.provinceName}` } })
            }
        });
        setRegionMapping(mapping);
        form.setFieldValue("region", mapping[0].options[0].value);
    }

    const calculate = () => {
        const isValid = validate();
        if (!isValid) {
            return;
        }
        const formValue = form.getFieldsValue();
        const amount = (formValue.currency == 'usd') ? formValue.amount * formValue.currencyRate : formValue.amount;
        const issuranceAmount = formValue.isSocialInsuranceBasedOnFullSalary ? amount : formValue.insurranceAmount;
        const newInput = {
            ...input,
            ...formValue,
            issuranceAmount: issuranceAmount,
            otherAmount: 0,
            amount: amount,
            region: getRegionFromString(formValue.region),
            isSocialInsuranceBasedOnFullSalary: isSocialInsuranceBasedOnFullSalary,
            isIncludeUnionFee: isIncludeUnionFee
        }
        const output = calculateSalary(newInput);
        console.log(output);
        setOutput(output);

        // setOutput({ companyHealthcareInsuranceAmount: 2323 })
    }
    const validate = (): boolean => {
        const formValue = form.getFieldsValue();
        if (!formValue.amount || formValue.amount == 0) {
            Modal.error({ content: 'Vui lòng nhập mức lương' })
            return false;
        }
        if (formValue.currency == "usd" && (!formValue.currencyRate || formValue.currencyRate == 0)) {
            Modal.error({ content: 'Vui lòng nhập tỷ giá' })
            return false;
        }

        if (!isSocialInsuranceBasedOnFullSalary && (!formValue.insurranceAmount || formValue.insurranceAmount == 0)) {
            Modal.error({ content: 'Vui lòng nhập lương đóng bảo hiểm' })
            return false;
        }
        return true;
    }

    const getRegionFromString = (regionStr: string): number => {
        return regionStr ? Number.parseInt(regionStr.split("-")[0]) : 1; // default region 1
    }
    const viewTaxDetail = () => {
        setIsViewTaxDetail(!isViewTaxDetail);
    }

    return (
        <Row gutter={{ xs: 12, sm: 12, md: 24, lg: 12 }}>
            <Col className="gutter-row no-print" span={10}>
                <Card style={{ marginBottom: 20, border: 'gray' }}
                    title="Thông tin"
                >
                    <Form
                        form={form}
                        layout="vertical"
                        initialValues={initFormValue}
                    >
                        <Form.Item label="Đơn vị tiền tệ" name="currency">
                            <Radio.Group onChange={(val: any) => onChangeCurrency(val)}>
                                <Radio.Button value="vnd" checked>VNĐ</Radio.Button>
                                <Radio.Button value="usd">USD</Radio.Button>
                            </Radio.Group>
                        </Form.Item>

                        <Space style={{ width: '100%' }}>
                            <Form.Item name="amount" label="Mức lương">
                                <InputNumber
                                    autoFocus
                                    size="large"
                                    defaultValue={0}
                                    min={0}
                                    style={{ width: '100%' }}
                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                />
                            </Form.Item>
                            {
                                currency && currency == 'usd' &&
                                <Form.Item name="currencyRate" label="Tỷ giá 1 USD">
                                    <InputNumber
                                        size="large"
                                        min={0}
                                        style={{ width: '100%' }}
                                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    />
                                </Form.Item>
                            }
                        </Space>
                        {/* <Form.Item name="isIncludeUnionFee" label="">
                            <Checkbox onChange={(val) => { setIsIncludeUnionFee(val.target.checked); }}
                                checked={isIncludeUnionFee}>Đóng phí công đoàn ({`${input.unionPercentConfig}%`})</Checkbox>
                        </Form.Item> */}
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <Form.Item name="isSocialInsuranceBasedOnFullSalary" label="">
                                <Checkbox onChange={(val) => { setIsSocialInsuranceBasedOnFullSalary(val.target.checked) }}
                                    checked={isSocialInsuranceBasedOnFullSalary}>Đóng bảo hiểm trên mức lương chính thức</Checkbox>
                            </Form.Item>
                            {
                                !isSocialInsuranceBasedOnFullSalary &&
                                <Form.Item name="insurranceAmount" label="Mức lương đóng bảo hiểm" style={{ maxWidth: '67%' }}>
                                    <InputNumber
                                        size="large"
                                        min={0}
                                        defaultValue={0}
                                        style={{ width: '100%' }}
                                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    />
                                </Form.Item>
                            }

                        </Space>
                        <Space direction="horizontal" style={{ width: '100%' }}>
                            <Form.Item name={"numberIndependence"} label="Số người phụ thuộc" style={{}}>
                                <InputNumber
                                    size="large"
                                    max={10}
                                    min={0}
                                    defaultValue={0}
                                    style={{ width: '100%' }}
                                />
                            </Form.Item>
                            <Form.Item name="region" label={<span>Khu Vực <InfoCircleOutlined style={{ color: 'gray' }} onClick={() => setIsModalRegionOpen(true)} /> </span>} style={{}}>
                                <Select
                                    defaultValue={regionMapping && regionMapping.length > 0 ? regionMapping[0].options[0].value : ''}
                                    size="large"
                                    placeholder="Chọn Khu Vực"
                                    style={{ width: 200 }}
                                    //onChange={handleChange}
                                    allowClear
                                    showSearch
                                    options={regionMapping}
                                />
                            </Form.Item>
                            <div>
                                <Tooltip placement="top" title={'Thông tin khác'}>
                                    <FontAwesomeIcon onClick={() => { setIsModalOtherSettingsOpen(true) }} size="lg" icon={faGear} style={{ cursor: 'pointer' }} />
                                </Tooltip>

                            </div>
                        </Space>
                        <Space>
                            <Button htmlType="submit" onClick={() => { calculate() }} type="primary" size="large">GROSS <SwapRightOutlined style={{ marginLeft: 10, marginRight: 10 }} /> NET</Button>
                            <Button disabled size="large">NET <SwapRightOutlined style={{ marginLeft: 10, marginRight: 10 }} /> GROSS</Button>
                        </Space>
                        <Space style={{ marginTop: 20, color: 'gray' }}>
                            <p>
                                <i>
                                    Công cụ tính lương GROSS-NET chỉ mang tính chất tham khảo, có thể không đúng với quy định mới của pháp luật tại thời điểm bạn thực hiện tính toán.
                                    Thời gian cập nhật gần nhất ({updatedDate.format("L")})
                                </i>
                            </p>
                        </Space>
                    </Form>
                </Card>
            </Col>
            <Col className="gutter-row" span={14}>
                {
                    output &&
                    <Card title={
                        <Space>
                            <h3>Thông tin mức lương</h3>
                            <Button disabled style={{ position: 'absolute', right: 30, top: 10 }} type="default" size="small">Tải CSV</Button>
                        </Space>
                    }>
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <div style={{ background: '#F7F7F7', width: '100%', padding: 10 }}>
                                <Space direction="horizontal" size={"large"}>
                                    <Card bordered={false}>
                                        <Statistic title="Lương thực nhận (NET)" value={output.netAmount} suffix="đ" prefix={<FontAwesomeIcon icon={faSackDollar} />} />
                                    </Card>
                                    <Card bordered={false}>
                                        <Statistic title="Lương thỏa thuận (GROSS)" suffix="đ" value={output.grossAmount} />
                                    </Card>
                                </Space>
                            </div>
                            <Descriptions column={1} title="Thông tin chi tiết" bordered size="small" style={{ maxWidth: '100%' }}>
                                <Descriptions.Item label="LƯƠNG THỎA THUẬN" style={{ fontWeight: 'bold', textAlign: 'right', fontSize: 15 }} labelStyle={{ fontWeight: 'bold', fontSize: 15 }} >
                                    <Currency value={output.grossAmount} />
                                </Descriptions.Item>

                                <Descriptions.Item label={`Bảo hiểm xã hội (${output.input?.insurancePercentForStaffConfig?.socialPercent}%) (1)`} style={{ textAlign: 'right' }} >
                                    - <Currency value={output.socialInsuranceAmount} />
                                </Descriptions.Item>

                                <Descriptions.Item label={`Bảo hiểm y tế (${output.input?.insurancePercentForStaffConfig?.healthcarePercent}%) (2)`} style={{ textAlign: 'right' }} >
                                    - <Currency value={output.healthcareInsuranceAmount} />
                                </Descriptions.Item>

                                <Descriptions.Item label={`Bảo hiểm thất nghiệp (${output.input?.insurancePercentForStaffConfig?.unEmploymentPercent}%) (3)`} style={{ textAlign: 'right' }} >
                                    - <Currency value={output.unEmploymentInsuranceAmount} />
                                </Descriptions.Item>

                                <Descriptions.Item span={2} style={{ textAlign: 'right', fontWeight: 'bold', color: 'gray' }}>
                                    (1) + (2) + (3) = <Currency value={output.totalInsuranceForStaff} /> (4)
                                </Descriptions.Item>

                                {
                                    isIncludeUnionFee &&
                                    <Descriptions.Item label={`Phí công đoàn (${output.input?.unionPercentConfig}%)`} style={{ textAlign: 'right' }} >
                                        <Currency value={output.totalTradeUnion} />
                                    </Descriptions.Item>
                                }


                                <Descriptions.Item label="Thu nhập trước thuế (5)" style={{ textAlign: 'right' }} >
                                    <Currency value={output.salaryBeforeTax} />
                                </Descriptions.Item>

                                <Descriptions.Item label="Giảm trừ bản thân (6)" style={{ textAlign: 'right' }} >
                                    <Currency value={output.reduceIndividualAmount} />
                                </Descriptions.Item>

                                <Descriptions.Item label={`Giảm trừ người phụ thuộc (SL: ${output.input?.numberIndependence}) (7)`} style={{ textAlign: 'right' }} >
                                    <Currency value={output.reduceIndependenceAmount} />
                                </Descriptions.Item>

                                <Descriptions.Item label="Thu nhập chịu thuế" style={{ textAlign: 'right' }} >
                                    (5) - ( (6) + (7) ) = <Currency value={output.salaryForTax} />
                                </Descriptions.Item>

                                <Descriptions.Item label="THUẾ THU NHẬP CÁ NHÂN" style={{ textAlign: 'right', alignItems: "flex-start", fontWeight: 'bold' }} >
                                    -<Currency value={output.taxAmount} />
                                </Descriptions.Item>
                                <Descriptions.Item style={{ textAlign: 'right' }}>
                                    <Button onClick={() => { viewTaxDetail(); }} size="small" type="link">{isViewTaxDetail ? "Ẩn bớt" : "Xem chi tiết"}</Button>
                                </Descriptions.Item>
                                {
                                    isViewTaxDetail &&
                                    <>
                                        <Descriptions.Item label="THÔNG TIN THUẾ THEO BẬC" style={{ fontWeight: 'bold', textAlign: 'right' }} span={1} >
                                            <div ref={refViewDetail}></div>
                                        </Descriptions.Item>
                                        {output.taxDetails?.map(t => {
                                            return (
                                                <Descriptions.Item key={t.index} label={`${t.displayText} (${t.percent}%)`} style={{ textAlign: 'right' }} >
                                                    <Currency value={t.amount ?? 0} />
                                                </Descriptions.Item>
                                            );
                                        })}

                                        <Descriptions.Item label="NGƯỜI SỬ DỤNG LAO ĐỘNG TRẢ" style={{ fontWeight: 'bold', textAlign: 'right' }} span={2} >
                                            <Currency value={output.totalInsuranceForCompany + output.grossAmount} />
                                        </Descriptions.Item>

                                        <Descriptions.Item label={`Lương GROSS`} style={{ textAlign: 'right' }} >
                                            <Currency value={output.grossAmount ?? 0} />
                                        </Descriptions.Item>

                                        <Descriptions.Item label={`Bảo hiểm xã hội (${output.input?.insurancePercentForCompanyConfig?.socialPercent}%)`} style={{ textAlign: 'right' }} >
                                            <Currency value={output.companySocialInsuranceAmount} />
                                        </Descriptions.Item>

                                        <Descriptions.Item label={`Bảo hiểm y tế (${output.input?.insurancePercentForCompanyConfig?.healthcarePercent}%)`} style={{ textAlign: 'right' }} >
                                            <Currency value={output.companyHealthcareInsuranceAmount} />
                                        </Descriptions.Item>

                                        <Descriptions.Item label={`Bảo hiểm thất nghiệp (${output.input?.insurancePercentForCompanyConfig?.unEmploymentPercent}%)`} style={{ textAlign: 'right' }} >
                                            <Currency value={output.companyUnEmploymentInsuranceAmount} />
                                        </Descriptions.Item>
                                    </>
                                }
                            </Descriptions>
                        </Space>
                    </Card>
                }

            </Col>

            <Modal title="Lương tối thiểu vùng" open={isModalRegionOpen}
                cancelButtonProps={{ hidden: true }}
                onOk={() => setIsModalRegionOpen(false)} closable
                onCancel={() => setIsModalRegionOpen(false)}
            >
                <p>Áp dụng mức lương tối thiểu vùng mới nhất có hiệu lực từ ngày 01/07/2022 (theo nghị định 38/2022/NĐ-CP)</p>

                <p>Mức lương tối thiểu vùng sẽ ảnh hưởng tới mức đóng bảo hiểm thất nghiệp (BHTN) của bạn. Mức lương tối thiểu càng cao thì mức đóng BHTN càng cao.</p>

                <ul>
                    {
                        getRegionConfigs().map(r => {
                            return (
                                <li key={r.id}>{r.name}: <Currency value={r.amount} />/tháng</li>
                            )
                        })
                    }
                </ul>
                <p>Địa điểm</p>
                {
                    getRegionConfigs().map(r => {
                        const provinces = input.provinceRegionMappingConfig?.filter(t => t.region == r.id).map(t => t.provinceName);
                        const displayText = (provinces && provinces.length > 0) ? provinces?.join(', ') : 'Các tỉnh còn lại';
                        return (
                            <p key={r.id}>{r.name}: {displayText}</p>
                        )
                    })
                }
            </Modal>

            <Modal title="Thông tin khác" open={isModalOtherSettingsOpen}
                cancelButtonProps={{ hidden: true }}
                onOk={() => setIsModalOtherSettingsOpen(false)} closable
                onCancel={() => setIsModalOtherSettingsOpen(false)}
            >
                <Form
                    form={formDetail}
                    initialValues={{
                        ...input,
                        ...input.insurancePercentForStaffConfig,
                        ...input.reduceIndependenceConfig
                    }}
                >
                    <Form.Item name="baseSalary" label="Lương tối thiểu" style={{ width: 400 }}>
                        <InputNumber
                            disabled
                            autoFocus
                            defaultValue={0}
                            min={0}
                            style={{ width: '100%' }}
                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        />
                    </Form.Item>
                    <h4>Thông tin bảo hiểm (%)</h4>
                    <Space style={{ width: '100%' }}>
                        <Form.Item name="socialPercent" label="Xã hội">
                            <InputNumber
                                disabled
                                defaultValue={0}
                                min={0}
                                max={100}
                                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            />
                        </Form.Item>

                        <Form.Item name="healthcarePercent" label="Y tế">
                            <InputNumber
                                disabled
                                defaultValue={0}
                                min={0}
                                max={100}
                                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            />
                        </Form.Item>

                        <Form.Item name="unEmploymentPercent" label="Thất nghiệp">
                            <InputNumber
                                disabled
                                defaultValue={0}
                                min={0}
                                max={100}
                                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            />
                        </Form.Item>
                    </Space>

                    <h4>Giảm trừ gia cảnh</h4>
                    <Space style={{ width: '100%' }}>
                        <Form.Item name="individualAmount" label="Cá nhân">
                            <InputNumber
                                disabled={true}
                                defaultValue={0}
                                min={0}
                                max={100}
                                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            />
                        </Form.Item>

                        <Form.Item name="independencePeopleAmount" label="Người phụ thuộc">
                            <InputNumber
                                disabled
                                defaultValue={0}
                                min={0}
                                max={100}
                                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            />
                        </Form.Item>
                    </Space>
                </Form>
            </Modal>

        </Row>
    )
}