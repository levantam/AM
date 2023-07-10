import { IResourceComponentsProps } from "@refinedev/core";
import { AntdListInferencer } from "@refinedev/inferencer/antd";
import { ToolInformationDto } from "../../models";
import { Card } from "antd";
import { ToolList } from "../../components/tools/tool-list";
import { ToolCategory, ToolEnum } from "../../constants";
import { AllToolsData } from "../../tools/all-tool";

export const DevToolList: React.FC<IResourceComponentsProps> = () => {
  const devTools: ToolInformationDto[] =  AllToolsData.filter(t => t.category == ToolCategory.devTools);
  return (
    <Card>
      <h2>Dev tools</h2>
      <ToolList tools={devTools} colspan={6} />
    </Card>
  );
};
