import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Link, useNavigate } from "react-router-dom";
import storage from "../lib/storage";

function Header() {
  const token = storage.get("token");

  const navigate = useNavigate();
  const handleLogout = () => {
    storage.remove("token");
    navigate("/");
    navigate(0);
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar
          position="static"
          style={{ background: "white", color: "#1181e1" }}
        >
          <Toolbar variant="dense" color="yellow">
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              <Link to={"/"}>MegaX</Link>
            </Typography>
            <Button color="inherit">
              <Link to={"/about-us"}>About</Link>
            </Button>
            {token && (
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            )}
          </Toolbar>
        </AppBar>
      </Box>
    </>
  );
}

export default Header;
