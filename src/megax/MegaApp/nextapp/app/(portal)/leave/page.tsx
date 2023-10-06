"use client";

import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import CommentIcon from "@mui/icons-material/Comment";
import DateRangeIcon from "@mui/icons-material/DateRange";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import CategoryIcon from "@mui/icons-material/Category";
import CardActions from "@mui/material/CardActions";
import CardHeader from "@mui/material/CardHeader";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Divider } from "@mui/material";

export default function LeavePage() {
  return (
    <div className="py-4 container mx-auto">
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            startIcon={<AddIcon />}
          >
            Request Leave
          </Button>

          <h3 className="mt-4 mb-2 text-lg font-bold">Waiting for Approval</h3>
          <LeaveCard />
          <Divider orientation="horizontal" className="my-4" />
          <LeaveCard />
          <Divider orientation="horizontal" className="my-4" />
          <LeaveCard />
        </Grid>
        <Grid item xs={12} sm={8}>
          History
        </Grid>
      </Grid>
    </div>
  );
}

function LeaveCard() {
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
