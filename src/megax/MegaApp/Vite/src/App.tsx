import "./App.css";
import AuthProvider from "./provider/authProvider";
import Routes from "./routes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DateFnsProvider from "./provider/DateFnsProvider";

function App() {
  return (
    <>
      <DateFnsProvider>
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
      </DateFnsProvider>
    </>
  );
}


export default App;
