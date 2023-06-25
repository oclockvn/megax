import { TablePaginationProps } from "@mui/base";
import {
  gridPageSizeSelector,
  GridPagination,
  gridRowCountSelector,
  useGridApiContext,
  useGridSelector,
} from "@mui/x-data-grid";
import MuiPagination from "@mui/material/Pagination";
import React, { useMemo } from "react";

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
    [rowCount, pageCount, pageSize, page]
  );
}

export default function CustomPagination(props: any) {
  return <GridPagination ActionsComponent={Pagination} {...props} />;
}
