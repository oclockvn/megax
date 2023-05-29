import * as React from "react";
import NavBar from "../components/NavBar";

function HomeTemplate({ Component }) {
  return (
    <div>
      <div>Header</div>
      <NavBar />
      <Component />
      <div>Footer</div>
    </div>
  );
}

export default HomeTemplate;
