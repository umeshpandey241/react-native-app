import { anyValueField } from "./baseSchema";
type TransFn = (key: string, params?: Record<string, unknown>) => string;

export const searchValidate = (t: TransFn) => ({
    name:anyValueField("SearchText",t,2 ,1000),     
    

// <!--validate-Data-->
});