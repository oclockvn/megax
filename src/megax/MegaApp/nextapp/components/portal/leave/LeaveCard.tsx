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
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  Leave,
  LeaveStatus,
  LeaveTime,
  LeaveTypeDescriptionMapping,
} from "@/lib/models/leave.model";
import dt from "@/lib/datetime";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";

export type LeaveCardProps = {
  leave: Leave;
  onEdit: (leave: Leave) => void;
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
    switch (time) {
      case LeaveTime.All:
        return "All day";
      case LeaveTime.AM:
        return "Morning";
      case LeaveTime.PM:
        return "Afternoon";
    }
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
          avatar={<Avatar aria-label="recipe">QP</Avatar>}
          action={showAction && <CardAction />}
          title="Quang Phan"
          subheader="Submitted at September 14, 2016"
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
                  <div key={d.id}>
                    {index + 1}. {dt.formatDate(d.date, "dd/MM/yyyy")}{" "}
                    {displayTime(d.time)}
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