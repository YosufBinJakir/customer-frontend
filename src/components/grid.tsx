import { useEffect, useState } from "react";
import api from "./axios-instence";
import { Link } from "react-router-dom";


const CustomerData = () => {
  const [customers, setCustomers] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

 

  useEffect(() => {
    fetchCustomers();
  }, [pageNumber]);

  const fetchCustomers = async () => {
    try {
      const response = await api.get(
        `/customers?pageNumber=${pageNumber}&pageSize=${pageSize}`
      );
      setCustomers(response.data.data);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  const handleFirstPage = () => setPageNumber(1);
  const handleLastPage = () => setPageNumber(totalPages);
  const handleNext = () => {
    if (pageNumber < totalPages) setPageNumber(pageNumber + 1);
  };

  const handlePrev = () => {
    if (pageNumber > 1) setPageNumber(pageNumber - 1);
  };

  return (
    <>
      {/*  <h2>Customer List</h2>
      <ul>
        {customers.map((customer: any) => (
            <div>
                <div>{customer.id}</div>
                <div>{customer.customerId}</div>
                <div>{customer.customerName}</div>
            </div>
          
        ))}
      </ul>

      <div>
      <button onClick={handleFirstPage} disabled={pageNumber === 1}>
          First
        </button>
        <button onClick={handlePrev} disabled={pageNumber === 1}>
          Previous
        </button>
        <span>
          {" "}
          Page {pageNumber} of {totalPages}{" "}
        </span>
        <button onClick={handleNext} disabled={pageNumber === totalPages}>
          Next
        </button>

        <button onClick={handleLastPage} disabled={pageNumber === totalPages}>
          Last
        </button>


      </div>
      <button className="btn btn-danger">Delete</button>
 */}

      <div className="container">
        <div className="row">
          <div className="col-6"></div>
          <div className="col-6 border"><input className="w-100 text-center" placeholder="Search"/> </div>
        </div>
        <div className="row border">
          <div className="col-3 border  text-center">Customer ID</div>
          <div className="col-2 border text-center">Name</div>
          <div className="col-1 border">Address</div>
          <div className="col-2 border text-center ">Bus. Start</div>
          <div className="col-2 border text-center">Cus. Type</div>
          <div className="col-2 border text-center">Credit Limit</div>
        </div>
        {customers.map((customer: any) => (
        <div className="row border">
          <div className="col-3 border" style={{ width: "12.5%" }}>
            {customer.id}
          </div>
          <div className="col-2 border" style={{ width: "12.5%" }}>
          <Link to={`/detail/${customer.id}`}>{customer.customerId}</Link>
         
          </div>
          <div className="col-2 border text-center">{customer.customerName}</div>
          <div className="col-1 border overflow-hidden text-nowrap text-center">{customer.address}</div>
          <div className="col-2 border text-center">{customer.businessStart}</div>
          <div className="col-2 border text-center">{customer.customerType}</div>
          <div className="col-2 border text-center">{customer.creditLimit}</div>
        </div>
         ))}
      </div>
      <div className="row">
      <div className="col-6"></div>
     
        <div className="col-2 border text-center" style={{ width: "10.5%" }}> <button className="btn btn-light" onClick={handleFirstPage} disabled={pageNumber === 1}>
          First
        </button></div>
          <div className="col-2 border text-center" style={{ width: "10.5%" }}> <button className="btn btn-light" onClick={handlePrev} disabled={pageNumber === 1}>
          Previous
        </button></div>
          <div className="col-2 border text-center" style={{ width: "10.5%" }}>{pageNumber}</div>
          <div className="col-1 border text-center" style={{ width: "4.5%" }}>{pageNumber +1}</div>
          <div className="col-1 border text-center" style={{ width: "4.5%" }}><button className="btn btn-light" onClick={handleNext} disabled={pageNumber === totalPages}>
          Next
        </button></div>
          <div className="col-1 border text-center" style={{ width: "4.5%" }}><button className="btn btn-light" onClick={handleLastPage} disabled={pageNumber === totalPages}>
          Last
        </button></div>
        </div>

       
    </>
  );
};
export default CustomerData;
