"use client";

import { delay } from "@/lib/util";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import React from "react";
import CommonSearch from "../grid/CommonSearch";

export default function UserSelector() {
  const handleSearch = (q: string) => {
    console.log(q);
  };

  return (
    <div>
      <CommonSearch keypress label="Member search" handleSearch={handleSearch} />
    </div>
  );
}
