"use client";

import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

declare type FileUploadProps = {
  maxFiles?: 1;
  accept?: Record<string, string[]> | undefined;
  title?: string;
};

export default function DropzoneWrapper(props: FileUploadProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Do something with the files
  console.log(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } =
    useDropzone({
      onDrop,
      accept: props?.accept,
      maxFiles: props?.maxFiles,
    });

  const selectedFiles = acceptedFiles.map((f, i) => (
    <div key={i}>{f.name}</div>
  ));

  return (
    <>
      <div className="" {...getRootProps({ className: "dropzone" })}>
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

      <div>{selectedFiles}</div>
    </>
  );
}
