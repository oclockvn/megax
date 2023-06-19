import { Pagination } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import { fetchSearchUser } from "../../../lib/apis/users.api";

function ShowSearchUsers({ keyword }) {
  console.log("keyword: ", keyword);
  //   const [page, setPage] = useState(0);
  const [userList, setUserList] = useState([]);
  const [totalUser, setTotalUser] = useState(1);

  useEffect(() => {
    getSearchUser(keyword);
  }, [keyword]);

  const getSearchUser = async keyword => {
    const res = await fetchSearchUser(keyword);
    if (res) {
      setTotalUser(res.total);
      setUserList(res.items);
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
      {totalUser > 100 && (
        <Pagination
          count={Math.floor(totalUser / 100)}
          color="primary"
          onChange={(event, value: any) => setPage(value)}
        />
      )}
    </>
  );
}

export default ShowSearchUsers;
