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
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import CircularProgress from "@mui/material/CircularProgress";
import { getUserCard } from "@/lib/apis/user.api";
import { useQuery } from "@tanstack/react-query";

type UserAvatarProps = {
  // key: number | string;
  id: number;
  content: string;
  disableHover?: boolean;
};

export default function UserAvatar({
  id,
  content,
  disableHover,
}: UserAvatarProps) {

  const popupState = usePopupState({
    variant: "popover",
    popupId: "avatar-",
  });

  const { isLoading, data: userInfo } = useQuery({
    queryKey: ["user_card", id],
    queryFn: async () => await getUserCard(id),
    staleTime: 60 * 5 * 1000,
    enabled: popupState.isOpen,
  });

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
              subheader={userInfo?.title}
              avatar={<Avatar>{content}</Avatar>}
            />
            <CardContent>
              {isLoading ? (
                <div className="flex items-center mb-4">
                  <CircularProgress className="mx-auto" size={32} />
                </div>
              ) : (
                <>
                  <LineItem left={<EmailIcon />} right={userInfo?.email} />
                  {!!userInfo?.phone && <LineItem left={<PhoneIcon />} right={userInfo?.phone} />}
                  <LineItem
                    left={<CalendarMonthIcon />}
                    right={
                      <>
                        <div>
                          Annual leave: {userInfo?.takenAnnual} taken /{" "}
                          {userInfo?.totalAnnual} total
                        </div>
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
