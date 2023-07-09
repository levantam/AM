export enum HrCurrencyEnum {
    VND = "VND",
    USD = "USD"
}
export enum HrRegionEnum {
    I = 1,
    II = 2,
    III = 3,
    IV = 4
}
export interface HrGrossNetConfiguation {
    basedSalary: number; // Luong co so
    minimumWage: number,
    insuranceSocialPercent: number,
    insuranceHealthPercent: number,
    insuranceUnemployedPercent: number,
    personalReduction: number,
    dependantReduction: number,
    exchangeRate: number,
    tax: Tax[],
    region1wage: number,
    region2wage: number,
    region3wage: number,
    region4wage: number
}
export interface HrGrossNetModel {
    salary: number,
    currency: HrCurrencyEnum,
    isFullInsuranceWage: boolean;
    insuranceWage: number,
    region: HrRegionEnum,
    dependantCount: number
    isGrossSalary: boolean,
    isVietnamdongSalary: boolean
}
export interface CostByRegion {
    region: HrRegionEnum,
    name: string,
    cost: number
}
export interface SalaryInformation {
    grossVietnamdong?: number,
    grossDollar?: number,
    netVietnamdong?: number,
    netDollar?: number,
    insuranceSocial?: number,
    insuranceHealth?: number,
    insuranceUnemployed?: number,
    totalInsurance?: number,
    // incomeBeforeTax?: number,
    personalReduction?: number,
    dependenciesReduction?: number,
    taxSalary?: number,
    tax?: number,
    taxDetail?: Tax[]
    employerTax?: EmployerTax
}

export interface Tax {
    name: string,
    from: number,
    to: number,
    taxPercent: number,
    tax: number
}
export interface EmployerTax {
    grossSalary: number,
    socialInsurance: number,
    healthInsurance: number,
    unepmployedInsurance: number,
    tax: number
}