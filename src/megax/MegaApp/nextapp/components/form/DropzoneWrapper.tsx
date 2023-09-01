"use client";

import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

declare type FileUploadProps = {
  maxFiles?: 1;
  accept?: Record<string, string[]> | undefined;
  title?: string;
  fileSelected: (files: File[]) => void;
};

export default function DropzoneWrapper(props: FileUploadProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    // console.log(acceptedFiles);
    if (acceptedFiles.length) {
      props.fileSelected(acceptedFiles);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } =
    useDropzone({
      onDrop,
      accept: props?.accept,
      maxFiles: props?.maxFiles,
    });

  const selectedFiles = acceptedFiles.map((f, i) => (
    <div key={i} className="p-2 bg-slate-100 border-b border-slate-300 text-sm">
      {f.name}
    </div>
  ));

  return (
    <>
      <div
        className="dropzone border-[3px] border-dashed p-6 flex items-center justify-center"
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>
            {props.title ||
              "Drag 'n' drop some files here, or click to select files"}
          </p>
        )}
      </div>

      {selectedFiles.length > 0 && (
        <>
          <div className="mt-4 font-bold">
            {selectedFiles.length} selected{" "}
            {selectedFiles.length > 1 ? "files" : "file"}
          </div>
          <div className="text-sm">{selectedFiles}</div>
        </>
      )}
    </>
  );
}
