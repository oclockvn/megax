import "./App.css";
import AuthProvider from "./provider/authProvider";
import Routes from "./routes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import DateFnsProvider from "./provider/DateFnsProvider";

function App() {
  return (
    <>
      <DateFnsProvider>
        {/* <LocalizationProvider dateAdapter={AdapterDateFns}> */}
        <AuthProvider>
          <Routes />
          <ToastContainer
            position="top-right"
            autoClose={1000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
          />
        </AuthProvider>
        {/* </LocalizationProvider> */}
      </DateFnsProvider>
    </>
  );
}


export default App;
