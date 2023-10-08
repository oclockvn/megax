"use client";

import {
  DatePickerElement,
  FormContainer,
  SelectElement,
  TextFieldElement,
} from "react-hook-form-mui";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import CommentIcon from "@mui/icons-material/Comment";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import CategoryIcon from "@mui/icons-material/Category";
import { Leave, LeaveType } from "@/lib/models/leave.model";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
import Add from "@mui/icons-material/Add";
import dt from '@/lib/datetime';

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

  const leaveTypes = Object.keys(LeaveType)
    .filter(x => Number(x) >= 0)
    .map(id => ({
      id: id,
      label: LeaveType[Number(id)].replace(/[A-Z]/g, x => " " + x).trim(),
    }));

  const leaveDays = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5].map(x => ({
    id: x,
    label: x,
  }));

  const maxRequestDate = new Date();
  maxRequestDate.setMonth(maxRequestDate.getMonth() + 3); // max request is up to 3 months

  return (
    <>
      <div className="p-4 w-[500px]">
        <h4 className="uppercase !text-[1.2rem] font-semibold mb-4">Leave</h4>

        <FormContainer values={leave} onSuccess={handleSubmit}>
          <div className="mb-4">
            <SelectElement
              fullWidth
              required
              label="Leave type"
              name="leaveType"
              options={leaveTypes}
              InputProps={{
                startAdornment: <CategoryIcon className="me-2 text-lime-500" />,
              }}
            />
          </div>

          <div className="mb-4">
            <Grid container spacing={2} alignItems={"center"}>
              <Grid item md={6}>
                <DatePickerElement
                  label="Leave date"
                  name="leaveDate"
                  format="dd/MM/yyyy"
                  maxDate={maxRequestDate}
                  minDate={new Date(1950, 0, 1)}
                  shouldDisableDate={d => dt.isWeekend(d)}
                />
              </Grid>
              <Grid item md={6}>
                <ToggleButtonGroup color="secondary" value={0}>
                  <ToggleButton value={0}>All day</ToggleButton>
                  <ToggleButton value={1}>AM</ToggleButton>
                  <ToggleButton value={2}>PM</ToggleButton>
                </ToggleButtonGroup>
              </Grid>
            </Grid>
            <Button size="small" startIcon={<Add />}>
              Add date
            </Button>
          </div>

          <div className="mb-4">
            <TextFieldElement
              fullWidth
              label="Reason"
              name="reason"
              multiline
              minRows={3}
              InputProps={{
                startAdornment: <CommentIcon className="text-lime-500 me-2" />,
                className: "items-start",
              }}
            />
          </div>

          <div className="mb-4">
            <TextFieldElement
              fullWidth
              label="Note"
              name="note"
              placeholder="Additional note: approved by who? / handover work to who?"
              multiline
              minRows={3}
              InputProps={{
                startAdornment: (
                  <FormatQuoteIcon className="text-lime-500 me-2" />
                ),
                className: "items-start",
              }}
            />
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="contained"
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
