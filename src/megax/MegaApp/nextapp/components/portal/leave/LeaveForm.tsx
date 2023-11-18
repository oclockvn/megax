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
  LeaveRequest,
  LeaveType,
} from "@/lib/models/leave.model";
import LeaveDatePicker from "./LeaveDatePicker";
import { useAppDispatch } from "@/lib/store/state.hook";
import { useEffect, useReducer, useRef, useState } from "react";
import Alert from "@mui/material/Alert";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { submitLeave } from "@/lib/apis/leave.api";

type LeaveFormProps = {
  leave: Partial<Leave>;
  loading?: boolean;
  requestedDates?: Date[];
  handleClose: () => void;
  onAdded: (leave: Leave) => void;
};

type LeaveFormState = {
  dates: LeaveDate[],
  error: string | null,
  loading: boolean,
}

type Action = {
  type: 'set',
  payload: Partial<LeaveFormState>
}

function leaveFormReducer(state: LeaveFormState, action: Action) {
  const { type, payload } = action;
  switch (type) {
    case 'set':
      return {
        ...state,
        ...payload,
      } as LeaveFormState;
  }
}

// let leaveDates: LeaveDate[] = [];

export default function LeaveForm(props: LeaveFormProps) {
  const appDispatch = useAppDispatch();
  const { leave, handleClose } = props;
  const datesRef = useRef<LeaveDate[]>([])
  // const [error, setError] = useState<string | undefined>();
  // const [loading, setLoading] = useState(false);

  const [state,dispatch] = useReducer(leaveFormReducer, {
    dates: [],
    error: null,
    loading: false,
  } as LeaveFormState)

  const submitHandler = useMutation({
    mutationKey: ['user/leave/request'],
    mutationFn: (req: Partial<LeaveRequest>) => submitLeave(req),
    onSuccess: response => {
      if (response.success) {
        toast.success(`Requested successfully`)

        props.onAdded && props.onAdded(response.data)
      }
    }
  })

  useEffect(() => {
    datesRef.current = state.dates;
  }, [state.dates])

  const handleSubmit = async (request: Partial<Leave>) => {
    // setLoading(true);
    dispatch({
      type: 'set',
      payload: {error: null, loading: true}
    })

    const payload = {
      ...request,
      leaveDates: datesRef.current,
    };

    const result = await submitHandler.mutateAsync(payload);// appDispatch(submitLeaveThunk(payload)).unwrap();
    dispatch({
      type: 'set',
      payload: {
        loading: false,
        error: result.success ? undefined : `Request failed. Error code: ${result.code}`
      }
    })
    // setLoading(false);
    // if (result?.success) {
      // toast.success(`Requested successfully`);
      // handleClose();
    // }

    // setError(
    //   result.success ? undefined : `Request failed. Error code: ${result.code}`
    // );
  };

  const dateChange = (items: LeaveDate[]) => {
    // leaveDates = items;
    dispatch({
      type: 'set',
      payload: {
        dates: items,
      }
    })
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

          {!!state.error && (
            <Alert variant="standard" color="error" className="mb-4">
              {state.error}
            </Alert>
          )}

          <div className="flex items-center gap-2">
            <Button
              variant="contained"
              className="px-6"
              type="submit"
              disabled={state.loading}
            >
              {state.loading ? "Processing..." : "Save Changes"}
            </Button>
            <Button
              variant="text"
              className="px-6"
              onClick={() => handleClose()}
              disabled={state.loading}
            >
              Close
            </Button>
          </div>
        </FormContainer>
      </div>
    </>
  );
}
