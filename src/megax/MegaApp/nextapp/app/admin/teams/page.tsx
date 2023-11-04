"use client";

import React, { useEffect } from "react";

import Link from "next/link";

import { useAppDispatch, useAppSelector } from "@/lib/store/state.hook";
import { fetchTeamsThunk } from "@/lib/store/teams.state";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import Avatar from "@mui/material/Avatar";

import { TeamQueryInclude } from "@/lib/models/team.model";
import { getInitial } from "@/lib/string.helper";
import AvatarGroup from "@mui/material/AvatarGroup";

export default function TeamPage() {
  const appDispatch = useAppDispatch();
  const { teams, loading } = useAppSelector(s => s.teams);

  useEffect(() => {
    appDispatch(fetchTeamsThunk({ include: TeamQueryInclude.Leader }));
  }, [appDispatch]);

  return (
    <div className="container mx-auto mt-4">
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell width={300}>Name</TableCell>
              <TableCell width={200}>Leaders</TableCell>
              <TableCell align="right">
                <Button variant="contained" size="small">
                  <AddIcon fontSize="inherit" className="me-2" />
                  Add
                </Button>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {teams.map(team => (
              <TableRow
                key={team.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell scope="row" width={300}>
                  <Link
                    href={`/admin/teams/${team.id}`}
                    className="text-blue-500"
                  >
                    {team.name}
                  </Link>
                </TableCell>
                <TableCell scope="row" width={200}>
                  <AvatarGroup className="[justify-content:start]">
                    {team.leaders?.map(l => (
                      <Avatar className="w-[32px] h-[32px] text-sm" key={l.memberId}>
                        {l.memberName ? getInitial(l.memberName) : "UNK"}
                      </Avatar>
                    ))}
                  </AvatarGroup>
                </TableCell>
                <TableCell align="right">
                  <IconButton size="small" color="error">
                    <CloseIcon fontSize="inherit" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
