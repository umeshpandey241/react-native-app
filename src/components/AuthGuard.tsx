import React, { useEffect, useState } from 'react';
import NotAuthorized from '../screens/NotAuthorized';
import { Loading } from './Loding';
import { useFetchRoleDetailsData } from '../sharedBase/lookupService';
import { RoleDetail } from '../core/model/roledetail';


const AuthGuard = ({ children, page, requiredAction }: any) => {
    const [roleData, setRoleData] = useState<RoleDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { data: roleDetailsData } = useFetchRoleDetailsData();

    useEffect(() => {
        const getRoleData = async () => {
            if (roleDetailsData && roleDetailsData.length > 0) {
                const filteredRoleData = roleDetailsData.find((r) => r.name === page.toLowerCase());
                setRoleData(filteredRoleData ?? null);
            }
            setIsLoading(false);
        }; 
        

        
        getRoleData();
    }, [page,roleDetailsData]);

    const actionsList = roleData?.action ? JSON.parse(roleData.action) : [];
    const hasPermission = actionsList.some((action: any) => action.name.toLowerCase() === requiredAction?.toLowerCase());

    if (isLoading) {
        return <Loading />;
    }

    if (!hasPermission) {
        return <NotAuthorized />;
    }

    return children;
};

export default AuthGuard;
