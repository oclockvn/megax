"use client";

import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  MenuItem,
  Menu,
  Button,
} from "@mui/material";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Nav() {
  const session = useSession();
  const isAuthenticated = session.status === "authenticated";

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

  const toolbarBg = isAuthenticated ? "" : "bg-white";
  const logoColor = isAuthenticated ? "text-white" : "text-blue-500";

  return (
    <>
      <nav>
        <AppBar position="static">
          <Toolbar variant="dense" color="white" className={toolbarBg}>
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1 }}
              className={logoColor}
            >
              <Link href={"/"}>MegaX</Link>
            </Typography>
            {isAuthenticated ? (
              <div>
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
                  <MenuItem onClick={() => signOut()}>Logout</MenuItem>
                </Menu>
              </div>
            ) : (
              <>
                <div>
                  <Button>
                    <Link href="/about">About</Link>
                  </Button>
                  <Button>
                    <Link href="/login">Login</Link>
                  </Button>
                </div>
              </>
            )}
          </Toolbar>
        </AppBar>
      </nav>
    </>
  );
}
