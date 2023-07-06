import { DataGrid, GridColDef, GridSortModel } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Filter, PageModel } from "../../../../lib/models/common.model";
import { fetchDevicesThunk } from "../../../../store/device.slice";
import { useAppDispatch, useAppSelector } from "../../../../store/store.hook";
import CustomPagination from "./components/CustomPagination";
import SearchDevice from "./components/SearchDevice";

function DeviceListPage() {
  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Device Name",
      width: 300,
      renderCell: params => (
        <NavLink to={`${params.id}`} className="text-blue-400">
          {params.value}
        </NavLink>
      ),
    },
    { field: "model", headerName: "Model", width: 300 },
    {
      field: "deviceCode",
      headerName: "Device Code",
      width: 300,
    },
    {
      field: "deviceType",
      headerName: "Device Type",
      width: 300,
    },
  ];

  const appDispatch = useAppDispatch();
  const { loading, pagedDevices } = useAppSelector(state => state.deviceSlice);
  console.log("pagedDevices: ", pagedDevices);
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
