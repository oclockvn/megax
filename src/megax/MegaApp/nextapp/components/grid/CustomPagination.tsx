import { useMemo } from "react";
import {
  GridPagination,
  useGridApiContext,
  useGridSelector,
  gridRowCountSelector,
  gridPageSizeSelector,
} from "@mui/x-data-grid";
import MuiPagination from "@mui/material/Pagination";
import { TablePaginationProps } from "@mui/material/TablePagination";

function Pagination({
  page,
  onPageChange,
  className,
}: Pick<TablePaginationProps, "page" | "onPageChange" | "className">) {
  const apiRef = useGridApiContext();
  const rowCount = useGridSelector(apiRef, gridRowCountSelector);
  const pageSize = useGridSelector(apiRef, gridPageSizeSelector);
  const pageCount = Math.ceil(rowCount / pageSize);

  return useMemo(
    () => (
      <MuiPagination
        color="primary"
        className={className}
        count={pageCount}
        page={page + 1}
        onChange={(event, newPage) => {
          onPageChange(event as any, newPage - 1);
        }}
      />
    ),
    [rowCount, pageSize, pageCount, page]
  );
}

export default function CustomPagination(props: any) {
  return <GridPagination ActionsComponent={Pagination} {...props} />;
}
