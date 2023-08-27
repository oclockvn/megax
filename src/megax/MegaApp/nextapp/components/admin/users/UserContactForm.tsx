"use client";

import {
  DatePickerElement,
  FormContainer,
  SwitchElement,
  TextFieldElement,
} from "react-hook-form-mui";
import Button from "@mui/material/Button";
import { Contact } from "@/lib/models/contact.model";
import Grid from "@mui/material/Grid";

type UserContactFormProps = {
  contact: Partial<Contact>;
  handleSave: (contact: Partial<Contact>) => void;
  handleClose: () => void;
  loading?: boolean;
};

export default function UserContactForm(props: UserContactFormProps) {
  const { contact, handleSave, handleClose, loading } = props;

  const handleSubmit = (contact: Partial<Contact>) => {
    handleSave(contact);
  };

  return (
    <>
      <div className="p-4 w-[500px]">
        <h4 className="uppercase !text-[1.2rem] font-semibold mb-4">
          Edit contact
        </h4>

        <FormContainer values={contact} onSuccess={handleSubmit}>
          <div className="mb-4">
            <SwitchElement
              name="isPrimaryContact"
              label="Is Primary contact?"
            />
            <div className="text-xs text-blue-500">
              Changing this will also unset existing primary contact
            </div>
          </div>

          <div className="mb-4 ">
            <TextFieldElement fullWidth required label="Name" name="name" />
          </div>

          <div className="mb-4">
            <Grid container spacing={2}>
              <Grid item md={6}>
                <DatePickerElement
                  label="Birthdate"
                  name="dob"
                  format="dd/MM/yyyy"
                  maxDate={new Date()}
                  minDate={new Date(1950, 0, 1)}
                />
              </Grid>
              <Grid item md={6}>
                <TextFieldElement
                  fullWidth
                  label="Relationship"
                  name="relationship"
                />
              </Grid>
            </Grid>
          </div>

          <div className="mb-4">
            <Grid container spacing={2}>
              <Grid item md={4}>
                <TextFieldElement fullWidth label="Phone" name="phone" />
              </Grid>
              <Grid item md={8}>
                <TextFieldElement fullWidth label="Email" name="email" />
              </Grid>
            </Grid>
          </div>

          <div className="mb-4">
            <TextFieldElement fullWidth label="Address" name="address" />
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outlined" className="px-6" type="submit" disabled={loading}>
              {loading ? 'Processing...' : 'Save Changes'}
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
