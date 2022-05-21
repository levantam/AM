export enum HrCurrencyEnum {
    VND,
    USD
}
export enum HrRegionEnum {
    I,
    II,
    III,
    IV
}
export interface HrGrossNetConfiguation {
    minimumWage: number,
    insuranceSocialPercent: number,
    insuranceHealthPercent: number,
    insuranceUnemployedPercent: number,
    personalReduction: number,
    dependantReduction: number,
    exchangeRate: number
}
export interface HrGrossNetModel {
    salaryInput: number,
    salary: number,
    currency: HrCurrencyEnum,
    insuranceWage: number,
    region: HrRegionEnum,
    dependantCount: number
    isGrossSalary: boolean
}