import { useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { BaseModel } from '../sharedBase/modelInterface';
import { useBaseService } from '../sharedBase/baseService';
import { CachedState, ConditionParams, RoleConditionParams, SearchParams, TableSearchParams } from '../types/listpage';

export interface UseListQueryResult<T> {
  data: T[] | undefined;
  isLoading: boolean;
  error: Error | null;
  search: SearchParams;
  tableSearch: TableSearchParams;
  condition: ConditionParams;
  roleCondition: RoleConditionParams;
  load: () => void;
  setSearch: (search: SearchParams) => void;
  setTableSearch: (tableSearch: TableSearchParams) => void;
  clearSearch: (type: 'search' | 'table' | 'both') => void;
  setCondition: (condition: ConditionParams) => void;
  setRoleCondition: (roleCondition: RoleConditionParams) => void;
}

export const useListQuery = <T extends BaseModel>(
  baseService: ReturnType<typeof useBaseService>
): UseListQueryResult<T> => {
  const queryClient = useQueryClient();
  const service = baseService;

  const cachedState = queryClient.getQueryData<CachedState>([`list-${service.type}-state`]);

  const [search, setSearchState] = useState<SearchParams>(cachedState?.search || {});
  const [tableSearch, setTableSearchState] = useState<TableSearchParams>(
    cachedState?.tableSearch || {
      sortField: '',
      sortOrder: '',
      first: 0,
      rows: 10,
      filter: '',
      top: '',
      left: '',
      searchRowFilter: {},
    }
  );
  const [condition, setConditionState] = useState<ConditionParams>(cachedState?.condition || {});
  const [roleCondition, setRoleConditionState] = useState<RoleConditionParams>(cachedState?.roleCondition || {});
  const hasSetRoleCondition = useRef(false);
  
  const payload = { ...condition, ...search, ...roleCondition };
  const isPayloadEmpty = Object.keys(payload).length === 0;
  const shouldWait = Object.keys(roleCondition).length === 0 && !hasSetRoleCondition.current;
  const isQueryEnabled = !shouldWait || !isPayloadEmpty;

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [`list-${service.type}`, payload],
    queryFn: () => service.getAll(payload),
    staleTime: 1000 * 60 * 5,
    enabled: isQueryEnabled,
    // select: (data) => Array.isArray(data) ? [...data].reverse() : data,
  });

  const saveStateToCache = () => {
    queryClient.setQueryData([`list-${service.type}-state`], {
      search,
      tableSearch,
      condition,
      roleCondition,
    });
  };

  const setSearch = (newSearch: SearchParams) => {
    setSearchState((prev: SearchParams) => {
      const updated = { ...prev, ...newSearch };
      queryClient.setQueryData([`list-${service.type}-state`], {
        search: updated,
        tableSearch,
        condition,
        roleCondition,
      });
      return updated;
    });
  };

  const setTableSearch = (newTableSearch: Partial<TableSearchParams>) => {
    setTableSearchState((prev) => {
      const updated = { ...prev, ...newTableSearch };
      queryClient.setQueryData([`list-${service.type}-state`], {
        search,
        tableSearch: updated,
        condition,
        roleCondition,
      });
      return updated;
    });
  };

  const clearSearch = (type: 'search' | 'table' | 'both') => {

    if (type === 'search') {
      setSearchState({});
      setSearch({});
    }

    if (type === 'table') {
      setTableSearchState({
        sortField: '',
        sortOrder: '',
        first: 0,
        rows: 10,
        filter: '',
        top: '',
        left: '',
        searchRowFilter: {},
      });
    }

    if (type === 'both') {
      setSearchState({});
      setTableSearchState({
        sortField: '',
        sortOrder: '',
        first: 0,
        rows: 10,
        filter: '',
        top: '',
        left: '',
        searchRowFilter: {},
      });
    }
    saveStateToCache();
  };

  const setCondition = (newCondition: ConditionParams) => {
    setConditionState(newCondition);
    saveStateToCache();
  };

  const setRoleCondition = (newRoleCondition: RoleConditionParams) => {
    hasSetRoleCondition.current = true;
    setRoleConditionState((prev: RoleConditionParams) => {
      const updated = { ...prev, ...newRoleCondition };
      queryClient.setQueryData([`list-${service.type}-state`], {
        search,
        tableSearch,
        condition,
        roleCondition: updated,
      });
      return updated;
    });
  };

  const load = () => {
    setTimeout(() => {
      refetch();
    }, 10);
  };


  return {
    data: data as T[] | undefined,
    isLoading,
    error: error as Error | null,
    search,
    tableSearch,
    condition,
    roleCondition,
    load,
    setSearch,
    setTableSearch,
    clearSearch,
    setCondition,
    setRoleCondition,
  };
};
