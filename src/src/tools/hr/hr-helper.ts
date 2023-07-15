import { GrossNetInput, GrossNetResultDto, ProvinceRegionMappingConfig, TaxRangeDto } from "../../models/hr.model";

export const getDefaultGrossNetInput = (): GrossNetInput => {
    const result: GrossNetInput = {
        amount: 0,
        otherAmount: 0,
        insurranceAmount: 0,
        currency: 'vn',
        isSocialInsurance: true,
        isSocialInsuranceBasedOnFullSalary: true,
        region: 1,
        provinceRegionMappingConfig: getProvinceRegionMapping(),
        numberIndependence: 0,
        baseSalary: 1800000,// TODO change to 1800000, 1490000
        unionPercentConfig: 2,

        insurancePercentForCompanyConfig: {
            socialPercent: 17.5,
            healthcarePercent: 3,
            unEmploymentPercent: 1
        },
        insurancePercentForStaffConfig: {
            minimumSalary: 1490000,
            socialPercent: 8,
            healthcarePercent: 1.5,
            unEmploymentPercent: 1
        },
        // minimumSalaryByRegionConfig: {
        //     region1: 4420000,
        //     region2: 3920000,
        //     region3: 3430000,
        //     region4: 3070000,
        // },
        reduceIndependenceConfig: {
            independencePeopleAmount: 4400000,
            individualAmount: 11000000
        },
        taxConfig: [
            {
                index: 1,
                from: 0,
                to: 5000000,
                displayText: "Dưới 5 triệu VND",
                percent: 5
            },
            {
                index: 2,
                from: 5000000,
                to: 10000000,
                displayText: "Từ 5 triệu VND đến 10 triệu VND",
                percent: 10
            },
            {
                index: 3,
                from: 10000000,
                to: 18000000,
                displayText: "Từ 10 triệu VND đến 18 triệu VND",
                percent: 15
            },
            {
                index: 4,
                from: 18000000,
                to: 32000000,
                displayText: "Từ 18 triệu VND đến 32 triệu VND",
                percent: 20
            },
            {
                index: 5,
                from: 32000000,
                to: 52000000,
                displayText: "Từ 32 triệu VND đến 52 triệu VND",
                percent: 25
            },
            {
                index: 6,
                from: 52000000,
                to: 80000000,
                displayText: "Từ 52 triệu VND đến 80 triệu VND",
                percent: 30
            },
            {
                index: 7,
                from: 80000000,
                to: Number.MAX_VALUE,
                displayText: "Từ 80 triệu VND",
                percent: 35
            }
        ]
    }
    return result;
}

export const calculateSalary = (input: GrossNetInput, isGrossToNet: boolean = true): GrossNetResultDto => {
    const initResult: GrossNetResultDto = {
        input: input,
        isGrossToNet: isGrossToNet
    };
    return isGrossToNet ? calculateFromGrossToNetSalary(input, initResult) : calculateFromNetToGrossSalary(input, initResult);
}
const calculateFromGrossToNetSalary = (input: GrossNetInput, initOutput: GrossNetResultDto): GrossNetResultDto => {
    const result = { ...initOutput };
    const totalSalary = (input.amount ?? 0) + (input.otherAmount ?? 0);
    result.grossAmount = totalSalary;

    // insurance
    let totalAmount = input.amount;
    if (input.isSocialInsurance) {
        totalAmount = (input.isSocialInsuranceBasedOnFullSalary ? input.amount : input.insurranceAmount) ?? 0;
        let salaryToCalculateInsurance = totalAmount;
        const minimumSalaryByRegion = getRegionMinimumSalary(input.region ?? 1);
        const salaryToCalculateUnEmployeement = totalAmount > (minimumSalaryByRegion * 20) ? (minimumSalaryByRegion * 20) : totalAmount;
        
        const maximumInsurance = 20 * (input.baseSalary ?? 0);
        if (salaryToCalculateInsurance > maximumInsurance) {
            salaryToCalculateInsurance = maximumInsurance;
        }
        result.totalTradeUnion = 0;
        if (input.isIncludeUnionFee) {
            result.totalTradeUnion = calculateAmountByPercent(salaryToCalculateInsurance, input.unionPercentConfig ?? 0);
        }

        result.healthcareInsuranceAmount = calculateAmountByPercent(salaryToCalculateInsurance, input.insurancePercentForStaffConfig?.healthcarePercent ?? 0)
        result.socialInsuranceAmount = calculateAmountByPercent(salaryToCalculateInsurance, input.insurancePercentForStaffConfig?.socialPercent ?? 0)
        result.unEmploymentInsuranceAmount = calculateAmountByPercent(salaryToCalculateUnEmployeement, input.insurancePercentForStaffConfig?.unEmploymentPercent ?? 0)
        result.totalInsuranceForStaff = result.healthcareInsuranceAmount + result.socialInsuranceAmount + result.unEmploymentInsuranceAmount;

        // Calculate insurance fo company
        result.companyHealthcareInsuranceAmount = calculateAmountByPercent(salaryToCalculateInsurance, input.insurancePercentForCompanyConfig?.healthcarePercent ?? 0)
        result.companySocialInsuranceAmount = calculateAmountByPercent(salaryToCalculateInsurance, input.insurancePercentForCompanyConfig?.socialPercent ?? 0)
        result.companyUnEmploymentInsuranceAmount = calculateAmountByPercent(salaryToCalculateUnEmployeement, input.insurancePercentForCompanyConfig?.unEmploymentPercent ?? 0)
        result.totalInsuranceForCompany = result.companyHealthcareInsuranceAmount + result.companySocialInsuranceAmount + result.companyUnEmploymentInsuranceAmount;
    }
    

    result.salaryBeforeTax = totalSalary - (result.totalInsuranceForStaff ?? 0) - result.totalTradeUnion;

    // Reduce
    result.reduceIndividualAmount = input.reduceIndependenceConfig?.individualAmount ?? 0;
    result.reduceIndependenceAmount = (input.reduceIndependenceConfig?.independencePeopleAmount ?? 0) * (input.numberIndependence ?? 0);
    result.totalReduce = result.reduceIndividualAmount + result.reduceIndependenceAmount;

    result.salaryForTax = result.salaryBeforeTax - result.totalReduce;
    if (result.salaryForTax < 0) {
        result.salaryForTax = 0;
    }
    // calculate the tax by level
    result.taxDetails = calculateTaxLevel(result.salaryForTax, input.taxConfig);
    result.taxAmount = result.taxDetails.map(t => (t.amount ?? 0)).reduce((sum, current) => sum + current);;
    result.netAmount = result.salaryBeforeTax - result.taxAmount;;

    return result;
}

