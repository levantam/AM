import { Card } from "antd";
import { ToolList } from "../components/tools/tool-list";
import { AllToolsData } from "../tools/all-tool";
import { getToolsByCategory } from "../tools/helper";
import { useParams, useSearchParams } from "react-router-dom";
import React from "react";
import { ToolInformationDto } from "../models";

export const Dashboard = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [allTools, setAllTools] = React.useState<ToolInformationDto[]>([]);
    // const allTools = getToolsByCategory(null);

    React.useEffect(() => {
        const allParams = searchParams.get('all');
        const isAllTools = (allParams && allParams?.length > 0) || false;
        console.log(isAllTools, 'is all tools');
        
        setAllTools(getToolsByCategory(null, isAllTools))
    }, [])

    return (
        <Card title="List of fee tools" style={{background: 'transparent', border: 'none', boxShadow: 'none'}}>
            <ToolList tools={allTools} colspan={6} />
        </Card>
    );
}