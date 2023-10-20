"use client";

import Avatar from "@mui/material/Avatar";
import HoverPopover from "material-ui-popup-state/HoverPopover";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

import {
  usePopupState,
  bindHover,
  bindPopover,
} from "material-ui-popup-state/hooks";
import { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import CircularProgress from "@mui/material/CircularProgress";
import { getUserCard } from "@/lib/apis/user.api";
import { UserCard } from "@/lib/models/user.model";

type UserAvatarProps = {
  // key: number | string;
  id: number;
  content: string;
  disableHover?: boolean;
};

export default function UserAvatar({ id, content, disableHover }: UserAvatarProps) {
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState<UserCard | undefined>(undefined);

  const popupState = usePopupState({
    variant: "popover",
    popupId: "avatar-",
  });

  useEffect(() => {
    if (popupState.isOpen) {
      setLoading(true);
    }
  }, [popupState.isOpen]);

  useEffect(() => {
    if (loading) {
      // const t = setTimeout(() => {
      //   setLoading(false);
      // }, 1500);

      // return () => {
      //   clearTimeout(t);
      // };
      getUserCard(id)
        .then(res => {
          setUserInfo(res);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [loading, userInfo]);

  const LineItem = ({
    left,
    right,
  }: {
    left: string | React.ReactNode;
    right: string | React.ReactNode;
  }) => {
    return (
      <>
        <div className="flex items-center gap-2 my-2">
          <div>{left}</div>
          <div>{right}</div>
        </div>
      </>
    );
  };

  return (
    <>
      <Avatar aria-label="avatar" {...bindHover(popupState)}>
        {content}
      </Avatar>

      {!disableHover && (
        <HoverPopover
          {...bindPopover(popupState)}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
        >
          <Card className="min-w-[400px]">
            <CardHeader
              title={userInfo?.fullName}
              subheader={`Tech Lead`}
              avatar={<Avatar>{content}</Avatar>}
            />
            <CardContent>
              {loading ? (
                <div className="flex items-center mb-4">
                  <CircularProgress className="mx-auto" size={32} />
                </div>
              ) : (
                <>
                  <LineItem
                    left={<EmailIcon />}
                    right={userInfo?.email}
                  />
                  <LineItem left={<PhoneIcon />} right={userInfo?.phone} />
                  <LineItem
                    left={<CalendarMonthIcon />}
                    right={
                      <>
                        <div>Annual leave: {userInfo?.takenAnnual} taken / {userInfo?.totalAnnual} total</div>
                        <div>Paid leave: {userInfo?.takenPaidLeave} taken</div>
                      </>
                    }
                  />
                </>
              )}
            </CardContent>
          </Card>
        </HoverPopover>
      )}
    </>
  );
}
