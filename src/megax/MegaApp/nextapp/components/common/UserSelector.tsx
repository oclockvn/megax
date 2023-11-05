"use client";

import React from "react";
import CommonSearch from "../grid/CommonSearch";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";
import Button from "@mui/material/Button";

export default function UserSelector() {
  const handleSearch = (q: string) => {
    console.log(q);
  };

  return (
    <div>
      <CommonSearch
        keypress
        label="Member search"
        handleSearch={handleSearch}
      />
      <List
        disablePadding
        dense
        className="my-2 border border-slate-200 rounded"
      >
        {[1, 2, 3].map((i, index) => (
          <ListItem
            key={i}
            disablePadding
            className={index === 0 ? "" : `border-t border-slate-200`}
          >
            <ListItemButton role={undefined} dense>
              <Checkbox edge="start" />
              <ListItemText>
                <div>Quang Phan</div>
                <small>quang@spiderbox.design</small>
              </ListItemText>
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Button size="small" variant="contained">
        Add
      </Button>
    </div>
  );
}
