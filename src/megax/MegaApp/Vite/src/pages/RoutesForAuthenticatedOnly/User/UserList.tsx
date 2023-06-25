import { DataGrid, GridColDef, GridSortModel } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import datetime from "../../../lib/datetime";
import { Filter, PageModel } from "../../../lib/models/common.model";
import { useAppDispatch, useAppSelector } from "../../../store/store.hook";
import { fetchUsersThunk } from "../../../store/user.slice";
import CustomPagination from "./components/CustomPagination";
import SearchUser from "./components/SearchUser";

const columns: GridColDef[] = [
  // {field: 'id', headerName: 'ID', width: 90}
  { field: "fullName", headerName: "Full Name", width: 300 },
  { field: "email", headerName: "Email", width: 300 },
  {
    field: "dob",
    headerName: "D.O.B",
    width: 300,

    valueFormatter: formatter =>
      formatter.value
        ? datetime.formatDate(new Date(formatter.value), "dd/MM/yyyy")
        : "",
  },
  {
    field: "identityNumber",
    headerName: "Identity Number",
    width: 300,
  },
];

function UserListPage() {
  const appDispatch = useAppDispatch();
  const { isLoading, pagedUsers } = useAppSelector(state => state.userSlice);

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
    appDispatch(fetchUsersThunk(filter));
  }, [filter]);

  return (
    <>
      <div className="mb-4">
        <SearchUser handleSearch={onSearch} />
      </div>

      <DataGrid
        rows={pagedUsers.items}
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
        rowCount={pagedUsers.total}
        paginationMode="server"
        paginationModel={pagingModel}
        onPaginationModelChange={onPaging}
        pageSizeOptions={[100]}
        sortingMode="server"
        onSortModelChange={onSorting}
        loading={isLoading}
        className="min-h-[400px]"
      />
    </>
  );
}

export default UserListPage;
