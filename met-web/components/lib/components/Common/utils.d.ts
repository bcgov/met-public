declare const EditFormUtils: {
    sortAndFilterComponents(components: any): any;
    unifyComponents(objValue: any, srcValue: any): any;
    logicVariablesTable(additional: any): {
        type: string;
        tag: string;
        content: string;
    };
    javaScriptValue(title: any, property: any, propertyJSON: any, weight: any, exampleHTML: any, exampleJSON: any, additionalParams: string, excludeJSONLogic: any): {
        type: string;
        title: any;
        theme: string;
        collapsible: boolean;
        collapsed: boolean;
        key: string;
        weight: any;
        components: any[];
    };
};
export default EditFormUtils;
