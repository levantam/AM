export interface GrossNetInput {
    // amount
    amount?: number;
    otherAmount?: number;
    currency?: string;

    // social
    isSocialInsurance?: boolean;
    isSocialInsuranceBasedOnFullSalary?: boolean;
    insurranceAmount?: number;
    insurancePercentForStaffConfig?: GrossNetInsurancePercentConfig;
    insurancePercentForCompanyConfig?: GrossNetInsurancePercentConfig;
    baseSalary?: number;
    isIncludeUnionFee?: boolean;
    unionPercentConfig?: number;
    

    // Reduce
    numberIndependence?: number;
    reduceIndependenceConfig?: GrossNetReduceConfig;

    // region
    region?: number;
    provinceRegionMappingConfig?: ProvinceRegionMappingConfig[];

    // Tax range
    taxConfig: TaxRangeDto[]
}

export interface GrossNetResultDto {
    input?: GrossNetInput;

    isGrossToNet?: boolean;

    // Gross amount
    grossAmount?: number;
    salaryBeforeTax?: number;
    salaryForTax?: number;
    taxAmount?: number;
    taxDetails?: TaxRangeDto[];
    netAmount?: number;
    
    // insurance
    socialInsuranceAmount?: number;
    healthcareInsuranceAmount?: number;
    unEmploymentInsuranceAmount?: number
    totalInsuranceForStaff?: number;

    // trade union
    totalTradeUnion?: number;

    // insurance for company
    companySocialInsuranceAmount?: number;
    companyHealthcareInsuranceAmount?: number;
    companyUnEmploymentInsuranceAmount?: number
    totalInsuranceForCompany?: number;

    // reduce
    reduceIndividualAmount?: number;
    reduceIndependenceAmount?: number;
    totalReduce?: number;
}

export interface TaxDetailDto {
    from?: number;
    to?: number;
    percent?: number;
    taxAmount?: number;
}

export interface GrossNetInsurancePercentConfig {
    minimumSalary?: number;
    socialPercent?: number;
    healthcarePercent?: number;
    unEmploymentPercent?: number;
}

export interface GrossNetReduceConfig {
    individualAmount?: number;
    independencePeopleAmount?: number
}

export interface GrossNetMinimumSalaryRegionConfig {
    region1: number;
    region2: number;
    region3: number;
    region4: number;
}

export interface TaxRangeDto {
    index: number;
    from: number;
    to: number;
    displayText?: string;
    percent: number;
    amount?: number;
}
export interface ProvinceRegionMappingConfig {
    provinceName?: string;
    region?: number;
}