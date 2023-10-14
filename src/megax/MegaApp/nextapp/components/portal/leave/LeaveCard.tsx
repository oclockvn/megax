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
import IconButton from "@mui/material/IconButton";
import {
  Leave,
  LeaveStatus,
  LeaveTime,
  LeaveTypeDescriptionMapping,
} from "@/lib/models/leave.model";
import dt from "@/lib/datetime";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import Chip from "@mui/material/Chip";
import { getInitial } from "@/lib/string.helper";

export type LeaveCardProps = {
  leave: Leave;
  onEdit: (leave: Leave) => void;
};

const timeDic = {
  [LeaveTime.All]: "All day",
  [LeaveTime.AM]: "AM",
  [LeaveTime.PM]: "PM",
};

export default function LeaveCard({ leave, onEdit }: LeaveCardProps) {
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
        <Button
          size="small"
          startIcon={<EditIcon fontSize="small" />}
          onClick={() => onEdit(leave)}
        >
          Edit
        </Button>
        <IconButton color="warning" size="small" aria-label="Cancel leave">
          <CloseIcon />
        </IconButton>
      </div>
    );
  };

  const showAction = [LeaveStatus.New].includes(leave.status);
  const labelCls =
    leave.status === LeaveStatus.Approved
      ? "border-green-500 text-green-500"
      : "border-fuchsia-500 text-fuchsia-500";

  return (
    <div className="relative">
      <Card>
        <CardHeader
          avatar={<Avatar aria-label="recipe">{getInitial(leave.userName)}</Avatar>}
          action={showAction && <CardAction />}
          title={leave.userName}
          subheader={`Requested at ${dt.formatDate(
            leave.createdAt,
            "MMMM dd, yyyy"
          )}`}
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
            <Button variant="contained" color="primary">
              Approve
            </Button>
            <Button color="warning">Reject</Button>
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
