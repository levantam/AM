import { IResourceComponentsProps } from "@refinedev/core";
import { ToolInformationDto } from "../../models";
import { Card } from "antd";
import { ToolList } from "../../components/tools/tool-list";
import { ToolCategory } from "../../constants";
import { AllToolsData } from "../../tools/all-tool";

export const HrToolList: React.FC<IResourceComponentsProps> = () => {
  const hrTools: ToolInformationDto[] =  AllToolsData.filter(t => t.category == ToolCategory.hrTools);
  return (
    <Card>
      <h2>HR tools</h2>
      <ToolList tools={hrTools} colspan={6} />
    </Card>
  );
};
