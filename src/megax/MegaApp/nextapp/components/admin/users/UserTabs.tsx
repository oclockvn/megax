"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";

import { User } from "@/lib/models/user.model";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";

const UserInfo = dynamic(() => import("./UserInfo"), { ssr: false, loading: () => <div><CircularProgress /></div> });
const UserContactList = dynamic(() => import("./UserContactList"), {
  ssr: false,
});
const UserDocumentList = dynamic(() => import("./UserDocumentList"), {
  ssr: false,
});
const CustomTabPanel = dynamic(
  () => import("@/components/common/CustomTabPanel"),
  { ssr: false }
);
const UserRoles = dynamic(() => import("./UserRoles"), { ssr: false });

// keep this value outside of the component
let _handled = false;

export default function UserTabs() {
  const [value, setValue] = useState("details");
  const router = useRouter();
  const path = usePathname();
  const query = useSearchParams();
  const tab = query.get("tab") || "details";

  const handleChange = (val: string) => {
    _handled = true;
    setValue(val);

    // store tab in query string to preserve tab if user refresh the browser
    router.push(path + `?tab=${val}`);
  };

  const a11yProps = (index: string) => ({
    id: `user-tab-${index}`,
    "aria-controls": `user-tabpanel-${index}`,
  });

  useEffect(() => {
    // auto switch tab if refresh
    // but only user refresh the browser
    if (!_handled) {
      setValue(tab);
    }
  }, [tab]);

  const tabs = [
    {
      value: "details",
      label: "User details",
    },
    {
      value: "contacts",
      label: "Contacts",
    },
    {
      value: "documents",
      label: "Documents",
    },
    {
      value: "user-roles",
      label: "User roles",
    },
  ];

  return (
    <Box sx={{ width: "100%" }}>
      <Card className="mb-1">
        <Tabs
          value={value}
          onChange={(_, val: string) => handleChange(val)}
          aria-label="user tabs"
        >
          {tabs.map(tab => (
            <Tab
              value={tab.value}
              label={tab.label}
              key={tab.value}
              {...a11yProps(tab.value)}
            />
          ))}
        </Tabs>
      </Card>

      <CustomTabPanel value={"details"} curr={value}>
        <UserInfo />
      </CustomTabPanel>
      <CustomTabPanel value={"contacts"} curr={value}>
        <UserContactList />
      </CustomTabPanel>
      <CustomTabPanel value={"documents"} curr={value}>
        <UserDocumentList />
      </CustomTabPanel>
      <CustomTabPanel value={"user-roles"} curr={value}>
        <UserRoles />
      </CustomTabPanel>
    </Box>
  );
}
