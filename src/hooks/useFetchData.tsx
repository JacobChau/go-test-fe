import * as React from "react";
import { SetStateAction, useCallback, useEffect, useState } from "react";
import {
  SearchColumn,
  SearchCriteria,
} from "@components/Search/SearchComponent.tsx";
import {
  ApiResponse,
  Identity,
  PaginationState,
  QueryParams,
  Resource,
} from "@/types/apis";
import { SearchType } from "@/constants/search.ts";

interface UseFetchDataReturn<ItemType> {
  items: ItemType[];
  loading: boolean;
  setLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
  pagination: PaginationState;
  searchCriteria: SearchCriteria;
  searchTerm: string;
  handlePageChange: (event: any, newPage: number) => void;
  handleRowsPerPageChange: (event: { target: { value: string } }) => void;
  handleSearchChange: (criteria: SearchCriteria) => void;
  handleSearchTermChange: (term: string) => void;
  handleFilterChange: (newFilters: any) => void;
  fetchData: () => void;
  filters: any;
}

function useFetchData<ItemType>(
  fetchFunction: (
    params?: QueryParams,
    id?: string,
  ) => Promise<ApiResponse<Resource<ItemType>[]>>,
  initialPagination: PaginationState,
  searchColumn?: SearchColumn,
  id?: string,
): UseFetchDataReturn<ItemType & Identity> {
  const [items, setItems] = useState<Array<ItemType & Identity>>([]);
  const [pagination, setPagination] =
    useState<PaginationState>(initialPagination);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchCriteria, setSearchCriteria] = useState<SearchCriteria>({
    type: SearchType.Contain,
    column: searchColumn ? searchColumn : undefined,
  });

  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [filters, setFilters] = useState({});

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, meta } = await fetchFunction(
        {
          page: pagination.page + 1,
          perPage: pagination.perPage,
          searchType: searchCriteria.type,
          searchKeyword: debouncedSearchTerm,
          searchColumn: searchCriteria.column?.key,
          filters,
        },
        id,
      );

      const items = Array.isArray(data) ? data : [data];
      setItems(items.map((item) => ({ ...item.attributes, id: item.id })));

      if (meta) {
        setPagination((prev) => ({ ...prev, total: meta.total }));
      }
    } catch (error) {
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  }, [
    pagination.page,
    pagination.perPage,
    searchCriteria,
    filters,
    debouncedSearchTerm,
  ]);

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchData().catch((error) =>
        console.error("Failed to fetch data:", error),
      );
    }, 500);

    return () => clearTimeout(handler);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    fetchData().catch((error) => console.error("Failed to fetch data:", error));
  }, [pagination.page, pagination.perPage, searchCriteria, filters]);

  const handlePageChange = useCallback(
    (_event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
      setPagination({
        ...pagination,
        page: newPage,
      });
    },
    [],
  );

  const handleRowsPerPageChange = useCallback(
    (event: { target: { value: string } }) => {
      setPagination({
        ...pagination,
        page: 0,
        perPage: parseInt(event.target.value, 10),
      });
    },
    [pagination.perPage, pagination.page],
  );

  const handleSearchChange = (criteria: SetStateAction<SearchCriteria>) => {
    setSearchCriteria(criteria);
    setPagination({ ...initialPagination, page: 0 });
  };
  const handleSearchTermChange = (term: SetStateAction<string>) => {
    setDebouncedSearchTerm(term);
    setPagination({ ...initialPagination, page: 0 });
  };
  const handleFilterChange = (newFilters: SetStateAction<any>) => {
    setFilters(newFilters);
    setPagination({ ...initialPagination, page: 0 });
  };

  return {
    items,
    loading,
    setLoading,
    error,
    setError,
    searchTerm: debouncedSearchTerm,
    pagination,
    searchCriteria,
    handlePageChange,
    handleRowsPerPageChange,
    handleSearchChange,
    handleSearchTermChange,
    handleFilterChange,
    fetchData,
    filters,
  };
}

export default useFetchData;
