import { ToolCategory, ToolEnum } from "../constants";
import { ToolInformationDto } from "../models";

export const AllToolsData: ToolInformationDto[] = [
    {
        id: ToolEnum.GUIDGenerator,
        name: 'GUID Generator',
        category: ToolCategory.devTools,
        shortDescription: 'Generate the GUID',
        description: 'This is the tool to help you to generate the GUID. It\'s fee',
        icon: '',
        isActive: true
    },
]