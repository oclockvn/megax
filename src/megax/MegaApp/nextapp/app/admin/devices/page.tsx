"use client";

import { useState, useEffect } from "react";
import { DataGrid, GridColDef, GridSortModel } from "@mui/x-data-grid";
import { useAppDispatch, useAppSelector } from "@/lib/store/state.hook";
import { Filter, PageModel } from "@/lib/models/common.model";
import AddIcon from "@mui/icons-material/Add";

import CustomPagination from "@/components/grid/CustomPagination";
import CommonSearch from "@/components/grid/CommonSearch";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { fetchDevicesThunk } from "@/lib/store/devices.state";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";

export default function DeviceListPage() {
  const pathname = usePathname();
  const appDispatch = useAppDispatch();
  const { loading, pagedDevices } = useAppSelector(s => s.devices);
  const [filter, setFilter] = useState<Partial<Filter>>({
    page: 0,
    pageSize: 100,
  });
  const pagingModel = {
    page: filter.page || 0,
    pageSize: filter.pageSize || 100,
  };

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Device name",
      width: 400,
      renderCell: params => (
        <Link href={`${pathname}/${params.id}`} className="text-blue-400">
          {params.value}
        </Link>
      ),
    },
    { field: "model", headerName: "Model", width: 300 },
    {
      field: "deviceCode",
      headerName: "Device code",
      width: 150,
    },
    {
      field: "deviceType",
      headerName: "Type",
      width: 200,
    },
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

  useEffect(() => {
    appDispatch(fetchDevicesThunk(filter));
  }, [filter]);

  // for initial load
  useEffect(() => {
    onPaging(new PageModel());
  }, []);

  return (
    <div className="p-4 min-h-[400px]">
      <Grid container className="mb-4" alignItems={"center"}>
        <Grid item xs={6}>
          <CommonSearch handleSearch={onSearch} />
        </Grid>
        <Grid item xs={6} textAlign={"right"}>
          <Button
            variant="contained"
            color="primary"
            className="bg-blue-500"
            startIcon={<AddIcon />}
            href={`${pathname}/new`}
          >
            New Device
          </Button>
        </Grid>
      </Grid>

      <DataGrid
        rows={pagedDevices.items}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 100 },
          },
        }}
        pagination
        slots={{
          pagination: CustomPagination,
        }}
        rowCount={pagedDevices.total}
        paginationMode="server"
        paginationModel={pagingModel}
        onPaginationModelChange={onPaging}
        pageSizeOptions={[100]}
        sortingMode="server"
        onSortModelChange={onSorting}
        loading={loading}
        className="min-h-[400px]"
      />
    </div>
  );
}
