import { debounce, Pagination, TextField } from "@mui/material";
import { Stack } from "@mui/system";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useAppDispatch, useAppSelector } from "../../../store/store.hook";
import { getUsersInfoThunk } from "../../../store/users.slice";
import { useEffect, useState } from "react";
import { getSearchUsersThunk } from "../../../store/searchUser.slice";
import { getPageUsersThunk } from "../../../store/pageUsers.slice";

function UserPage() {
  const appDispatch = useAppDispatch();

  const [page, setPage] = useState(0);
  const [keyword, setKeyword] = useState("");

  const totalUser = useAppSelector(state => state.usersSlice.items);
  const searchUserList = useAppSelector(state => state.searchUserSlice.items);
  const usersItems = useAppSelector(state => state.pageUsersSlice.items);

  useEffect(() => {
    appDispatch(getUsersInfoThunk());
    appDispatch(getSearchUsersThunk(keyword));
    appDispatch(getPageUsersThunk(page));
  }, [keyword, page]);

  const handleSearch = debounce(event => {
    const term = event.target.value;
    setKeyword(term);
  }, 500);

  return (
    <Stack spacing={2} sx={{ width: "100%" }} className="text-center">
      UserPage
      <TextField
        id="outlined-basic"
        label="Search"
        variant="outlined"
        className="w-4/12"
        onChange={event => handleSearch(event)}
      />
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Full Name</TableCell>
              <TableCell align="left">Email</TableCell>
              <TableCell align="left">D.O.B</TableCell>
              <TableCell align="left">Identity Number</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {keyword !== "" && searchUserList.length > 0
              ? searchUserList &&
                searchUserList.length > 0 &&
                searchUserList.map(user => (
                  <TableRow
                    key={user.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {user.fullName}
                    </TableCell>
                    <TableCell align="left">{user.email}</TableCell>
                    <TableCell align="left">{user.dob}</TableCell>
                    <TableCell align="left">{user.identityNumber}</TableCell>
                  </TableRow>
                ))
              : usersItems &&
                usersItems.length > 0 &&
                usersItems.map(user => (
                  <TableRow
                    key={user.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {user.fullName}
                    </TableCell>
                    <TableCell align="left">{user.email}</TableCell>
                    <TableCell align="left">{user.dob}</TableCell>
                    <TableCell align="left">{user.identityNumber}</TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Pagination
        count={Math.floor(totalUser / 100)}
        color="primary"
        onChange={(event, value: any) => setPage(value)}
      />
    </Stack>
  );
}

export default UserPage;
