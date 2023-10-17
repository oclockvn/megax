"use client";

import {
  FormContainer,
  SelectElement,
  TextFieldElement,
} from "react-hook-form-mui";
import Button from "@mui/material/Button";
import CommentIcon from "@mui/icons-material/Comment";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import CategoryIcon from "@mui/icons-material/Category";
import {
  Leave,
  LeaveDate,
  LeaveType,
} from "@/lib/models/leave.model";
import LeaveDatePicker from "./LeaveDatePicker";
import { useAppDispatch } from "@/lib/store/state.hook";
import { submitLeaveThunk } from "@/lib/store/leave.state";
import { useState } from "react";
import Alert from "@mui/material/Alert";
import toast from "react-hot-toast";

type LeaveFormProps = {
  leave: Partial<Leave>;
  handleClose: () => void;
  loading?: boolean;
  requestedDates?: Date[];
};

let leaveDates: LeaveDate[] = [];

export default function LeaveForm(props: LeaveFormProps) {
  const appDispatch = useAppDispatch();
  const { leave, handleClose } = props;
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (request: Partial<Leave>) => {
    setLoading(true);

    const payload = {
      ...request,
      leaveDates,
    };

    const result = await appDispatch(submitLeaveThunk(payload)).unwrap();
    setLoading(false);
    if (result?.success) {
      toast.success(`Requested successfully`);
      handleClose();
    }

    setError(
      result.success ? undefined : `Request failed. Error code: ${result.code}`
    );
  };

  const dateChange = (items: LeaveDate[]) => {
    leaveDates = items;
  };

  const leaveTypes = Object.keys(LeaveType)
    .filter(x => Number(x) >= 0)
    .map(id => ({
      id: Number(id),
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
              name="type"
              options={leaveTypes}
              InputProps={{
                startAdornment: <CategoryIcon className="me-2 text-blue-500" />,
              }}
            />
          </div>

          <div className="mb-4">
            <LeaveDatePicker
              value={leave.leaveDates}
              onChange={dateChange}
              requestedDates={props.requestedDates}
            />
          </div>

          <div className="mb-4">
            <TextFieldElement
              fullWidth
              label="Reason"
              name="reason"
              multiline
              required
              minRows={3}
              InputProps={{
                startAdornment: <CommentIcon className="text-blue-500 me-2" />,
                className: "items-start",
              }}
            />
          </div>

          <div className="mb-4">
            <TextFieldElement
              fullWidth
              label="Note"
              name="note"
              placeholder="Additional note: who approved? or, who did you handover work to?"
              multiline
              minRows={3}
              InputProps={{
                startAdornment: (
                  <FormatQuoteIcon className="text-blue-500 me-2" />
                ),
                className: "items-start",
              }}
            />
          </div>

          {!!error && (
            <Alert variant="standard" color="error" className="mb-4">
              {error}
            </Alert>
          )}

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
