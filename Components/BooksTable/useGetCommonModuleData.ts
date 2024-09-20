import { BASE_URL } from "@/constant";
import { TGetCommonModuleRes } from "@/types/booksType";
import { useQuery } from "@tanstack/react-query";
import {
  MRT_ColumnFilterFnsState,
  MRT_ColumnFiltersState,
  MRT_PaginationState,
  MRT_SortingState,
} from "mantine-react-table";

interface Params {
  columnFilterFns?: MRT_ColumnFilterFnsState; // Optional
  columnFilters?: MRT_ColumnFiltersState; // Optional
  globalFilter?: string; // Optional
  sorting?: MRT_SortingState; // Optional
  pagination?: MRT_PaginationState; // Optional
  apiUrl: string;
}

export default function useGetCommonModuleData({
  columnFilterFns = {},
  columnFilters = [],
  globalFilter = "",
  sorting = [],
  pagination = { pageIndex: 0, pageSize: 5 },
  apiUrl,
}: Params) {
  const fetchURL = new URL(apiUrl, BASE_URL);

  fetchURL.searchParams.set(
    "start",
    `${pagination.pageIndex * pagination.pageSize}`
  );
  fetchURL.searchParams.set("size", `${pagination.pageSize}`);
  fetchURL.searchParams.set("filters", JSON.stringify(columnFilters));
  fetchURL.searchParams.set("filterModes", JSON.stringify(columnFilterFns));
  fetchURL.searchParams.set("globalFilter", globalFilter);
  fetchURL.searchParams.set("sorting", JSON.stringify(sorting));

  const query = useQuery<TGetCommonModuleRes>({
    queryKey: [apiUrl, fetchURL.href],
    queryFn: async () => {
      return fetch(fetchURL.href).then((res) => res.json());
    },
    refetchOnWindowFocus: false,
  });

  return {
    ...query,
    refetch: query.refetch,
  };
}
