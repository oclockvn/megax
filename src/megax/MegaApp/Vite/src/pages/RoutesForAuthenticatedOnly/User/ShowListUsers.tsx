import { Pagination } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import { fetchPageUser, fetchUsersInfo } from "../../../lib/apis/users.api";

function ShowListUsers() {
  const [page, setPage] = useState(0);
  const [totalUser, setTotalUser] = useState(1);
  const [userList, setUserList] = useState([]);

  useEffect(() => {
    getTotalUsers();
    getUserByPage(page);
  }, [page]);

  const getTotalUsers = async () => {
    const res = await fetchUsersInfo();
    if (res) {
      setTotalUser(res.total);
    }
  };

  const getUserByPage = async page => {
    const res = await fetchPageUser(page);
    if (res) {
      setUserList(res);
    }
  };

  return (
    <>
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
            {userList &&
              userList.length > 0 &&
              userList.map(user => (
                <TableRow
                  key={user.id}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                  }}
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
    </>
  );
}

export default ShowListUsers;
