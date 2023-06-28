import Header from "../components/Header";
import Container from "@mui/material/Container";
import Footer from "../components/Footer";

function HomeTemplate({ Component }) {
  return (
    <>
      <Header />
      <Container maxWidth="xl" className="mx-auto ">
        <div className="mt-4">
          <Component />
        </div>
      </Container>
      <Footer />
    </>
  );
}

export default HomeTemplate;
