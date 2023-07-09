import { CostByRegion, HrRegionEnum } from "src/app/models/hr.model";

export function GetCostByRegion(): CostByRegion[] {
    return [
        { region: HrRegionEnum.I, name: 'Vùng 1', cost: 4420000},
        { region: HrRegionEnum.II, name: 'Vùng 2', cost: 3920000},
        { region: HrRegionEnum.III, name: 'Vùng 3', cost: 3430000},
        { region: HrRegionEnum.IV, name: 'Vùng 4', cost: 3070000}
    ]
}

