"use client";

import Timeline  from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineOppositeContent, {
  timelineOppositeContentClasses,
} from "@mui/lab/TimelineOppositeContent";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import Chip from "@mui/material/Chip";
import LeaveCard from "@/components/portal/leave/LeaveCard";
import {
  Leave,
  LeaveStatus,
  LeaveStatusMapping,
} from "@/lib/models/leave.model";
import LeaveCardLoading from "@/components/common/skeletons/LeaveCardLoading";

export type LeaveHistoryProps = {
  items: Leave[];
  loading?: boolean;
};

export default function LeaveHistory({ items, loading }: LeaveHistoryProps) {
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
            <TimelineOppositeContent>
              <Chip
                size="small"
                color={
                  leave.status === LeaveStatus.Approved ? "success" : "warning"
                }
                label={LeaveStatusMapping[leave.status]}
              />
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot
                className={
                  [LeaveStatus.Cancelled, LeaveStatus.Rejected].includes(
                    leave.status
                  )
                    ? `bg-orange-500`
                    : "bg-green-500"
                }
              />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              {loading ? <LeaveCardLoading /> : <LeaveCard leave={leave} />}
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </>
  );
}
