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
  LeaveTypeDescriptionMapping,
} from "@/lib/models/leave.model";

export type LeaveCardProps = {
  leave: Leave;
};

export default function LeaveCard({ leave }: LeaveCardProps) {
  const LeaveItem = ({
    icon,
    category,
    content,
    overrideCls,
  }: {
    icon: React.ReactNode;
    category: string;
    content: string;
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

  const showAction = [LeaveStatus.New].includes(leave.status);
  const labelCls = leave.status === LeaveStatus.Approved ? 'border-green-500 text-green-500' : 'border-fuchsia-500 text-fuchsia-500';

  return (
    <div className="relative">
      <Card>
        <CardHeader
          avatar={<Avatar aria-label="recipe">QP</Avatar>}
          action={
            <IconButton aria-label="settings">
              <MoreVertIcon />
            </IconButton>
          }
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
            content="06/10/2023 - 07/10/2023 (1 day)"
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
        {showAction && (
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
          <div className={ `border-[4px] border-solid font-bold px-2 uppercase rotate-[-45deg] ${labelCls}` }>
            {LeaveStatus[leave.status]}
          </div>
        </div>
      )}
    </div>
  );
}
