import { useEffect, useState } from 'react';
import { useFetchRoleDetailsData } from '../sharedBase/lookupService';

type UseEditPageProps = {
    props: {
        id?: number;
        baseModelName?: string;
        typeName?: string;
    };
};

export function useViewPage({ props }: UseEditPageProps) {
    const baseModelName: string = props.baseModelName || '';
    const typeName: string = props.typeName || '';
    const [hiddenFields, setHiddenFields] = useState<string[]>([]);
    const { data: roleDetailsData } = useFetchRoleDetailsData();

    useEffect(() => {
        const fetchRoleDetails = async () => {
            if (!props.typeName) return;
            
            if (roleDetailsData && roleDetailsData.length > 0) {
                const modelData = roleDetailsData.find((r: any) => r.name.toLowerCase() === typeName!.toLowerCase());
                if (modelData?.hideColumn) {
                    let parsedColumns: { value: string }[] = [];
                    try {
                        parsedColumns = JSON.parse(modelData.hideColumn);
                        // const hiddenFieldNames = parsedColumns.map((column: any) => column.value);
                        // setHiddenFields(hiddenFieldNames);
                    } catch (error) {
                        console.error('Error parsing hideColumn:', error);
                    }
                    if (Array.isArray(parsedColumns)) {
                        const hiddenFieldNames = parsedColumns.map((column) => column.value);
                        setHiddenFields(hiddenFieldNames);
                    }
                }
            }
        };
        fetchRoleDetails();
    }, [typeName, roleDetailsData]);

    const isFieldHidden = (fieldName: string) => {
        return hiddenFields.includes(fieldName);
    };

    return {
        isFieldHidden,
    };
}
