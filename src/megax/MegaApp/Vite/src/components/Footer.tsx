import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import Container from "@mui/material/Container";

const pages = [
  { id: 1, name: "About", to: "/about-us" },
  { id: 2, name: "Privacy Policy", to: "/about-us" },
  { id: 3, name: "Licensing", to: "/about-us" },
  { id: 4, name: "Contact", to: "/about-us" },
];

function Footer() {
  return (
    <>
      <AppBar position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <footer className=" m-4 w-full mx-auto">
              <div className="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
                <span className="text-sm text-white sm:text-center ">
                  © 2023 <Link to="/">MegaX</Link>. All Rights Reserved.
                </span>
                <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-white  sm:mt-0 space-x-4">
                  {pages.map(page => (
                    <li key={page.id}>
                      <Link to={page.to}>
                        <Typography textAlign="center">{page.name}</Typography>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </footer>
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
}

export default Footer;
