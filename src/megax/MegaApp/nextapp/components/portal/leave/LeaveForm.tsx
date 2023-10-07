"use client";

import {
  DatePickerElement,
  FormContainer,
  SelectElement,
  TextFieldElement,
} from "react-hook-form-mui";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { Leave, LeaveType } from "@/lib/models/leave.model";

type LeaveFormProps = {
  leave: Partial<Leave>;
  handleSave: (contact: Partial<Leave>) => void;
  handleClose: () => void;
  loading?: boolean;
};

export default function LeaveForm(props: LeaveFormProps) {
  const { leave, handleSave, handleClose, loading } = props;

  const handleSubmit = (request: Partial<Leave>) => {
    handleSave(request);
  };

  const leaveTypes = Object.keys(LeaveType).filter(x => Number(x) >= 0).map(id => ({
    id: id,
    label: LeaveType[Number(id)]
  }))

  return (
    <>
      <div className="p-4 w-[500px]">
        <h4 className="uppercase !text-[1.2rem] font-semibold mb-4">
          Leave
        </h4>

        <FormContainer values={leave} onSuccess={handleSubmit}>
          <div className="mb-4">
            <SelectElement
              fullWidth
              required
              label="Leave type"
              name="leaveType"
              options={leaveTypes}
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
