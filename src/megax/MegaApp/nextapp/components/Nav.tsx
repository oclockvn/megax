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
import Link from "next/link";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { hasRoles } from "@/lib/auth/useAuth";
import dynamic from "next/dynamic";
import storage from "@/lib/storage";
import { AuthContext } from "@/hooks/context";

declare type NavLink = {
  label: string;
  href: string;
  requiredRoles?: string[];
};

function Nav() {
  const { isAuthenticated, name: username, roles } = useContext(AuthContext);
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
    storage.delete("token");
    storage.delete("refresh-token");

    router.push("/login");
  };

  const routes: NavLink[] = [
    {
      label: "Requests",
      href: "/requests",
    },
    {
      label: "Tasks",
      href: "/tasks",
    },
    {
      label: "Report",
      href: "/report",
    },
    {
      label: "Users",
      href: "/admin/users",
      requiredRoles: ["admin", "hr", "leader"],
    },
    {
      label: "Devices",
      href: "/admin/devices",
      requiredRoles: ["admin", "hr", "leader"],
    },
  ].filter(link => hasRoles(link.requiredRoles, roles));

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
                  {routes.map((r, i) => (
                    <Link key={i} href={r.href} className="!text-white p-3">
                      {r.label}
                    </Link>
                  ))}
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
                    <MenuItem onClick={() => handleClose("/leave")}>
                      Leave Request
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
