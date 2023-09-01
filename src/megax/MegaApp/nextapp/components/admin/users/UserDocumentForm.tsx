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

type UserDocumentFormProps = {
  document: Partial<UserDocument>;
  handleSave: (contact: Partial<UserDocument>) => void;
  handleClose: () => void;
  loading?: boolean;
};

export default function UserDocumentForm(props: UserDocumentFormProps) {
  const { document, handleSave, handleClose, loading } = props;

  const handleSubmit = (contact: Partial<UserDocument>) => {
    handleSave(contact);
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

  return (
    <>
      <div className="p-4 w-[500px]">
        <h4 className="uppercase !text-[1.2rem] font-semibold mb-4">
          Edit document
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

          <div className="mb-4">
            <DropzoneWrapper />
          </div>

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
