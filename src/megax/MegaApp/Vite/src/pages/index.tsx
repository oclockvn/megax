import * as React from "react";
import Header from "../components/Header";
import NavBar from "../components/NavBar";
import Container from "@mui/material/Container";

function HomeTemplate({ Component }) {
  return (
    <>
      <Header />

      <Container maxWidth="xl" className="mx-auto ">
        {/* <NavBar /> */}
        <div className="mt-4">
          <Component />
        </div>
        <div>Footer</div>
      </Container>
    </>
  );
}

export default HomeTemplate;
