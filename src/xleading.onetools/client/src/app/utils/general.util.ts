import { HrCurrencyEnum, HrGrossNetConfiguation, HrGrossNetModel, HrRegionEnum, SalaryInformation, Tax } from "../models/hr.model";

export function ParseHrGrossNetConfiguation(configuration: any): HrGrossNetConfiguation {
    const result: HrGrossNetConfiguation = configuration;
    console.log(result);
    
    return result;
}
export function DefaultHrGrossNetModel(): HrGrossNetModel {
    const result: HrGrossNetModel = {
        salary: 0,
        currency: HrCurrencyEnum.VND,
        insuranceWage: 0,
        region: HrRegionEnum.I,
        dependantCount: 0,
        isGrossSalary: true,
        isFullInsuranceWage: true,
        isVietnamdongSalary: true
    }
    return result;
}
export function DefaultTaxConfigurations(): Tax[] {
    return [
        { from: 0, to: 5000000, taxPercent: 5, name: '', tax: 0  },
        { from: 5000000, to: 10000000, taxPercent: 10, name: '', tax: 0  },
        { from: 10000000, to: 18000000, taxPercent: 15, name: '', tax: 0  },
        { from: 18000000, to: 32000000, taxPercent: 20, name: '', tax: 0  },
        { from: 32000000, to: 52000000, taxPercent: 25, name: '', tax: 0  },
        { from: 52000000, to: 80000000, taxPercent: 30, name: '', tax: 0  },
        { from: 80000000, to: 1000000000, taxPercent: 35, name: '', tax: 0  }
    ];
}
export function isVietnamdong(value: number) {
    return value > 10000;
}
export function calCulateTheSalary(input: HrGrossNetModel, configurations: HrGrossNetConfiguation): SalaryInformation {

    let result: SalaryInformation = {};
    
    // Calculate based on the vietnamdong
    let netSalary = 0;
    let grossSalary = 0;
    let tax = 0;
    let reduceSalaryForTax = 0;
    let insurance = 0;
    let salaryForTaxCalculation = 0;

    const taxConfiguration = DefaultTaxConfigurations();
    const fromCurrency = input.isVietnamdongSalary ? HrCurrencyEnum.VND : HrCurrencyEnum.USD;
    const toCurrency = input.isVietnamdongSalary ? HrCurrencyEnum.USD : HrCurrencyEnum.VND;
    const salaryInVietnamdong =  input.isVietnamdongSalary ? input.salary : convertCurrency(fromCurrency, toCurrency, input.salary, configurations.exchangeRate);
    let salaryToCalculateInsurance = input.isFullInsuranceWage ? salaryInVietnamdong : input.insuranceWage;
    
    if (input.isGrossSalary) { 
        grossSalary = salaryInVietnamdong;
        reduceSalaryForTax = (configurations.dependantReduction * input.dependantCount) + configurations.personalReduction;
        result.insuranceHealth = healthInsuranceCalculation(salaryToCalculateInsurance, configurations);
        result.insuranceSocial = healthSocialCalculation(salaryToCalculateInsurance, configurations);
        result.insuranceUnemployed = unemployedInsuranceCalculation(salaryToCalculateInsurance, input.region, configurations);
        insurance =  result.insuranceHealth + result.insuranceSocial + result.insuranceUnemployed;
        salaryForTaxCalculation = salaryInVietnamdong - reduceSalaryForTax - insurance;

        let tempSalary = salaryForTaxCalculation;
        let needStopCalculation = false;
        taxConfiguration.forEach(t => {
            if (needStopCalculation) {
                return;
            }
            
            let salaryToCalculate = t.to - t.from;
            if (tempSalary <= salaryToCalculate) {
                salaryToCalculate = tempSalary;
                needStopCalculation = true;
            }
            tempSalary = tempSalary - salaryToCalculate;
            const currentTax = taxCalculation(salaryToCalculate, t.taxPercent);
            t.tax = currentTax;
        });
        tax = taxConfiguration.filter(t => t.tax > 0).map(t => t.tax).reduce((sum, current) => sum + current, 0);
        netSalary = salaryInVietnamdong - insurance - tax;

    } else { // NET salary
        netSalary = salaryInVietnamdong;
    }

    result.taxDetail = taxConfiguration;
    result.dependenciesReduction = input.dependantCount * configurations.dependantReduction;
    result.personalReduction = configurations.personalReduction;
    result.grossDollar = convertCurrency(fromCurrency, toCurrency, grossSalary, configurations.exchangeRate);
    result.grossVietnamdong = salaryInVietnamdong;
    result.netVietnamdong = netSalary;
    result.netDollar = convertCurrency(HrCurrencyEnum.VND, HrCurrencyEnum.USD, netSalary, configurations.exchangeRate);
    result.taxSalary = salaryForTaxCalculation;
    result.tax = tax;
    result.taxDetail = taxConfiguration;
    result.totalInsurance = insurance;
    return result;
}
export function healthInsuranceCalculation(salary: number, configurations: HrGrossNetConfiguation): number {
    return insuranceCalculation(configurations.insuranceHealthPercent, salary, getMaximuInsurance(configurations.basedSalary, configurations.insuranceHealthPercent));
}
export function healthSocialCalculation(salary: number, configurations: HrGrossNetConfiguation): number {
    return insuranceCalculation(configurations.insuranceSocialPercent, salary, getMaximuInsurance(configurations.basedSalary, configurations.insuranceSocialPercent));
}
export function unemployedInsuranceCalculation(salary: number, region: HrRegionEnum, configurations: HrGrossNetConfiguation): number {
    const maximumBasedRegionSalary = getMaximumBasedRegionSalary(region, configurations);
    return insuranceCalculation(configurations.insuranceUnemployedPercent, salary, getMaximuInsurance(maximumBasedRegionSalary, configurations.insuranceUnemployedPercent));
}
export function insuranceCalculation(percent: number, salary: number, max: number = -1): number {
    const value =  round((percent / 100) * salary);
    return (max != -1 && value > max) ? max : value;
}
export function taxCalculation(percent: number, salary: number): number {
    return round((percent / 100) * salary);
}
export function round(data: number): number {
    return Math.round(data * 100)/100;
}
export function convertCurrency(from: HrCurrencyEnum, to: HrCurrencyEnum, value: number, exchangeRate: number): number {
    let result = value;
    if (from == HrCurrencyEnum.USD) {
        result = value * exchangeRate;
    } else {
        result = value / exchangeRate;
    }
    return round(result);
}
export function getMaximuInsurance(basedSalary: number, percent: number) {
    return (20 * basedSalary) * (percent / 100);
}
export function getMaximumBasedRegionSalary(region: HrRegionEnum, configurations: HrGrossNetConfiguation) {
    let maximumBasedRegionSalary = 0;
    switch(region) {
        case HrRegionEnum.I: maximumBasedRegionSalary = configurations.region1wage; break;
        case HrRegionEnum.II: maximumBasedRegionSalary = configurations.region2wage; break;
        case HrRegionEnum.III: maximumBasedRegionSalary = configurations.region3wage; break;
        default: maximumBasedRegionSalary = configurations.region4wage; break;
    }
    return maximumBasedRegionSalary;
}
