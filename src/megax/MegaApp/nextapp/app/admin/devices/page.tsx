"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { DataGrid, GridColDef, GridSortModel } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";

import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";
import BlockIcon from "@mui/icons-material/Block";
import CheckIcon from "@mui/icons-material/Check";

import { Filter, PageModel } from "@/lib/models/common.model";
import dateLib from "@/lib/datetime";
import { formatMoney } from "@/lib/formatter";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import { useQuery } from "@tanstack/react-query";
import { fetchDeviceList } from "@/lib/apis/devices.api";

const CustomPagination = dynamic(
  () => import("@/components/grid/CustomPagination"),
  { ssr: false }
);

const CommonSearch = dynamic(() => import("@/components/grid/CommonSearch"), {
  ssr: false,
});

export default function DeviceListPage() {
  const pathname = usePathname();

  const [filter, setFilter] = useState<Partial<Filter>>({
    page: 0,
    pageSize: 100,
  });

  const pagingModel = {
    page: filter.page || 0,
    pageSize: filter.pageSize || 100,
  };

  const { isLoading: loading, data: pagedDevices } = useQuery({
    queryKey: ["admin/devices", filter],
    queryFn: () => fetchDeviceList(filter),
  });

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Device name",
      width: 400,
      flex: 1,
      renderCell: params => (
        <div>
          <Link href={`${pathname}/${params.id}`} className="text-blue-400">
            {params.value}
          </Link>
          <div>
            <small className="text-gray-400">#{params.row.serialNumber}</small>
          </div>
        </div>
      ),
    },
    {
      field: "disabled",
      headerName: "Status",
      width: 100,
      renderCell: params =>
        params.value ? (
          <BlockIcon color="error" />
        ) : (
          <CheckIcon color="success" />
        ),
    },
    {
      field: "deviceType",
      headerName: "Type",
      width: 200,
    },
    {
      field: "price",
      headerName: "Price",
      width: 200,
      valueFormatter: params => formatMoney(params.value),
    },
    {
      field: "purchasedAt",
      headerName: "Purchased At",
      width: 150,
      valueFormatter: params => dateLib.formatDate(params.value, "dd/MM/yyyy"),
    },
    {
      field: "warrantyToDate",
      headerName: "Warranty To",
      width: 150,
      valueFormatter: params =>
        params.value ? dateLib.formatDate(params.value, "dd/MM/yyyy") : "",
    },
    // {
    //   field: "supplier",
    //   headerName: "Supplier",
    //   width: 200,
    //   sortable: false,
    // },
  ];

  const onPaging = (ev: PageModel) => {
    setFilter({
      ...filter,
      page: ev.page,
    });
  };

  const onSorting = (e: GridSortModel) => {
    const sortBy = e && e[0] ? e[0].field : undefined;
    const sortDir = e && e[0] ? e[0].sort : undefined;

    setFilter({
      ...filter,
      sortBy: sortBy,
      sortDir: sortDir,
    });
  };

  const onSearch = (q: string) => {
    if (!q) {
      setFilter({});
    } else {
      setFilter({
        ...filter,
        query: q,
        sortBy: !q ? null : filter?.sortBy,
        sortDir: !q ? null : filter?.sortDir,
      });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Grid container className="mb-4" alignItems={"center"}>
        <Grid item xs={6}>
          <CommonSearch handleSearch={onSearch} />
        </Grid>
        <Grid item xs={6} textAlign={"right"}>
          <Link href={`${pathname}/new`}>
            <Button variant="contained" color="primary" startIcon={<AddIcon />}>
              New Device
            </Button>
          </Link>
        </Grid>
      </Grid>

      <TableContainer component={Paper}>
        <DataGrid
          rows={pagedDevices?.items || []}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 100 },
            },
          }}
          pagination
          slots={{
            pagination: CustomPagination,
            loadingOverlay: LinearProgress,
          }}
          rowCount={pagedDevices?.total || 0}
          paginationMode="server"
          paginationModel={pagingModel}
          onPaginationModelChange={onPaging}
          pageSizeOptions={[100]}
          sortingMode="server"
          onSortModelChange={onSorting}
          loading={loading}
        />
      </TableContainer>
    </div>
  );
}
