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
import Timeline from "@mui/lab/Timeline";
import TimelineItem, { timelineItemClasses } from "@mui/lab/TimelineItem";
import TimelineOppositeContent, {
  timelineOppositeContentClasses,
} from "@mui/lab/TimelineOppositeContent";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";

export default function LeavePage() {
  return (
    <div className="p-4 md:px-0 container mx-auto">
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            fullWidth
            startIcon={<AddIcon />}
          >
            Request Leave
          </Button>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <h3 className="mt-4 mb-2 text-lg font-bold">Waiting for Approval</h3>
          <LeaveCard />
          <Divider orientation="horizontal" className="my-4" />
          <LeaveCard />
          <Divider orientation="horizontal" className="my-4" />
          <LeaveCard />
        </Grid>

        <Grid item xs={12} sm={8}>
          <h3 className="mt-4 mb-2 text-lg font-bold ps-[160px]">Leave History</h3>
          <LeaveHistory />
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

function LeaveHistory() {
  return (
    <>
      <Timeline
        // sx={{
        //   [`& .${timelineOppositeContentClasses.root}`]: {
        //     flex: 0.2,
        //   },
        // }}
        sx={{
          [`& .${timelineOppositeContentClasses.root}`]: {
            flex: 0.2,
            maxWidth: '120px'
          },
        }}
      >
        <TimelineItem>
          <TimelineOppositeContent color="textSecondary">
            06/10/2023
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot />
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <LeaveCard />
          </TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineOppositeContent color="textSecondary">
            07/10/2023
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot />
          </TimelineSeparator>
          <TimelineContent>
            <LeaveCard />
          </TimelineContent>
        </TimelineItem>
      </Timeline>
    </>
  );
}
