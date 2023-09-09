"use client";

import React from "react";

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
        className="p-2 bg-slate-100 border-b border-slate-300 text-sm"
      >
        {f.name}
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
