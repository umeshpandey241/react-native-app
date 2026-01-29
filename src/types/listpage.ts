export interface FileInfo {
    fileName: string;
    filePath: string;
}

export interface ConditionParams {
    [key: string]: any;
}

export interface RoleConditionParams {
    [key: string]: any;
}

export interface SearchParams {
    [key: string]: any;
}

export interface TableSearchParams {
    sortField: string;
    sortOrder: string | number;
    first: number;
    rows: number;
    filter: string;
    top: string;
    left: string;
    searchRowFilter: { [key: string]: any };
}

export interface CachedState {
    search: SearchParams;
    tableSearch: TableSearchParams;
    condition: ConditionParams;
    roleCondition: RoleConditionParams;
}
