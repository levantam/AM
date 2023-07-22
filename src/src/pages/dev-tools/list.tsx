import { IResourceComponentsProps } from "@refinedev/core";
import { AntdListInferencer } from "@refinedev/inferencer/antd";
import { ToolInformationDto } from "../../models";
import { Card } from "antd";
import { ToolList } from "../../components/tools/tool-list";
import { ToolCategory, ToolEnum } from "../../constants";
import { AllToolsData } from "../../tools/all-tool";
import { getToolsByCategory } from "../../tools/helper";

export const DevToolList: React.FC<IResourceComponentsProps> = () => {
  const categoryId = ToolCategory.devTools;
  const devTools: ToolInformationDto[] =  getToolsByCategory(categoryId, false);
  
  return (
    <Card style={{minHeight: 500}}>
      <h2>Dev tools</h2>
      <ToolList tools={devTools} colspan={6} />
    </Card>
  );
};
