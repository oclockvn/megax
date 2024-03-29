"use client";

import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CommentIcon from "@mui/icons-material/Comment";
import DateRangeIcon from "@mui/icons-material/DateRange";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import CheckIcon from "@mui/icons-material/Check";
import CategoryIcon from "@mui/icons-material/Category";
import EditNoteIcon from "@mui/icons-material/EditNote";
import PaidIcon from "@mui/icons-material/Paid";
import CardActions from "@mui/material/CardActions";
import CardHeader from "@mui/material/CardHeader";
import {
  Leave,
  LeaveAction,
  LeaveActionRequest,
  LeaveStatus,
  LeaveTime,
  LeaveType,
  LeaveTypeDescriptionMapping,
} from "@/lib/models/leave.model";
import dt from "@/lib/datetime";
import CloseIcon from "@mui/icons-material/Close";
import Chip from "@mui/material/Chip";
import TimeAgo from "react-timeago";
import { getInitial } from "@/lib/string.helper";
import { useAppDispatch } from "@/lib/store/state.hook";
import { useConfirm } from "material-ui-confirm";
import toast from "react-hot-toast";
import {
  usePopupState,
  bindTrigger,
  bindDialog,
} from "material-ui-popup-state/hooks";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import { useRef } from "react";
import UserAvatar from "@/components/common/UserAvatar";
import hasAccess from "@/hooks/accessControl";
import { useMutation } from "@tanstack/react-query";
import { cancelLeave, handleLeaveAction } from "@/lib/apis/leave.api";

export type LeaveCardProps = {
  leave: Leave;
  onResponded?: (leave: Pick<Leave, "id" | "status">) => void;
};

const timeDic = {
  [LeaveTime.All]: "All day",
  [LeaveTime.AM]: "AM",
  [LeaveTime.PM]: "PM",
};

