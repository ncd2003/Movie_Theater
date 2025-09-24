import { BrowserRouter as Router, useRoutes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import routes from "./routes";
import { useEffect } from "react";
import { saveListIfEmpty } from "./utils/indexedDBService";

function App() {
  const content = useRoutes(routes);
  useEffect(() => {
    initDB();
  }, [])

  const initDB = async () => {
    await saveListIfEmpty();
  }
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      {content}
    </>
  );
}

export default App;
