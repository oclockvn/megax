"use client";

import IconButton from "@mui/material/IconButton";
import React from "react";
import FileDownloadIcon from '@mui/icons-material/FileDownload';

declare type FileRef = {
  id: number;
  name: string;
  url: string;
};

export default function FileList({
  files,
  titleFormatter,
}: {
  files?: FileRef[];
  titleFormatter?: (count: number) => string;
}) {
  const selectedFiles =
    files?.map((f, i) => (
      <div
        key={i}
        className="p-2 bg-slate-100 border-b border-slate-300 text-sm flex items-center justify-between"
      >
        <span>
          {f.name}
        </span>
        <IconButton size="small">
          <FileDownloadIcon fontSize="small" />
        </IconButton>
      </div>
    )) || [];

  const len = selectedFiles?.length || 0;
  const title = titleFormatter
    ? titleFormatter(len)
    : `${len} selected ${len > 1 ? "files" : "file"}`;

  return selectedFiles.length > 0 ? (
    <>
      <div className="font-bold">{title}</div>
      <div className="text-sm">{selectedFiles}</div>
    </>
  ) : null;
}
