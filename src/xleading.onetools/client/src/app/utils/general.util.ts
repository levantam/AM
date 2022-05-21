import { HrCurrencyEnum, HrGrossNetConfiguation, HrGrossNetModel, HrRegionEnum } from "../models/hr.model";

export function ParseHrGrossNetConfiguation(configuration: any): HrGrossNetConfiguation {
    const result: HrGrossNetConfiguation = configuration;
    console.log(result);
    
    return result;
}
export function DefaultHrGrossNetModel(): HrGrossNetModel {
    const result: HrGrossNetModel = {
        salaryInput: 0,
        salary: 0,
        currency: HrCurrencyEnum.VND,
        insuranceWage: 0,
        region: HrRegionEnum.I,
        dependantCount: 0,
        isGrossSalary: true
    }
    return result;
}