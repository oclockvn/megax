"use client";

import {
  DatePickerElement,
  FormContainer,
  SelectElement,
  TextFieldElement,
} from "react-hook-form-mui";
import Button from "@mui/material/Button";
import { Document as UserDocument } from "@/lib/models/document.model";
import Grid from "@mui/material/Grid";
import DropzoneWrapper from "@/components/form/DropzoneWrapper";
import FileList from "@/components/common/FileList";
import { useReducer, useRef } from "react";
import { createUpdateDocument } from "@/lib/apis/user.api";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Alert from "@mui/material/Alert";

type UserDocumentFormProps = {
  userId: number;
  document: Partial<UserDocument>;
  handleClose: (document?: Partial<UserDocument>) => void;
};

type UserDocumentFormState = {
  loading: boolean;
  error?: string;
};

type Action = {
  type: "patch";
  payload: Partial<UserDocumentFormState>;
};

function userDocumentFormReducer(state: UserDocumentFormState, action: Action) {
  switch (action.type) {
    case "patch":
      return {
        ...state,
        ...action.payload,
      } as UserDocumentFormState;
  }
}

export default function UserDocumentForm(props: UserDocumentFormProps) {
  const { document, handleClose, userId } = props;
  const [state, dispatch] = useReducer(userDocumentFormReducer, {
    loading: false,
    error: undefined,
  } as UserDocumentFormState);

  const { loading, error } = state;
  const filesRef = useRef<File[]>([]);

  const saveHandler = useMutation({
    mutationFn: ({
      document,
      files,
    }: {
      document: Partial<UserDocument>;
      files?: File[];
    }) => createUpdateDocument(userId, document, files),
    onMutate: () =>
      dispatch({ type: "patch", payload: { loading: true, error: undefined } }),
    onSuccess: result => {
      result.success
        ? toast.success("Document saved successfully")
        : toast.error("Something went wrong");

      handleClose(result.data);
    },
    onError: err => {
      dispatch({
        type: "patch",
        payload: {
          loading: false,
          error: err.message,
        },
      });
    },
  });

  const handleSubmit = async (doc: Partial<UserDocument>) => {
    await saveHandler.mutateAsync({ document: doc, files: filesRef.current });
  };

  const handleFileChanged = (files: File[]) => {
    filesRef.current = [...files];
  };

  const documentTypes = [
    "CMND",
    "CCCD",
    "Identity Card",
    "CV",
    "Application",
  ].map(x => ({
    id: x.toLowerCase().replace(/\W/, _ => "_"),
    label: x,
  }));

  const files =
    document.fileReferences?.map(f => ({
      id: f.id,
      name: f.fileName,
      url: f.url,
    })) || [];

  return (
    <>
      <div className="p-4 w-[500px]">
        <h4 className="uppercase !text-[1.2rem] font-semibold mb-4">
          {Number(document?.id) > 0
            ? `Viewing ${document.documentType} ${document.documentNumber}`
            : "Edit document"}
        </h4>

        <FormContainer values={document} onSuccess={handleSubmit}>
          <div className="mb-4">
            <SelectElement
              fullWidth
              required
              label="Document type"
              name="documentType"
              options={documentTypes}
            />
          </div>

          <div className="mb-4 ">
            <TextFieldElement
              fullWidth
              label="Document number"
              name="documentNumber"
            />
          </div>

          <div className="mb-4">
            <Grid container spacing={2}>
              <Grid item md={6}>
                <DatePickerElement
                  label="Issue date"
                  name="issueDate"
                  format="dd/MM/yyyy"
                  maxDate={new Date()}
                  minDate={new Date(1950, 0, 1)}
                />
              </Grid>
              <Grid item md={6}>
                <TextFieldElement fullWidth label="Issue by" name="issueBy" />
              </Grid>
            </Grid>
          </div>

          <div className="mb-4">
            <TextFieldElement fullWidth label="Issue place" name="issuePlace" />
          </div>

          {files.length > 0 && (
            <div className="mb-4">
              <FileList
                files={files}
                titleFormatter={v => `${v} file(s) uploaded`}
              />
            </div>
          )}

          <div className="mb-4">
            <DropzoneWrapper fileSelected={handleFileChanged} />
          </div>

          {error && (
            <Alert severity="error" className="mb-4">
              {error}
            </Alert>
          )}

          <div className="flex items-center gap-2">
            <Button
              variant="outlined"
              className="px-6"
              type="submit"
              disabled={loading}
            >
              {loading ? "Processing..." : "Save Changes"}
            </Button>
            <Button
              variant="text"
              className="px-6"
              onClick={() => handleClose()}
              disabled={loading}
            >
              Close
            </Button>
          </div>
        </FormContainer>
      </div>
    </>
  );
}
