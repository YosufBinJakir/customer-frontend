import { useEffect, useState } from "react";
import "./App.css";
import api from "./components/axios-instence";
import CustomerForm from "./components/form";
import CustomerData from "./components/grid";
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap-icons/font/bootstrap-icons.css';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CustomerPage from "./components/customer-info";


function App() {
  const [types, setTypes] = useState<any[]>([]);
  const getCustomerType = async () => {
    const response = await api.get("/customer-types");
    setTypes(response.data);
    console.log(types);
  };

  useEffect(() => {
    getCustomerType();
  }, []);

  return (
    <>
     <ToastContainer position="top-right" autoClose={3000} />
      <Router>
        <Routes>
          <Route path="/" element={<CustomerPage/>}/>
          <Route path="/detail/:id" element={<CustomerForm/>}/>
        </Routes>
        <CustomerData/>
      </Router>
      
    </>
  );
}

export default App;
