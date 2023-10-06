
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

export default function LeaveCard() {
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
      <div className="pt-1 text-fuchsia-500">{icon}</div>
      <div>
        <strong className="text-fuchsia-500">{category}</strong>
        <div>{content}</div>
      </div>
    </div>
  );

  return (
    <>
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
            content="Lorem ipsum dolor sit amet"
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
            content="Annual leave"
            icon={<CategoryIcon />}
          />
          <LeaveItem
            category="Leave Note"
            content="Handover work to/how to contact..."
            icon={<FormatQuoteIcon />}
          />
        </CardContent>
        <CardActions>
          <Button variant="contained" color="primary">
            Approve
          </Button>
          <Button color="warning">Reject</Button>
        </CardActions>
      </Card>
    </>
  );
}
