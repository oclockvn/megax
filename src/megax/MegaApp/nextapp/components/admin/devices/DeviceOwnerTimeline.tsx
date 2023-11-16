"use client";

import React from "react";
import Link from "next/link";

import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineOppositeContent, {
  timelineOppositeContentClasses,
} from "@mui/lab/TimelineOppositeContent";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import Chip from "@mui/material/Chip";
import Alert from "@mui/material/Alert";
import LinearProgress from "@mui/material/LinearProgress";
import RedoIcon from "@mui/icons-material/Redo";
import AddIcon from "@mui/icons-material/Add";

import { DeviceOwnerRecord } from "@/lib/models/device.model";
import dateLib from "@/lib/datetime";
import { useQuery } from "@tanstack/react-query";
import { fetchDeviceOwners } from "@/lib/apis/devices.api";

declare type DeviceOwnerProps = {
  deviceId: number;
};

export default function DeviceOwnerTimeline({ deviceId }: DeviceOwnerProps) {
  const { status, data: owners } = useQuery({
    queryKey: ["admin/device-owners", deviceId],
    queryFn: () => fetchDeviceOwners(deviceId),
  });

  const OwnerItem = (d: DeviceOwnerRecord) => (
    <div>
      <div>
        <Link
          href={`/admin/users/${d.id}`}
          className="text-blue-400"
          title="Open user"
        >
          {d.fullName}
        </Link>
      </div>
      <small>{d.email}</small>
    </div>
  );

  return (
    <>
      <h3 className="font-bold text-xl ps-[70px]">History</h3>
      {status === "pending" && <LinearProgress />}
      {owners?.length ? (
        <Timeline
          sx={{
            [`& .${timelineOppositeContentClasses.root}`]: {
              maxWidth: "140px",
            },
          }}
        >
          {owners.map(owner => (
            <TimelineItem key={owner.recordId}>
              <TimelineOppositeContent>
                <div>
                  <Chip
                    size="small"
                    icon={<AddIcon fontSize="small" color="success" />}
                    label={dateLib.formatDate(owner.takenAt, "dd/MM/yyyy")}
                  />
                  {!!owner.returnedAt ? (
                    <Chip
                      icon={<RedoIcon fontSize="small" />}
                      size="small"
                      label={dateLib.formatDate(
                        owner.returnedAt!,
                        "dd/MM/yyyy"
                      )}
                    />
                  ) : (
                    <Chip size="small" label="USING" color="success" />
                  )}
                </div>
              </TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineDot color={owner.returnedAt ? "grey" : "success"} />
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>
                {/* {loading ? <LeaveCardLoading /> : <LeaveCard leave={leave} />} */}
                <OwnerItem {...owner} />
              </TimelineContent>
            </TimelineItem>
          ))}

          <TimelineItem>
            <TimelineOppositeContent></TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot />
            </TimelineSeparator>
            <TimelineContent className="text-fuchsia-500">
              Purchased
            </TimelineContent>
          </TimelineItem>
        </Timeline>
      ) : (
        <div className="px-4 pt-4">
          <Alert severity="info">No owners yet!</Alert>
        </div>
      )}
    </>
  );
}
