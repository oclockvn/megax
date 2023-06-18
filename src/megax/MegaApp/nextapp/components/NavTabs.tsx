import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { useRouter } from "next/navigation";
import { useState } from "react";
interface LinkTabProps {
  label: string;
  href: string;
}

export default function NavTabs({ links }: { links: LinkTabProps[] }) {
  const [value, setValue] = useState(0);
  const router = useRouter();

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleNav = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    link: LinkTabProps
  ) => {
    event.preventDefault();
    router.push(link.href);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Tabs value={value} onChange={handleChange} aria-label="user nav">
        {links.map((link, index) => (
          <Tab
            key={index}
            component="a"
            onClick={e => handleNav(e, link)}
            label={link.label}
          />
        ))}
      </Tabs>
    </Box>
  );
}
