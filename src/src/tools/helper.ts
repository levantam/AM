import { AllToolsData } from "./all-tool"

export const getToolsByCategory = (categoryId: any, isShowHidden: boolean = true) => {
    let result =  AllToolsData.filter(t => 
        (t.category == categoryId || !categoryId) 
        && t.isActive == true 
    );
    result = isShowHidden == true ? result : result.filter(t => t.isHidden == false);
    
    return result;
}