import { IResourceComponentsProps } from "@refinedev/core";
import { ToolInformationDto } from "../../models";
import { Card } from "antd";
import { ToolList } from "../../components/tools/tool-list";
import { ToolCategory } from "../../constants";
import { AllToolsData } from "../../tools/all-tool";
import { getToolsByCategory } from "../../tools/helper";

export const HrToolList: React.FC<IResourceComponentsProps> = () => {
  const categoryId = ToolCategory.hrTools;
  const hrTools: ToolInformationDto[] =  getToolsByCategory(categoryId, false);
  return (
    <Card>
      <h2>HR tools</h2>
      <ToolList tools={hrTools} colspan={6} />
    </Card>
  );
};
