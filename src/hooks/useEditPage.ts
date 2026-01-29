import { useEffect, useState } from 'react';
import { UseListQueryResult } from '../store/useListQuery';
import { useFetchRoleDetailsData } from '../sharedBase/lookupService';


type UseEditPageProps<TItem> = {
    props: {
        id?: string;
        baseModelName?: string;
        typeName?: string;
        listQuery?: UseListQueryResult<TItem>
    };
};

export function useEditPage<TItem>({ props }: UseEditPageProps<TItem>) {
    const [hiddenFields, setHiddenFields] = useState<string[]>([]);
    const { data: roleDetailsData } = useFetchRoleDetailsData();

    useEffect(() => {
        const fetchRoleDetails = async () => {
            if (!props.typeName) return;

            if (roleDetailsData && roleDetailsData.length > 0) {
                const modelData = roleDetailsData.find((r: any) => props.typeName && r.name.toLowerCase() === props.typeName!.toLowerCase());
                if (modelData?.hideColumn) {
                    let parsedColumns: { value: string }[] = [];

                    try {
                        parsedColumns = JSON.parse(modelData.hideColumn);
                    } catch {
                        console.error("Invalid JSON in hideColumn", modelData.hideColumn);
                    }

                    if (Array.isArray(parsedColumns)) {
                        const hiddenFieldNames = parsedColumns.map((column) => column.value);
                        setHiddenFields(hiddenFieldNames);
                    }
                }
            }
        };
        fetchRoleDetails();
    }, [props.typeName, roleDetailsData]);

    const isFieldHidden = (fieldName: string) => {
        return hiddenFields.includes(fieldName);
    };

    const removeEmptyFields = (obj: Record<string, any>): Record<string, any> => {
        return Object.keys(obj).reduce((acc: any, key) => {
            if (obj[key] !== '' && obj[key] !== undefined && obj[key] !== null) {
                acc[key] = obj[key];
            }
            return acc;
        }, {});
    };

    const isValidDate = (date: any): boolean => {
        return date instanceof Date && !isNaN(date.getTime());
    };

    const formatDate = (date: Date) => {
        const year = date.getFullYear();
        const month = `${date.getMonth() + 1}`.padStart(2, '0');
        const day = `${date.getDate()}`.padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    return {
        removeEmptyFields,
        isFieldHidden,
        isValidDate,
        prepareObject,
        formatDate
    };


}

export function prepareObject<T>(source: Partial<T>, defaults: T): T {
    const result: T = { ...defaults };

    for (const key in defaults) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
            const value = source[key as keyof T];

            if (value instanceof Date) {
                result[key as keyof T] = (value as Date).toISOString() as unknown as T[keyof T];
            } else if (value !== undefined && value !== null) {
                result[key as keyof T] = value;
            } else {
                result[key as keyof T] = defaults[key as keyof T];
            }
        }
    }

    return result;
}
