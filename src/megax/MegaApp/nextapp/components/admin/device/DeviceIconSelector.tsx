import KeyboardIcon from "@mui/icons-material/Keyboard";
import MonitorIcon from "@mui/icons-material/Monitor";
import LaptopMacIcon from "@mui/icons-material/LaptopMac";
import MouseIcon from "@mui/icons-material/Mouse";
import HeadphonesIcon from "@mui/icons-material/Headphones";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import InventoryIcon from "@mui/icons-material/Inventory";

export default function DeviceIconSelector({
  deviceType,
}: {
  deviceType: string;
}) {
  switch (deviceType.toLowerCase()) {
    case "monitor":
      return <MonitorIcon />;
    case "keyboard":
      return <KeyboardIcon />;
    case "laptop":
      return <LaptopMacIcon />;
    case "mouse":
      return <MouseIcon />;
    case "headset":
      return <HeadphonesIcon />;
    case "camera":
      return <CameraAltIcon />;
    default:
      return <InventoryIcon />;
  }
}
