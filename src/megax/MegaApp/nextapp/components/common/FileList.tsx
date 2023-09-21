"use client";

import IconButton from "@mui/material/IconButton";
import React from "react";
import FileDownloadIcon from '@mui/icons-material/FileDownload';

import { saveAs } from 'file-saver';
import { download } from "@/lib/api";

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
  const handleDownloadFile = async (file: FileRef) => {
    const blob = await download(file.id);
    saveAs(blob, file.name);
  }

  const selectedFiles =
    files?.map((f, i) => (
      <div
        key={i}
        className="p-2 bg-slate-100 border-b border-slate-300 text-sm flex items-center justify-between"
      >
        <span>
          {f.name}
        </span>
        {f.id > 0 && <IconButton size="small" onClick={() => handleDownloadFile(f)}>
          <FileDownloadIcon fontSize="small" />
        </IconButton>}
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
