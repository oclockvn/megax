"use client";

import React, { useEffect, useState } from "react";
import CommonSearch from "../grid/CommonSearch";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";
import Button from "@mui/material/Button";
import { useQuery } from "@tanstack/react-query";
import { fetchUserList } from "@/lib/apis/user.api";
import Fuse from "fuse.js";
import { User } from "@/lib/models/user.model";

export default function UserSelector() {
  const [users, setUsers] = useState<User[]>([]);
  const [rand, setRand] = useState(0)
  const [keyword, setKeyword] = useState("");

  const { isLoading, data: source } = useQuery({
    queryKey: ["users-search", keyword, rand],
    queryFn: () =>
      fetchUserList({
        query: keyword,
        pageSize: 100,
        sortBy: "id",
        sortDir: "desc",
      }),
      select: data => data?.items || []
  });

  const fuse = new Fuse(source || [], {
    keys: ["fullName", "email"],
    minMatchCharLength: 2, // ignore single match
  });

  useEffect(() => {
    setUsers(source || []);
  }, [source]);

  const handleSearch = (q: string) => {
    if (!q) {
      setRand(Date.now())
      return;
    }

    const result = fuse.search(q);

    if (result.length) { // use local result
      setUsers(result.map(r => r.item));
    } else { // trigger api search
      setKeyword(q);
    }
  };

  return (
    <div>
      <CommonSearch label="Member search" handleSearch={handleSearch} />
      <div>
        <List
          disablePadding
          dense
          className="my-2 border border-slate-200 rounded max-h-[500px] overflow-auto"
        >
          {users.map((user, index) => (
            <ListItem
              key={user.id}
              disablePadding
              className={index === 0 ? "" : `border-t border-slate-200`}
            >
              <ListItemButton role={undefined} dense>
                <Checkbox edge="start" />
                <ListItemText>
                  <div>{user.fullName}</div>
                  <small>{user.email}</small>
                </ListItemText>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </div>

      <Button size="small" variant="contained">
        Add
      </Button>
    </div>
  );
}
