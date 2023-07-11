import { User } from "@/lib/models/user.model";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { useState } from "react";
import UserInfo from "./UserInfo";
import Card from "@mui/material/Card";
import UserContactList from "./UserContactList";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`user-tabpanel-${index}`}
      aria-labelledby={`user-tab-${index}`}
      {...other}
    >
      {value === index && <>{children}</>}
    </div>
  );
}

declare type UserTabsProps = {
  user: User | undefined;
};

export default function UserTabs({ user }: UserTabsProps) {
  const [value, setValue] = useState(0);
  const handleChange = (val: number) => {
    setValue(val);
  };

  function a11yProps(index: number) {
    return {
      id: `user-tab-${index}`,
      "aria-controls": `user-tabpanel-${index}`,
    };
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Card className="mb-1">
        <Tabs
          value={value}
          onChange={(_, val) => handleChange(val)}
          aria-label="user tabs"
        >
          <Tab label="User details" {...a11yProps(0)} />
          <Tab label="Contacts" {...a11yProps(1)} />
          <Tab label="Documents" {...a11yProps(2)} />
        </Tabs>
      </Card>

      <CustomTabPanel value={value} index={0}>
        <UserInfo user={user} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <UserContactList />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        Item Three
      </CustomTabPanel>
    </Box>
  );
}
