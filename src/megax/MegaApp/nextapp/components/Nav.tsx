"use client";

import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  MenuItem,
  Menu,
  Button,
  // Skeleton,
} from "@mui/material";
// import { signOut } from "next-auth/react";
import Link from "next/link";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { useState } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/lib/auth/useAuth";
import dynamic from "next/dynamic";
// import { googleLogout } from "@react-oauth/google";
import storage from "@/lib/storage";

function Nav() {
  const [isAuthenticated, username] = useAuth();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const router = useRouter();

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (redirectUrl?: string) => {
    setAnchorEl(null);
    if (redirectUrl) {
      router.push(redirectUrl);
    }
  };

  const handleLogout = () => {
    storage.delete('token');
    storage.delete('refresh-token');

    router.push('/login');
  }

  const toolbarBg = isAuthenticated ? "" : "bg-white";
  const logoColor = isAuthenticated ? "text-white" : "text-blue-500";

  return (
    <>
      <nav>
        <AppBar position="static" elevation={isAuthenticated ? 4 : 0}>
          <Toolbar variant="dense" color="white" className={toolbarBg}>
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 0 }}
              className={logoColor}
            >
              <Link href={"/"}>MegaX</Link>
            </Typography>
            {isAuthenticated ? (
              <div className="flex-1 flex">
                <div className="flex-1 flex items-center justify-center">
                  <Button
                    variant="outlined"
                    href="/admin/users"
                    className="text-white"
                  >
                    Users
                  </Button>

                  <Button
                    variant="outlined"
                    href="/admin/devices"
                    className="text-white"
                  >
                    Devices
                  </Button>
                </div>
                <div>
                  <span className="mr-1">Hi {username}</span>
                  <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleMenu}
                    color="inherit"
                  >
                    <AccountCircle />
                  </IconButton>
                  <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    open={Boolean(anchorEl)}
                    onClose={() => handleClose()}
                  >
                    <MenuItem onClick={() => handleClose("/profile")}>
                      Profile
                    </MenuItem>
                    <MenuItem onClick={() => handleLogout()}>Logout</MenuItem>
                  </Menu>
                </div>
              </div>
            ) : (
              <>
                <div>
                  <Button href="/about">About</Button>
                  <Button href="/login">Login</Button>
                </div>
              </>
            )}
          </Toolbar>
        </AppBar>
      </nav>
    </>
  );
}

export default dynamic(() => Promise.resolve(Nav), { ssr: false });