export default function LeaveCard({ leave, onResponded }: LeaveCardProps) {
  const appDispatch = useAppDispatch();
  const confirmation = useConfirm();
  const commentRef = useRef<HTMLInputElement>(null);
  const canApprove = hasAccess("leave.approve");

  const popupState = usePopupState({
    variant: "dialog",
  });

  const cancelHandler = useMutation({
    mutationKey: ["leave/cancel", leave?.id],
    mutationFn: () => cancelLeave(leave.id),
    onSuccess: response => {
      if (response.success) {
        toast.success(`Leave is cancelled successfully`);
        onResponded && onResponded({ id: leave.id, status: response.data });
      } else {
        toast.error(
          `Could not cancel leave request. Error code: ${response.code}`
        );
      }
    },
  });

  const handleCancel = () => {
    confirmation({
      title: "Are you sure? No regret?",
      description: "Look like your party was cancelled right?",
      dialogProps: {
        maxWidth: "xs",
      },
    }).then(() => cancelHandler.mutate());
  };

  const actionHandler = useMutation({
    mutationKey: ["leave/action", leave?.id],
    mutationFn: (req: LeaveActionRequest) => handleLeaveAction(leave.id, req),
    onSuccess: response => {
      if (response.success) {
        popupState.close();
        onResponded && onResponded({ id: leave.id, status: response.data });
      } else {
        toast.error(
          `Could not handle leave action. Error code: ${response.code}`
        );
      }
    },
  });

  const handleAction = async (actionType: LeaveAction) => {
    const result = await actionHandler.mutateAsync({
      action: actionType,
      comment: commentRef?.current?.value,
    });

    if (result.success) {
      toast.success(
        `Leave is ${
          actionType == LeaveAction.Approve ? "approved" : "rejected"
        } successfully`
      );
    }
  };

  const LeaveItem = ({
    icon,
    category,
    content,
    contentRight,
    overrideCls,
  }: {
    icon: React.ReactNode;
    category: string;
    content: string | React.ReactNode;
    contentRight?: React.ReactNode | undefined;
    overrideCls?: string;
  }) => (
    <div className={`flex gap-4 mt-4 ${overrideCls || ""}`}>
      <div className={pastLeave ? "text-gray-700" : "text-lime-600"}>
        {icon}
      </div>
      <div className="flex-1">
        <strong className={pastLeave ? "text-gray-700" : "text-lime-600"}>
          {category}
        </strong>
        <div>{content}</div>
      </div>
      {!!contentRight && <div className="self-center">{contentRight}</div>}
    </div>
  );

  const displayTime = (time: LeaveTime) => {
    const text = timeDic[time];

    return <Chip label={text} size="small" color="info" />;
  };

  const CardAction = () => {
    return (
      <div className="flex items-center gap-2">
        <Button
          color="warning"
          size="small"
          aria-label="Cancel leave"
          onClick={handleCancel}
          startIcon={<CloseIcon />}
        >
          Cancel
        </Button>
      </div>
    );
  };

  // check if the last leave was in the past
  const ascDate = [...leave.leaveDates].sort(
    (a, b) => a.date.getTime() - b.date.getTime()
  );
  const pastLeave = ascDate.length
    ? dt.isPast(ascDate.at(-1)?.date || new Date())
    : false;

  const showAction = [LeaveStatus.New].includes(leave.status);
  const canCancel = leave.status === LeaveStatus.Approved && !pastLeave;
  const labelCls =
    leave.status === LeaveStatus.Approved
      ? "border-green-500 text-green-500"
      : "border-orange-500 text-orange-500";

  return (
    <>
      <div className="relative" data-id={leave.id}>
        <Card className={pastLeave ? "bg-gray-200" : ""}>
          <CardHeader
            avatar={
              // <Avatar aria-label="recipe">{getInitial(leave.userName)}</Avatar>
              <UserAvatar
                id={leave.userId}
                content={getInitial(leave.userName)}
              />
            }
            action={
              (showAction || canCancel) && leave.isCreator && <CardAction />
            }
            title={leave.userName}
            subheader={<TimeAgo date={leave.createdAt} />}
          />
          <CardContent>
            <LeaveItem
              category="Leave Reason"
              content={leave.reason}
              overrideCls="!mt-0"
              icon={<EditNoteIcon />}
            />
            <LeaveItem
              category={`Leave Date`}
              content={
                <>
                  {leave.leaveDates?.map((d, idx) => (
                    <div
                      key={d.id}
                      className={`flex items-center gap-1 mt-1`}
                      title={dt.formatDate(d.date, "dd/MM/yyyy")}
                    >
                      {displayTime(d.time)}
                      {dt.formatDate(d.date, "dd/MM/yyyy")} →{" "}
                      <TimeAgo date={d.date} />
                    </div>
                  ))}
                </>
              }
              icon={pastLeave ? <CheckIcon /> : <DateRangeIcon />}
            />
            <LeaveItem
              category="Leave Type"
              content={LeaveTypeDescriptionMapping[leave.type]}
              contentRight={
                leave.type === LeaveType.Paid ? (
                  <PaidIcon color="error" />
                ) : undefined
              }
              icon={<CategoryIcon />}
            />
            <LeaveItem
              category="Leave Note"
              content={leave.note || "(blank)"}
              icon={<FormatQuoteIcon />}
            />
            {Number(leave.comment?.length) > 0 && (
              <LeaveItem
                category="Comment"
                content={
                  <>
                    {leave.comment}{" "}
                    {!!leave.responseName && (
                      <i className="text-gray-400 text-sm">
                        by {leave.responseName}
                      </i>
                    )}
                  </>
                }
                icon={<CommentIcon />}
              />
            )}
          </CardContent>
          {showAction && !leave.isCreator && canApprove && (
            <CardActions>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                {...bindTrigger(popupState)}
              >
                Response
              </Button>
            </CardActions>
          )}
        </Card>

        {!showAction && (
          <div className="absolute z-10 top-[50%] right-[40%] flex justify-end text-center">
            <div
              className={`border-[4px] border-solid font-bold px-2 uppercase rotate-[-45deg] ${labelCls}`}
            >
              {LeaveStatus[leave.status]}
            </div>
          </div>
        )}
      </div>

      <Dialog
        {...bindDialog(popupState)}
        aria-labelledby="approval-popup"
        aria-describedby="approval-popup"
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle id="approval-popup">{"Are you sure?"}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            fullWidth
            variant="standard"
            placeholder="What's your comment?"
            // ref={commentRef}
            inputRef={commentRef}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={popupState.close}>Close</Button>
          <div className="flex-[1]"></div>
          <Button
            color="warning"
            onClick={() => handleAction(LeaveAction.Reject)}
          >
            Reject
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleAction(LeaveAction.Approve)}
          >
            Approve
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
