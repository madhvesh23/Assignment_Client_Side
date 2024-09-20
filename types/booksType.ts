import {
  MRT_ColumnDef,
  MRT_FilterOption,
  LiteralUnion,
  MRT_SortingState,
  MRT_Row,
  MRT_TableInstance,
  MRT_Cell,
  MRT_ColumnFiltersState,
} from "mantine-react-table";
import { ReactNode } from "react";
export type User = {
	id: string;
	title: string;
	author: string;
	genre: string;
	publication_date: string;
	isbn: string;
  };
  
export type TTableColumns = User;

export type TMantineTableProps<TData extends TTableColumns> = {
  tableColumns: MRT_ColumnDef<TData>[];
  apiUrl: string;
  enableColumnFilterModes?: boolean;
  enableGlobalFilterModes?: boolean;
  enableColumnOrdering?: boolean;
  enableRowActions?: boolean;
  enableRowSelection?: boolean;
  globalFilterModeOptions?: MRT_FilterOption[] | null;
  columnFilterModeOptions?: Array<
    LiteralUnion<string & MRT_FilterOption>
  > | null;
  initialState?: {
    showColumnFilters?: boolean;
    showGlobalFilter?: boolean;
    sorting?: MRT_SortingState;
  };
  mantineSearchTextInputProps?: {
    placeholder: string;
  };
  renderRowActionMenuItems?: (props: {
    row: MRT_Row<TData>;
    table: MRT_TableInstance<TData>;
  }) => ReactNode;
  renderRowActions?: (props: {
    cell: MRT_Cell<TData>;
    row: MRT_Row<TData>;
    table: MRT_TableInstance<TData>;
  }) => ReactNode;
  enableGlobalFilter?: boolean;
  newCreateCustomComponent?: React.ReactNode;
  customFilters?: MRT_ColumnFiltersState;
  enableRowNumbers?: boolean;
  isReload?: boolean;

  enableExtraFilter: boolean;
};

export type TGetCommonModuleRes = {
  data: any;
  meta: {
    totalRowCount: number;
    statusCounts?: any;
  };
  success?: boolean;
};

