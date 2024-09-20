"use client";

import { TMantineTableProps, TTableColumns, User } from "@/types/booksType";

import { ActionIcon, Button, Group, Tooltip } from "@mantine/core";
import { IconDownload, IconRefresh } from "@tabler/icons-react";
import { download, generateCsv, mkConfig } from "export-to-csv";
import {
  MRT_ColumnDef,
  MRT_ColumnFilterFnsState,
  MRT_ColumnFiltersState,
  MRT_PaginationState,
  MRT_Row,
  MRT_SortingState,
  MantineReactTable,
  useMantineReactTable,
} from "mantine-react-table";
import { useEffect, useMemo, useState } from "react";
import useGetCommonModuleData from "./useGetCommonModuleData";

const csvConfig = mkConfig({
  fieldSeparator: ",",
  decimalSeparator: ".",
  useKeysAsHeaders: true,
});
const BooksTable = <TData extends TTableColumns>(
  props: TMantineTableProps<TData>
) => {
  const {
    tableColumns,
    apiUrl,
    customFilters,
    enableColumnFilterModes,
    enableColumnOrdering,
    enableRowActions,
    enableRowSelection,
    columnFilterModeOptions,
    initialState,
    mantineSearchTextInputProps,
    renderRowActionMenuItems,
    renderRowActions,
    enableGlobalFilter,
    newCreateCustomComponent,
    enableRowNumbers = false,
    isReload,
  } = props;

  const columns = useMemo<MRT_ColumnDef<User>[]>(() => tableColumns as any, []);

  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>(
    []
  );
  const [columnFilterFns, setColumnFilterFns] =
    useState<MRT_ColumnFilterFnsState>(
      Object.fromEntries(
        columns.map(({ accessorKey }) => [accessorKey, "contains"])
      )
    );
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<MRT_SortingState>([]);
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });
  const [rowCount, setRowCount] = useState(0);
  const [tableData, setTableData] = useState<TTableColumns[]>([]);

  const { data, isError, refetch, isFetching, isFetched } =
    useGetCommonModuleData({
      columnFilterFns,
      columnFilters,
      globalFilter,
      pagination,
      sorting,
      apiUrl,
    });
  const handleExportRows = (rows: MRT_Row<User>[]) => {
    const rowData = rows.map((row) => row.original);
    const csv = generateCsv(csvConfig)(rowData);
    download(csvConfig)(csv);
  };
  useEffect(() => {
    isReload && refetch();
  }, [isReload]);

  const fetchDataSet = () => {
    if (isFetched && data?.success) {
      setTableData(data?.data || []);
      setRowCount(data?.meta?.totalRowCount || 0);
    } else {
      setTableData([]);
    }
  };
  useEffect(() => {
    fetchDataSet();
  }, [data]);

  const filterUpdate = () => {
    setPagination({
      pageIndex: 0,
      pageSize: 5,
    });
    const newFilters = [...columnFilters];

    customFilters &&
      customFilters.forEach((customFilter) => {
        const filterIndex = newFilters.findIndex(
          (filter) => filter.id === customFilter.id
        );
        const isNewValue = filterIndex === -1;
        newFilters.splice(
          isNewValue ? 0 : filterIndex,
          isNewValue ? 0 : 1,
          customFilter
        );
      });

    setColumnFilters(newFilters);
  };

  useEffect(() => {
    filterUpdate();
  }, [customFilters]);

  useEffect(() => {
    initialState?.sorting && setSorting(initialState?.sorting);
  }, []);

  const table = useMantineReactTable({
    data: tableData as any,
    enableStickyHeader: true,
    enableStickyFooter: true,
    columns: columns as any,
    enableColumnFilterModes,
    enableColumnOrdering,
    enableRowActions,
    enableRowSelection,
    columnFilterModeOptions,
    initialState: {
      ...initialState,
      columnFilterFns,
      columnFilters,
      globalFilter,
      isLoading: isFetching,
      pagination,
      showAlertBanner: isError,
      sorting,
      density: "xs",
    },
    mantineSearchTextInputProps,
    enableGlobalFilter,
    renderRowActions,
    renderRowActionMenuItems,
    manualFiltering: true,
    manualSorting: true,
    enablePagination: true,
    mantineTableHeadCellProps: { align: "center" },
    mantineTableBodyCellProps: { align: "center" },
    mantineToolbarAlertBannerProps: isError
      ? {
          color: "red",
          children: "Error loading data",
        }
      : undefined,
    onColumnFilterFnsChange: setColumnFilterFns,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    renderTopToolbarCustomActions: ({ table }) => (
      <Group justify="space-between">
        <Tooltip label="Refresh Data">
          <ActionIcon onClick={() => refetch()}>
            <IconRefresh />
          </ActionIcon>
        </Tooltip>
        {newCreateCustomComponent}
        <Button
          disabled={table.getPrePaginationRowModel().rows.length === 0}
          onClick={() =>
            handleExportRows(table.getPrePaginationRowModel().rows as any)
          }
          leftSection={<IconDownload />}
          variant="filled"
        >
          Export All Rows
        </Button>
        <Button
          disabled={table.getRowModel().rows.length === 0}
          onClick={() => handleExportRows(table.getRowModel().rows as any)}
          leftSection={<IconDownload />}
          variant="filled"
        >
          Export Page Rows
        </Button>
      </Group>
    ),
    paginationDisplayMode: "custom",
    positionToolbarAlertBanner: "bottom",
    rowCount: rowCount,
    pageCount: rowCount / pagination.pageSize,
    mantineTableProps: { style: { tableLayout: "fixed" } },
    mantinePaginationProps: {
      rowsPerPageOptions: ["5", "10", "15", "20"],
      default: true,
      radius: "md",
      size: "md",
    },
    state: {
      columnFilterFns,
      columnFilters,
      globalFilter,
      isLoading: isFetching,
      pagination,
      showAlertBanner: isError,
      sorting,
    },
    positionActionsColumn: "last",
    enableRowNumbers,

    mantineTableContainerProps: {
      style: { height: "auto", width: "100%" },
    },
    mantineTableBodyProps: {
      style: { height: "auto" },
    },
  });

  return <MantineReactTable table={table} />;
};

export default BooksTable;
