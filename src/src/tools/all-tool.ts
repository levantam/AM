import { ToolCategory, ToolEnum } from "../constants";
import { ToolInformationDto } from "../models";
import { faLaptopCode, faCodeBranch, faCalculator } from '@fortawesome/free-solid-svg-icons'

export const AllToolsData: ToolInformationDto[] = [
    // Dev tools
    {
        id: ToolEnum.GUIDGenerator,
        name: 'GUID Generator',
        category: ToolCategory.devTools,
        shortDescription: 'Generate the GUID',
        description: 'This is the tool to help you to generate the GUID. It\'s fee',
        icon: faLaptopCode,
        isActive: true,
        isHidden: false
    },
    {
        id: ToolEnum.BranchNameCreator,
        name: 'Branch Name Creator',
        category: ToolCategory.devTools,
        shortDescription: 'Branch Name Creator',
        description: 'To create the branch name correctly',
        icon: faCodeBranch,
        isActive: true,
        isHidden: true
    },
    // HR tools
    {
        id: ToolEnum.GrossNetCalculation,
        name: 'Tính lương GROSS-NET',
        category: ToolCategory.hrTools,
        shortDescription: 'Công cụ chuyển đổi lương GROSS-NET',
        description: 'Công cụ chuyển đổi lương GROSS-NET',
        icon: faCalculator,
        isActive: true,
        isHidden: false,
        background: 'transparent'
    },
]