const calculateFromNetToGrossSalary = (input: GrossNetInput, initOutput: GrossNetResultDto): GrossNetResultDto => {
    const result = { ...initOutput };

    return result;
}

const roundSalary = (salary: number) => {
    return Math.round(salary);
}

const calculateAmountByPercent = (amount: number, percent: number): number => {
    const calculatedAmount = amount * (percent / 100);
    return roundSalary(calculatedAmount);
}

const calculateTaxLevel = (salaryForTax: number, taxConfigs: TaxRangeDto[]): TaxRangeDto[] => {
    const result = [
        ...taxConfigs.map(t => {return {...t, amount: 0}})
    ];
    let i = 1;

    while (salaryForTax > 0) {
        const currentTax = result[i - 1];
        const taxLevelAmount = (currentTax.to - currentTax.from);
        const amountToCalculate = salaryForTax > taxLevelAmount ? taxLevelAmount : salaryForTax;
        result[i - 1].amount = calculateAmountByPercent(amountToCalculate, currentTax.percent)

        salaryForTax -= amountToCalculate;
        i++;
    }
    return result;
}
export const getRegionConfigs = (): any[] => {
    const regions: any[] = [
        {
            id: 1,
            name: 'Vùng 1',
            amount: 4680000
        },
        {
            id: 2,
            name: 'Vùng 2',
            amount: 4160000
        },
        {
            id: 3,
            name: 'Vùng 3',
            amount: 3640000
        },
        {
            id: 4,
            name: 'Vùng 4',
            amount: 3250000
        }
    ]
    return regions;
}

export const getRegionMinimumSalary = (region: number): number => {
    const regions = getRegionConfigs();
    return regions.filter(t => t.id == region)[0].amount;
}

export const getProvinceRegionMapping = (): ProvinceRegionMappingConfig[] => {
    const result: ProvinceRegionMappingConfig[] = [
        {
            provinceName: "TP Hồ Chí Minh",
            region: 1
        },
        {
            provinceName: "Hà Nội",
            region: 1
        },
        {
            provinceName: "Quảng Ninh",
            region: 1
        },
        {
            provinceName: "Đà Nẵng",
            region: 1
        },
        {
            provinceName: "Bình Dương",
            region: 1
        },
        {
            provinceName: "Đồng Nai",
            region: 1
        },
        {
            provinceName: "Vũng Tàu",
            region: 1
        },

        // Vung 2
        {
            provinceName: "Hải Phòng",
            region: 2
        },
        {
            provinceName: "Vĩnh Phúc",
            region: 2
        },
        {
            provinceName: "Thái Nguyên",
            region: 2
        },
        {
            provinceName: "Khánh Hoà",
            region: 2
        },
        {
            provinceName: "Bình Phước",
            region: 2
        },
        {
            provinceName: "Tây Ninh",
            region: 2
        },
        {
            provinceName: "Long An",
            region: 2
        },
        {
            provinceName: "An Giang",
            region: 2
        },
        {
            provinceName: "Cần Thơ",
            region: 2
        },
        {
            provinceName: "Cà Mau",
            region: 2
        },
        // vung 3
        {
            provinceName: "Hà Tây",
            region: 3
        },
        {
            provinceName: "Bắc Ninh",
            region: 3
        },
        {
            provinceName: "Hải Dương",
            region: 3
        },
        {
            provinceName: "Hưng Yên",
            region: 3
        },
        {
            provinceName: "Huế",
            region: 3
        },
        {
            provinceName: "Bình Định",
            region: 3
        },
        {
            provinceName: "Gia Lai",
            region: 3
        },
        {
            provinceName: "Đắc Lắc",
            region: 3
        },
        {
            provinceName: "Lâm Đồng",
            region: 3
        },
        {
            provinceName: "Ninh Thuận",
            region: 3
        },
        {
            provinceName: "Bình Thuận",
            region: 3
        },
        {
            provinceName: "Đồng Tháp",
            region: 3
        },
        {
            provinceName: "Tiền Giang",
            region: 3
        },
        {
            provinceName: "Vĩnh Long",
            region: 3
        },
        {
            provinceName: "Bến Tre",
            region: 3
        },
        {
            provinceName: "Kiên Giang",
            region: 3
        },
        {
            provinceName: "Hậu Giang",
            region: 3
        },
        {
            provinceName: "Sóc Trăng",
            region: 3
        },
        {
            provinceName: "Bạc Liêu",
            region: 3
        },

        // Vung 4
        {
            provinceName: "Các tỉnh còn lại",
            region: 4
        }
    ];
    return result;
}