"use client";

import React, { memo, useEffect, useReducer, useRef } from "react";
import CommonSearch from "../grid/CommonSearch";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";
import Button from "@mui/material/Button";
import { useQuery } from "@tanstack/react-query";
import { fetchUserList } from "@/lib/apis/user.api";
import Fuse from "fuse.js";
import { User } from "@/lib/models/user.model";
import FormControlLabel from "@mui/material/FormControlLabel";
import Skeleton from "@mui/material/Skeleton";
import { makeArrOf } from "@/lib/helpers/array";

type UserRecord = Pick<User, "id" | "fullName" | "email"> & {
  selected?: boolean;
};

type _State = {
  users: UserRecord[];
  keyword?: string;
  rand: number;
};

type _Action =
  | {
      type: "toggle";
      payload: number[];
    }
  | {
      type: "set";
      payload: UserRecord[];
    }
  | {
      type: "reload";
      payload: { keyword: string; rand: number };
    };

function userSelectorReducer(state: _State, action: _Action) {
  const { type, payload } = action;
  let users: UserRecord[] = [];

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
    case "reload":
      return {
        ...state,
        keyword: payload.keyword,
        rand: payload.rand,
      };
  }

  return {
    ...state,
    users,
  };
}

type UserSelectorProps = {
  onOk: (selected: Pick<User, "id" | "fullName">[]) => void;
  onCancel: () => void;
};

export default function UserSelector({ onOk, onCancel }: UserSelectorProps) {
  const initState: _State = {
    users: [],
    keyword: "",
    rand: 0,
  };

  const [{ users, keyword, rand }, dispatch] = useReducer(
    userSelectorReducer,
    initState
  );
  const snapshot = useRef(users);

  const {
    status,
    isLoading,
    data: source,
  } = useQuery({
    queryKey: ["users-search", keyword, rand],
    queryFn: () =>
      fetchUserList({
        query: keyword,
        pageSize: 500,
        sortBy: "id",
        sortDir: "desc",
      }),
    select: data => data?.items || [],
  });

  const fuse = new Fuse(source || [], {
    keys: ["fullName", "email"],
    minMatchCharLength: 2, // ignore single match
    threshold: 0.5,
  });

  useEffect(() => {
    // api effect
    if (status === "success") {
      dispatch({ type: "set", payload: source });
    }
  }, [source, status]);

  useEffect(() => {
    // reducer effect
    snapshot.current = users;
  }, [users]);

  const handleSearch = (q: string) => {
    if (!q) {
      dispatch({
        type: "reload",
        payload: {
          keyword: "",
          rand: Date.now(),
        },
      });
      return;
    }

    const result = fuse.search(q);

    if (result.length) {
      dispatch({ type: "set", payload: result.map(r => r.item) });
    } else {
      // trigger api search
      dispatch({ type: "reload", payload: { keyword: q, rand: Date.now() } });
    }
  };

  const handleAdd = () => {
    onOk(
      snapshot.current
        .filter(u => u.selected)
        .map(({ id, fullName }) => ({ id, fullName }))
    );
  };

  const LoadingSkeleton = () => (
    <div className="flex items-center gap-4 px-4 py-2">
      <div>
        <Skeleton variant="rectangular" width={20} height={20} />
      </div>

      <div>
        <Skeleton variant="text" width={400} />
        <Skeleton variant="text" width={200} />
      </div>
    </div>
  );

  const LoadingList = memo(() => {
    return (
      <>
        {makeArrOf(3, i => (
          <div className="border-b border-slate-200" key={i}>
            <LoadingSkeleton />
          </div>
        ))}
      </>
    );
  });

  return (
    <div>
      <CommonSearch label="Member search" handleSearch={handleSearch} />
      <div>
        {isLoading ? (
          <div className="border border-slate-200 rounded my-2">
            <LoadingList />
          </div>
        ) : users.length == 0 ? (
          <div className="py-4">No user found</div>
        ) : (
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
        )}
      </div>

      <div className="mt-4">
        <Button variant="contained" onClick={handleAdd} className="px-8 me-4">
          Add
        </Button>

        <Button variant="text" onClick={() => onCancel()}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
