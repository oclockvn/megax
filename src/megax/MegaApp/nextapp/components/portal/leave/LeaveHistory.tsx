"use client";

import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineOppositeContent, {
  timelineOppositeContentClasses,
} from "@mui/lab/TimelineOppositeContent";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import LeaveCard from "@/components/portal/leave/LeaveCard";
import { Leave } from "@/lib/models/leave.model";
// import dt from "@/lib/datetime";

export type LeaveHistoryProps = {
  items: Leave[];
};

export default function LeaveHistory({ items }: LeaveHistoryProps) {
  return (
    <>
      <Timeline
        sx={{
          [`& .${timelineOppositeContentClasses.root}`]: {
            flex: 0.2,
            maxWidth: "120px",
          },
        }}
      >
        {items.map(leave => (
          <TimelineItem key={leave.id}>
            <TimelineOppositeContent color="textSecondary">
              {/* {dt.formatDate(leave.leaveDate, 'dd/MM/yyyy')} */}
              {leave.leaveDate?.toString()}
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              <LeaveCard leave={leave} />
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </>
  );
}
