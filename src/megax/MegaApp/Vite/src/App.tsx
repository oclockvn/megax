import "./App.css";
import AuthProvider from "./provider/authProvider";
import Routes from "./routes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DateFnsProvider from "./provider/DateFnsProvider";
import { ConfirmProvider } from "material-ui-confirm";

function App() {
  return (
    <>
      <ConfirmProvider>
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
      </ConfirmProvider>
    </>
  );
}


export default App;
