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
import dt from "@/lib/datetime";
import LeaveDatePicker from "./LeaveDatePicker";

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
            <LeaveDatePicker />
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
