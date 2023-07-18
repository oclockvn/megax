import { Button, Grid } from "@mui/material";
import { DataGrid, GridColDef, GridSortModel } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Filter, PageModel } from "@/lib/models/common.model";
import { fetchDevicesThunk } from "@/store/devices.slice";
import { useAppDispatch, useAppSelector } from "@/store/store.hook";
import CustomPagination from "./components/CustomPagination";
import SearchDevice from "./components/SearchDevice";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import BlockIcon from "@mui/icons-material/Block";
import { formatMoney } from "@/lib/formatter";

import dateLib from "@/lib/datetime";

function DeviceListPage() {
  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Device Name",
      width: 300,
      renderCell: params => (
        <div>
          <NavLink to={`${params.id}`} className="text-blue-400">
            {params.value}
          </NavLink>
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
      headerName: "Device Type",
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
      valueFormatter: params =>
        dateLib.formatDate(new Date(params.value), "dd/MM/yyyy"),
    },
    {
      field: "warrantyToDate",
      headerName: "Warranty To",
      width: 150,
      valueFormatter: params =>
        params.value
          ? dateLib.formatDate(new Date(params.value), "dd/MM/yyyy")
          : "",
    },
    {
      field: "supplier",
      headerName: "Supplier",
      width: 200,
      sortable: false,
    },
  ];

  const appDispatch = useAppDispatch();
  const { loading, pagedDevices } = useAppSelector(state => state.deviceSlice);
  const [filter, setFilter] = useState<Partial<Filter>>({
    page: 0,
    pageSize: 100,
  });

  const pagingModel = {
    page: filter.page || 0,
    pageSize: filter.pageSize || 100,
  };

  const onPaging = (ev: PageModel) => {
    setFilter({
      ...filter,
      page: ev.page,
    });
  };

  const onSearch = (query: string) => {
    if (!query) {
      setFilter({});
    } else {
      setFilter({
        ...filter,
        query: query,
        sortBy: !query ? null : filter?.sortBy,
        sortDir: !query ? null : filter?.sortDir,
      });
    }
  };

  const onSorting = (event: GridSortModel) => {
    const sortBy = event && event[0] ? event[0].field : undefined;
    const sortDir = event && event[0] ? event[0].sort : undefined;

    setFilter({
      ...filter,
      sortBy: sortBy,
      sortDir: sortDir,
    });
  };

  useEffect(() => {
    appDispatch(fetchDevicesThunk(filter));
  }, [filter]);

  return (
    <>
      <div className="mb-4">
        <SearchDevice handleSearch={onSearch} />
      </div>
      <Grid item xs={6} textAlign={"right"} className=" pb-2">
        <Button
          variant="contained"
          color="primary"
          className="bg-blue-500"
          startIcon={<AddIcon />}
          href={`/devices/new`}
        >
          New Device
        </Button>
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
    </>
  );
}

export default DeviceListPage;
