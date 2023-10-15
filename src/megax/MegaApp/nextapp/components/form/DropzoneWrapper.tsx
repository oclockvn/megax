"use client";

import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import FileList from "@/components/common/FileList";

declare type FileUploadProps = {
  maxFiles?: 1;
  accept?: Record<string, string[]> | undefined;
  title?: string;
  fileSelected: (files: File[]) => void;
};

export default function DropzoneWrapper(props: FileUploadProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
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

  return (
    <>
      <div
        className="dropzone border-[3px] border-dashed p-6 flex items-center justify-center mb-4"
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

      <FileList
        files={acceptedFiles.map((f, i) => ({
          id: -i,
          name: f.name,
          url: f.webkitRelativePath,
        }))}
      />
    </>
  );
}
