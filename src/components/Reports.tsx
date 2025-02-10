import { useEffect, useState } from "react";
import api from "./axios-instence";
import { toast } from "react-toastify";
import { date } from "yup";
import DatePicker from "react-datepicker";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const Reports = () => {
  const [customers, setCustomers] = useState([]);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [types, setTypes] = useState<any[]>([]);
  const [startDate, setStartDate] = useState<any>("");
  const [endDate, setEndDate] = useState<any>("");
  const [pdfUrl, setPdfUrl] =useState<string | null>(null);

  const [customerType, setCustomerType] = useState<any>("");
  const [customerName, setCustomerName] = useState<any>("");

  const getCustomers = async () => {
    setIsDataLoading(true);

    try {
      const params: any = {};

      if (startDate && endDate) {
        params.startDate = startDate;
        params.endDate = endDate;
      }
      if (customerType) {
        params.customerType = customerType;
      }
      if (customerName) {
        params.customerName = customerName;
      }

      const response = await api.get("/filtering", { params });

      setCustomers(response.data);
      console.log(response.data);
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Something went wrong!");
    } finally {
      setIsDataLoading(false);
    }
  };

  const getCustomerType = async () => {
    try {
      const response = await api.get("/customer-types");
      setTypes(response.data);
    } catch (error) {
      console.error("Error fetching customer types", error);
    }
  };
  useEffect(() => {
    getCustomers();
  }, [startDate, endDate, customerType, customerName]);

  useEffect(() => {
    getCustomers();
    getCustomerType();
  }, []);

  useEffect(() => {
    if (startDate && endDate) {
      getCustomers();
    }
  }, [startDate, endDate]);
  useEffect(() => {
    if (customerType) {
      getCustomers();
    }
  }, [customerType]);

  useEffect(() => {
    if (customerName) {
      getCustomers();
    }
  }, [customerName]);

  const exportFile = async (fileType: string) => {
    const exportData = customers.map((c, index) => ({
      slNo: index + 1,
      customerId: c.customerId,
      customerName: c.customerName,
      address: c.address,
      customerType: c.customerType,
      businessStart: c.businessStart,
      phone: c.phone,
      email: c.email,
      creditLimit: c.creditLimit,
      photoUrl: c.photoUrl,
      deliveryAddresses: c.deliveryAddresses.map((d) => ({
        contactPerson: d.contactPerson,
        phone: d.phone,
        address: d.address,
      })),
    }));

    try {
      const res = await api.post(`/${fileType}`, exportData, {
        responseType: "blob",
      });

      const blob = new Blob([res.data], { type: `application/${fileType}` });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `export.${fileType}`;
      link.click();
      //window.open()
    } catch (error) {
      console.error("Error exporting File:", error);
    }
  };




  const PreviewPdf = async (fileType: string) => {
    const exportData = customers.map((c, index) => ({
      slNo: index + 1,
      customerId: c.customerId,
      customerName: c.customerName,
      address: c.address,
      customerType: c.customerType,
      businessStart: c.businessStart,
      phone: c.phone,
      email: c.email,
      creditLimit: c.creditLimit,
      photoUrl: c.photoUrl,
      deliveryAddresses: c.deliveryAddresses.map((d) => ({
        contactPerson: d.contactPerson,
        phone: d.phone,
        address: d.address,
      })),
    }));

    try {
      const res = await api.post(`/${fileType}`, exportData, {
        responseType: "blob",
      });

      const blob = new Blob([res.data], { type: `application/${fileType}` });
      
      setPdfUrl(URL.createObjectURL(blob));
     /*  const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `export.${fileType}`;
      link.click();
      window.open() */
    } catch (error) {
      console.error("Error exporting File:", error);
    }
  };

  return (
    <>
      {pdfUrl && (
                <div style={{ position: "relative", width: "100%", maxWidth: "900px", margin: "10px auto" }}>
                    <button 
                        onClick={() => setPdfUrl(null)} 
                       
                    >
                        <i className=" text-danger  btn-sm bi bi-x-lg"></i>
                    </button>

                    <iframe
                        src={pdfUrl}
                        style={{ width: "100%", height: "800px", border: "1px  #ddd" }}
                        title="PDF Preview"
                    ></iframe>
                </div>
            )}


      <div className="container">
        <h2 className="text-center mb-4">Customer Information Report</h2>

        <div className="row">
          <div className="col-3"></div>
          <div className="col-4 border text-center">Select Date Range</div>
        </div>

        <div className="row mb-3">
          <div className="col-1">
            <span>Filter By:</span>
          </div>
          <div className="col-2 border">
            <select onChange={(e) => setCustomerType(e.target.value)}>
              <option>Customer Type</option>
              {types.map((type) => (
                <option key={type.id} value={type.name}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-2 border">
            <input
              type="date"
              title="Business Start From"
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div className="col-2 border">
            <input
              type="date"
              placeholder="To"
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <div className="col-1 border ">
            <input
              type="text"
              placeholder="Customer"
              onChange={(e) => setCustomerName(e.target.value)}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-1"></div>
          <div className="col-1"></div>
          <div className="col-1"></div>
          {/* <div className="col-1 border bg-light">
            <button className="btn text-dark" onClick={() =>exportFile('pdf')}>Export Report</button>
            <button className="btn text-dark" onClick={() =>exportFile('docx')}>Export Report</button>
            <button className="btn text-dark" onClick={() =>exportFile('xls')}>Export Report</button>
          </div> */}
          <div className="col-2 border bg-light">
            <div className="dropdown">
              <button
                className="dropdown-toggle btn text-dark"
                type="button"
                id="dropdownMenuButton"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Export Report
              </button>
              <ul
                className="dropdown-menu"
                aria-labelledby="dropdownMenuButton"
              >
                <li>
                  <a
                    className="dropdown-item"
                    href="#"
                    onClick={() => exportFile("pdf")}
                  >
                    Export as PDF
                  </a>
                </li>
                <li>
                  <a
                    className="dropdown-item"
                    href="#"
                    onClick={() => exportFile("docx")}
                  >
                    Export as Word
                  </a>
                </li>
                <li>
                  <a
                    className="dropdown-item"
                    href="#"
                    onClick={() => exportFile("xls")}
                  >
                    Export as Excel
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-2 border bg-light">
            <button className="btn" onClick={() => PreviewPdf('pdf')}>Preview</button>
          </div>






           {/*  <div className="col-2 border bg-light">
                        <div className="dropdown">
                          <button
                            className="dropdown-toggle btn text-dark"
                            type="button"
                            id="dropdownMenuButton"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            Preview
                          </button>
                          <ul
                            className="dropdown-menu"
                            aria-labelledby="dropdownMenuButton"
                          >
                            <li>
                              <a
                                className="dropdown-item"
                                href="#"
                                onClick={() => PreviewPdf("pdf")}
                              >
                                Preview as PDF
                              </a>
                            </li>
                            <li>
                              <a
                                className="dropdown-item"
                                href="#"
                                onClick={() => PreviewPdf("docx")}
                              >
                                Preview as Word
                              </a>
                            </li>
                            <li>
                              <a
                                className="dropdown-item"
                                href="#"
                                onClick={() => PreviewPdf("xls")}
                              >
                                Preview as Excel
                              </a>
                            </li>
                          </ul>
                        </div>
            </div> */}











          <div className="col-1"></div>

          <div className="col-6"></div>
        </div>

        <div className="row border">
          <div className="col-1 border" style={{ width: "7.42%" }}>
            SI No.
          </div>
          <div className="col-1 border" style={{ width: "7.83%" }}>
            Customer ID
          </div>
          <div className="col-2 border" style={{ width: "9.75%" }}>
            Customer Name
          </div>
          <div className="col-1 border">Customer Address</div>
          <div className="col-1 border">Customer Type</div>
          <div className="col-1 border">Business Start</div>
          <div className="col-1 border">Phone</div>
          <div className="col-1 border">Email</div>
          <div className="col-1 border">Credit Limit</div>
          <div className="col-1 border">Photo</div>
          <div className="col-2 border">Delivery Address info</div>
        </div>



      


        {customers.map((c, index) => (
          <div className="row border">
            <div className="col-1 border" style={{ width: "7.42%" }}>
              {index + 1}
            </div>
            <div className="col-1 border" style={{ width: "7.83%" }}>
              {c.customerId}
            </div>
            <div className="col-2 border" style={{ width: "9.75%" }}>
              {c.customerName}
            </div>
            <div className="col-1 border overflow-hidden text-nowrap">
              {" "}
              {c.address}
            </div>
            <div className="col-1 border"> {c.customerType}</div>
            <div className="col-1 border">
              {" "}
              {c.businessStart
                ? new Intl.DateTimeFormat("en-CA", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  }).format(new Date(c.businessStart))
                : "N/A"}
            </div>
            <div className="col-1 border">{c.phone}</div>
            <div className="col-1 border overflow-hidden text-nowrap">
              {c.email}
            </div>
            <div className="col-1 border">{c.creditLimit}</div>
            <div className="col-1 border">
              <img
                src={`http://localhost:5028/pictures/${c.photoUrl}`}
                width={45}
              />
            </div>
            <div className="col-2 border">
              {c.deliveryAddresses.map((d) => (
                <div style={{ fontSize: ".45rem" }}>
                  {d.contactPerson}, {d.phone}, {d.address}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>



     
    </>
  );
};
export default Reports;
