"use client";

import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CommentIcon from "@mui/icons-material/Comment";
import DateRangeIcon from "@mui/icons-material/DateRange";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import CategoryIcon from "@mui/icons-material/Category";
import CardActions from "@mui/material/CardActions";
import CardHeader from "@mui/material/CardHeader";
import Avatar from "@mui/material/Avatar";
// import IconButton from "@mui/material/IconButton";
import {
  Leave,
  LeaveStatus,
  LeaveTime,
  LeaveTypeDescriptionMapping,
} from "@/lib/models/leave.model";
import dt from "@/lib/datetime";
import CloseIcon from "@mui/icons-material/Close";
// import EditIcon from "@mui/icons-material/Edit";
import Chip from "@mui/material/Chip";
import TimeAgo from "react-timeago";
import { getInitial } from "@/lib/string.helper";
import { useAppDispatch } from "@/lib/store/state.hook";
import { useConfirm } from "material-ui-confirm";
import { approveLeaveThunk, cancelLeaveThunk } from "@/lib/store/leave.state";
import toast from "react-hot-toast";
import ButtonGroup from "@mui/material/ButtonGroup";

export type LeaveCardProps = {
  leave: Leave;
};

const timeDic = {
  [LeaveTime.All]: "All day",
  [LeaveTime.AM]: "AM",
  [LeaveTime.PM]: "PM",
};

export default function LeaveCard({ leave }: LeaveCardProps) {
  const appDispatch = useAppDispatch();
  const confirmation = useConfirm();

  const handleCancel = () => {
    confirmation({
      title: "Are you sure? No regret?",
      description: "Look like your party was cancelled right?",
      dialogProps: {
        maxWidth: "xs",
      },
    })
      .then(() => {
        appDispatch(cancelLeaveThunk(leave.id))
          .unwrap()
          .then(res => {
            if (res.success) {
              toast.success(`Leave is cancelled successfully`);
              return;
            }

            toast.error(
              `Could not cancel leave request. Error code: ${res.code}`
            );
          });
      })
      .catch(() => {
        /*ignore*/
      });
  };

  const handleApprove = () => {
    confirmation({
      title: "Are you sure?",
      description: "No turning back, still approve?",
      dialogProps: {
        maxWidth: "xs",
      },
    })
      .then(() => {
        appDispatch(approveLeaveThunk(leave.id))
          .unwrap()
          .then(res => {
            if (res.success) {
              toast.success(`Leave is approved successfully`);
              return;
            }

            toast.error(
              `Could not approve leave request. Error code: ${res.code}`
            );
          });
      })
      .catch(() => {
        /*ignore*/
      });
  };

  const LeaveItem = ({
    icon,
    category,
    content,
    overrideCls,
  }: {
    icon: React.ReactNode;
    category: string;
    content: string | React.ReactNode;
    overrideCls?: string;
  }) => (
    <div className={`flex gap-4 mt-4 ${overrideCls}`}>
      <div className="text-lime-600">{icon}</div>
      <div>
        <strong className="text-lime-600">{category}</strong>
        <div>{content}</div>
      </div>
    </div>
  );

  const displayTime = (time: LeaveTime) => {
    const text = timeDic[time];

    return <Chip label={text} size="small" color="info" />;
  };

  const CardAction = () => {
    return (
      <div className="flex items-center gap-2">
        {/* <Button
          size="small"
          startIcon={<EditIcon fontSize="small" />}
          onClick={() => onEdit(leave)}
        >
          Edit
        </Button> */}
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
      : "border-fuchsia-500 text-fuchsia-500";

  return (
    <div className="relative">
      <Card className={pastLeave ? "bg-gray-200" : ""}>
        <CardHeader
          avatar={
            <Avatar aria-label="recipe">{getInitial(leave.userName)}</Avatar>
          }
          action={(showAction || canCancel) && <CardAction />}
          title={leave.userName}
          subheader={<TimeAgo date={leave.createdAt} />}
        />
        <CardContent>
          <LeaveItem
            category="Leave Reason"
            content={leave.reason}
            overrideCls="!mt-0"
            icon={<CommentIcon />}
          />
          <LeaveItem
            category="Leave Date"
            content={
              <>
                {leave.leaveDates?.map((d, index) => (
                  <div
                    key={d.id}
                    className="flex items-center gap-1 mt-1"
                    title={dt.formatDate(d.date, "dd/MM/yyyy")}
                  >
                    {displayTime(d.time)}
                    {dt.formatDate(d.date, "dd/MM/yyyy")}{" "}
                  </div>
                ))}
              </>
            }
            icon={<DateRangeIcon />}
          />
          <LeaveItem
            category="Leave Type"
            content={LeaveTypeDescriptionMapping[leave.type]}
            icon={<CategoryIcon />}
          />
          <LeaveItem
            category="Leave Note"
            content={leave.note || "(blank)"}
            icon={<FormatQuoteIcon />}
          />
        </CardContent>
        {showAction && !leave.isOwner && (
          <CardActions>
            <ButtonGroup fullWidth>
              <Button variant="outlined" color="warning">
                Reject
              </Button>
              <Button variant="contained" color="primary" onClick={handleApprove}>
                Approve
              </Button>
            </ButtonGroup>
          </CardActions>
        )}
      </Card>

      {!showAction && (
        <div className="absolute z-10 top-[50%] left-0 right-10 flex justify-end text-center">
          <div
            className={`border-[4px] border-solid font-bold px-2 uppercase rotate-[-45deg] ${labelCls}`}
          >
            {LeaveStatus[leave.status]}
          </div>
        </div>
      )}
    </div>
  );
}
