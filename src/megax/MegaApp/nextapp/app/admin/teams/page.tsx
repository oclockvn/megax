"use client";

import React, { useEffect, useState } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useAppDispatch, useAppSelector } from "@/lib/store/state.hook";
import { fetchTeamsThunk } from "@/lib/store/teams.state";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import Avatar from "@mui/material/Avatar";

import { Team, TeamQueryInclude } from "@/lib/models/team.model";
import { getInitial } from "@/lib/string.helper";
import AvatarGroup from "@mui/material/AvatarGroup";
import Tooltip from "@mui/material/Tooltip";
import CircularProgress from "@mui/material/CircularProgress";
import CommonSearch from "@/components/grid/CommonSearch";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";

export default function TeamPage() {
  const appDispatch = useAppDispatch();
  const pathname = usePathname()
  const { teams, loading } = useAppSelector(s => s.teams);
  const [filtered, setFilter] = useState<Team[]>([]);

  useEffect(() => {
    appDispatch(fetchTeamsThunk({ include: TeamQueryInclude.Leader }));
  }, [appDispatch]);

  useEffect(() => {
    setFilter(teams);
  }, [teams]);

  if (loading) {
    return (
      <div className="text-center p-8">
        <CircularProgress size={32} />
      </div>
    );
  }

  const handleSearch = (q: string) => {
    setFilter(teams.filter(t => t.name.includes(q)));
  };

  return (
    <div className="container mx-auto mt-4">
      <div className="mb-4 flex justify-between items-center">
        <CommonSearch keypress handleSearch={handleSearch} />

        <Link href={`${pathname}/new`}>
          <Button variant="contained" startIcon={<AddIcon />}>
            Add Team
          </Button>
        </Link>
      </div>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell width={300}>Team</TableCell>
              <TableCell width={200}>Leaders</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map(team => (
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
                      <Tooltip key={l.memberId} title={l.memberName}>
                        <Avatar className="w-[32px] h-[32px] text-sm bg-blue-500">
                          {l.memberName ? getInitial(l.memberName) : "UNK"}
                        </Avatar>
                      </Tooltip>
                    ))}
                  </AvatarGroup>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
