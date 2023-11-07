"use client";

import React, { useEffect, useReducer, useRef, useState } from "react";
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
import FormControlLabel from "@mui/material/FormControlLabel";

type UserRecord = Pick<User, "id" | "fullName" | "email"> & {
  selected?: boolean;
};

type _State = {
  users: UserRecord[];
};

type _Action =
  | {
      type: "toggle";
      payload: number[];
    }
  | {
      type: "set";
      payload: UserRecord[];
    };

function userSelectorReducer(state: _State, action: _Action) {
  const { type, payload } = action;
  let users = [];

  switch (type) {
    case "set":
      users = [...payload];
      break;
    case "toggle":
      users = state.users.map(u => ({
        ...u,
        selected: action.payload.includes(u.id || 0) ? !u.selected : u.selected,
      }));
      break;
  }

  return {
    ...state,
    users,
  };
}

export default function UserSelector() {
  const initState: _State = {
    users: [],
  };

  const [{ users }, dispatch] = useReducer(userSelectorReducer, initState);

  // const [users, setUsers] = useState<User[]>([]);
  const [rand, setRand] = useState(0);
  const [keyword, setKeyword] = useState("");
  const snapshot = useRef(users)

  const {
    status,
    isLoading,
    data: source,
  } = useQuery({
    queryKey: ["users-search", keyword, rand],
    queryFn: () =>
      fetchUserList({
        query: keyword,
        pageSize: 100,
        sortBy: "id",
        sortDir: "desc",
      }),
    select: data => data?.items || [],
  });

  const fuse = new Fuse(source || [], {
    keys: ["fullName", "email"],
    minMatchCharLength: 2, // ignore single match
  });

  useEffect(() => {
    if (status === "success") {
      console.log("api loaded", source);
      dispatch({ type: "set", payload: source });
    }
  }, [source, status]);

  useEffect(() => {
    console.log("reducer updated", users);
    snapshot.current = users;
  }, [users]);

  const handleSearch = (q: string) => {
    if (!q) {
      setRand(Date.now());
      return;
    }

    const result = fuse.search(q);

    if (result.length) {
      // use local result
      // setUsers(result.map(r => r.item));
      dispatch({ type: "set", payload: result.map(r => r.item) });
    } else {
      // trigger api search
      setKeyword(q);
    }
  };

  const handleAdd = () => {
    console.log('latest data', snapshot.current.filter(u => u.selected));
  }

  return (
    <div>
      <CommonSearch label="Member search" handleSearch={handleSearch} />
      <div>
        <List
          dense
          className="my-2 border border-slate-200 rounded max-h-[500px] overflow-auto"
        >
          {users.map((user, index) => (
            <ListItem
              key={user.id}
              className={index === 0 ? "" : `border-t border-slate-200`}
            >
              <FormControlLabel
                label={
                  <ListItemText>
                    <div>{user.fullName}</div>
                    <small>{user.email}</small>
                  </ListItemText>
                }
                onChange={() =>
                  dispatch({ type: "toggle", payload: [user.id || 0] })
                }
                control={
                  <Checkbox
                    checked={user.selected == null ? false : user.selected}
                  />
                }
              />
            </ListItem>
          ))}
        </List>
      </div>

      <Button size="small" variant="contained" onClick={handleAdd}>
        Add
      </Button>
    </div>
  );
}
