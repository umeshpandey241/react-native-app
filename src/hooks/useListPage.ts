/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { useBaseService } from '../sharedBase/baseService';
import { UseListQueryResult } from '../store/useListQuery';
import { useFetchRoleDetailsData } from '../sharedBase/lookupService';
import { RoleDetail } from '../core/model/roledetail';

type UseListPageCommonProps = {
    baseModelName?: string;
    typeName: string;
    service: ReturnType<typeof useBaseService>;
};

type UseListPageProps<TQuery, TItem> = {
    query: TQuery;
    props: UseListPageCommonProps;
};

export function useListPage<TQuery extends UseListQueryResult<TItem>, TItem>({ query, props }: UseListPageProps<TQuery, TItem>) {
    const baseModelName: string = props.baseModelName || '';
    const typeName: string = props.typeName || '';
    const [roleData, setRoleData] = useState<any>(null);
    const { data:roleDetailsData } = useFetchRoleDetailsData();

    useEffect(() => {
        const fetchRoleDetails = async () => {
            if (!props.typeName) return;
            if (roleDetailsData && roleDetailsData.length > 0) {

                const modelData = roleDetailsData.find((r: RoleDetail) => r.name?.toLocaleLowerCase() === typeName.toLowerCase());
                setRoleData(modelData);

                if (modelData?.dbStatus) {
                    query?.setRoleCondition(JSON.parse(modelData.dbStatus));
                } else {
                    query?.setRoleCondition({});
                }
                // await query.load();
            }
            if (roleDetailsData && roleDetailsData.length > 0) {
                fetchRoleDetails();
            }
        };
        fetchRoleDetails();
    }, [roleDetailsData,typeName]);

    const hasAccess = (roleData: any, requiredAction: string) => {
        if (!roleData) { return false; }
        const actions = typeof roleData.action === 'string' ? JSON.parse(roleData.action) : [];
        let newAction = false;
        if (actions.length) {
            newAction = actions?.some((action: any) => action.name.toLowerCase() === requiredAction.toLowerCase());
        }        
        return newAction;
    };

    return {
        hasAccess, roleData
    };

}
