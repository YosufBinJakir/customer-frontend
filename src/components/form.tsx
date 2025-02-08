import React, { useEffect, useRef, useState } from "react";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import api from "./axios-instence";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";



interface DeliveryAddress {
  address: string;
  contactPerson: string;
  phone: string;
}

interface CustomerFormValues {
  customerId: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  customerType: string;
  creditLimit: number;
  businessStart: string;
  deliveryAddresses: DeliveryAddress[];
}

const CustomerForm = () => {
  const [photo, setPhoto] = useState<File | null>(null);
  const [customerId, setCustomerId] = useState("");
  const [types, setTypes] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [prevPhoto, setPrevPhoto] = useState<string | null>(null);
  const navigate = useNavigate();
  const handleClear = () => {
    /* setPhoto(null);
    setPhotoPreview(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    } */
   navigate('/');
  };
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setPhoto(file);

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPhotoPreview(null);
    }
  };
  const [initialValues, setInitialValues] = useState<CustomerFormValues>({
    customerId: "",
    customerName: "",
    email: "",
    phone: "",
    address: "",
    customerType: "",
    creditLimit: 0,
    businessStart: "",
    deliveryAddresses: [{ address: "", contactPerson: "", phone: "" }],
  });

  const validationSchema = Yup.object({
    customerId: Yup.string(),
    customerName: Yup.string(),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phone: Yup.string().required("Phone is required").min(11, "Phone Number must be of 11 digit")
    .max(14, "Phone number should not be greater than 14 characters")
    .matches(/^\+?[0-9]+$/, "Phone number can only contain numbers and  +"),
    address: Yup.string(),
    customerType: Yup.string().required("Customer Type is required"),
    creditLimit: Yup.number()
      .min(100, "Minimum Credit limit 100")
      .max(2000, "Credit limit cannot be upper 2000"),
    businessStart: Yup.date(),
    deliveryAddresses: Yup.array().of(
      Yup.object({
        address: Yup.string().required("Address is required"),
        contactPerson: Yup.string().required("Contact Person is required"),
        phone: Yup.string().required("Phone is required"),
      })
    ),
  });

  const handleSubmit = async (
    values: CustomerFormValues,
    { resetForm }: any
  ) => {
    try {
      const formData = new FormData();
      formData.append("customerId", customerId);
      formData.append("customerName", values.customerName);
      formData.append("email", values.email);
      formData.append("phone", values.phone);
      formData.append("address", values.address);
      formData.append("customerType", values.customerType);
      formData.append("creditLimit", values.creditLimit.toString());
      formData.append("businessStart", values.businessStart);

      if (photo) {
        formData.append("photo", photo); 
      }

      values.deliveryAddresses.forEach((address, index) => {
        formData.append(`deliveryAddresses[${index}].address`, address.address);
        formData.append(
          `deliveryAddresses[${index}].contactPerson`,
          address.contactPerson
        );
        formData.append(`deliveryAddresses[${index}].phone`, address.phone);
      });

     if(id){
      try{
        const res =await axios.put(`http://localhost:5028/api/customers/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success(res.data.message);
        navigate('/');
      }
      catch(error:any){
        toast.error(error.response?.data ||"some error!");
      }
     }
     else{
      try{
        const res = await axios.post("http://localhost:5028/api/customers", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success(res.data.message);
       /*  if(res.status ===200){
          navigate('/');
        } */
        
      }
      catch(error : any){
        toast.error(error.response?.data ||"some error!");
      }
      
     }
      resetForm();
      setCustomerId("");
      const newCustomerId = await api.get("/customers/next-customer-id");
      setCustomerId(newCustomerId.data.nextCustomerId);
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; 
      }
      setPhotoPreview(null);
      setPhoto(null);
   
    } catch (error:any) {
      toast.error(error.response.data ||"some error!");
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
    getCustomerType();
    const fetchNextCustomerId = async () => {
      try {
        const response = await api.get("/customers/next-customer-id");
        setCustomerId(response.data.nextCustomerId);
      } catch (error) {
        console.error("Error fetching Customer ID", error);
      }
    };
    fetchNextCustomerId();
  }, []);

  const fetchCategory = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5028/api/customers/${id}`
      );
      const formattedBusinessStart = response.data.businessStart
        ? new Date(response.data.businessStart).toISOString().split("T")[0] 
        : "";
      setInitialValues({
        ...response.data,
        businessStart: formattedBusinessStart, 
      });
      setCustomerId(response.data.customerId)
      console.log(response.data.businessStart)
      setPrevPhoto(response.data.photoUrl);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const { id } = useParams();
  useEffect(() => {
    fetchCategory();
  }, [id]);

  
  const handleDelete = async (id:any) =>{
    if(confirm("are you sure to delete?")){
      try{
        const res = await api.delete(`/customers/${id}`);
        toast.success(res.data.message);
      }
      catch(error){
        toast.error("Some error!!")
      }
      
    }
    
  }

  /*  const [cust , setCust] = useState<any>();
  const {id} = useParams();
  const [formValues, setFormValues] = useState(initialValues);
  

  const getCustomer = async (id:any) =>{
    const res = await api.get(`/customers/${id}`);
    setCust(res.data);
  }

  useEffect(() => {
    if (id) {
      
        setFormValues(cust); 
      
    } else {
      setFormValues(initialValues); 
    }
  }, [id]); */

  /*  const [customers, setCustomers] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(10); // You can allow users to change this
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
  }; */
  return (
    <Formik
      
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ values, resetForm }) => (
        <Form className="container p-4 border rounded-md shadow-md">
          <h1 className="text-center fw-bold">Customer Information Setup</h1>
          <div className="row">
            <div className="col-8"></div>
            <div className={id ? "col-1 border bg-primary" :"col-1 border bg-success"}>
              <button
                type="submit"
                className={id ? "btn btn-primary btn-sm w-100 text-black fw-bold" :"btn btn-success btn-sm w-100 text-black fw-bold"}
              >
                {id ? 'Update' : 'Save'}
              </button>
            </div>
            <div className="col-1 border bg-danger">
              <button
                type="button"
                className="btn btn-danger btn-sm w-100 text-black fw-bold"
                onClick={() => handleDelete(id)}
              >
                Delete
              </button>
            </div>
            <div className="col-1 border">
              <button
                className="btn btn-outline btn-sm w-100 text-black fw-bold"
                type="button"
                
                onClick={id ? handleClear : () => {
                  resetForm();
                  setPhoto(null);
                  setPhotoPreview(null);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                  }
                }}
              >
                Clear
              </button>
            </div>
          </div>
          <div className="container">
            <div className="row border">
              <div className="col-6">
                <div className="border d-flex">
                  <label className="col-3">Customer ID :</label>
                  <Field
                    name="customerId"
                    className="border p-2 rounded-md w-100"
                    value={customerId}
                    readOnly
                  />
                  <ErrorMessage
                    name="customerId"
                    component="div"
                    className="text-red-500"
                  />
                </div>
                <div className="border d-flex">
                  <label className="col-3">Customer Name :</label>
                  <Field
                    name="customerName"
                    className="border p-2 rounded-md w-100"
                  />
                  <ErrorMessage
                    name="customerName"
                    component="div"
                    className="text-red-500"
                  />
                </div>
              </div>
              <div className="col-6 d-flex  align-items-center justify-content-right">
                <label className="col-3">Address :</label>
                <Field
                  as="textarea"
                  name="address"
                  className="border border-3 w-100"
                />
                <ErrorMessage
                  name="address"
                  component="div"
                  className="text-red-500"
                />
              </div>
            </div>

            <div className="row">
              <div className="col-6 border d-flex">
                <label className="col-3">Business Start :</label>
                <Field
                  name="businessStart"
                  type="date"
                  className="border  rounded-md w-100"
                />
                <ErrorMessage
                  name="businessStart"
                  component="div"
                  className="text-red-500"
                />
              </div>

              <div className="col-6 border d-flex">
                <label className="col-3">Customer Type</label>
                <Field
                  name="customerType"
                  as="select"
                  className="border rounded-md w-100"
                >
                  <option value="">Choose a type</option>
                  {types.map((type) => (
                    <option key={type.id} value={type.name}>
                      {type.name}
                    </option>
                  ))}
                </Field>
                <ErrorMessage
                  name="customerType"
                  component="div"
                  className="text-red-500"
                />
              </div>
            </div>

            <div className="row">
              <div className="col-6 border d-flex">
                <label className="col-3">Phone :</label>
                <Field name="phone" className="border p-2 rounded-md w-100" />
                <ErrorMessage
                  name="phone"
                  component="div"
                  className="text-red-500"
                />
              </div>

              <div className="col-6 border d-flex">
                <label className="col-3">Email :</label>
                <Field
                  name="email"
                  type="email"
                  className="border p-2 rounded-md w-100"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500"
                />
              </div>
            </div>

            <div className="row">
              <div className="col-6 border d-flex align-items-center justify-content-right">
                <label className="col-3">Photo</label>
                <input
                  type="file"
                  // onChange={(e) => setPhoto(e.target.files?.[0] || null)}
                  onChange={handlePhotoChange}
                  ref={fileInputRef}
                />
              </div>

              
                <div className="col-6 d-flex">
                  {(prevPhoto || photoPreview) && (
                    <div className="border border-3 mx-auto">
                      <img
                        src={
                          photoPreview
                            ? photoPreview
                            : `http://localhost:5028/pictures/${prevPhoto}`
                        }
                        alt="Preview"
                        width="100"
                      />
                    </div>
                  )}
                </div>
             
            </div>

            <div className="row">
              <div className="col-6 border d-flex">
                <label className="col-3">Credit Limit</label>
                <Field
                  name="creditLimit"
                  type="number"
                  className="border p-2 rounded-md w-100"
                />
                <ErrorMessage
                  name="creditLimit"
                  component="div"
                  className="text-red-500"
                />
              </div>
              <div className="col-6"></div>
            </div>

            <FieldArray name="deliveryAddresses">
              {({ push, remove }) => (
                <div>
                  <h3>Delivery Addresses Info</h3>
                  <div className="row">
                    <label className="col-3 border">Delivery Address</label>

                    <label className="col-3 border">Contact Person</label>

                    <label className="col-3 border">Phone</label>

                    <label className="col-3 border">Action</label>
                  </div>

                  {values.deliveryAddresses.map((_, index) => (
                    <div key={index} className="border  rounded-md">
                      <div className="row">
                        <div className="col-3 border d-flex">
                          <Field
                            name={`deliveryAddresses[${index}].address`}
                            placeholder="Address"
                            className=" rounded-md w-100"
                          />
                          <ErrorMessage
                            name={`deliveryAddresses[${index}].address`}
                            component="div"
                            className="text-red-500"
                          />
                        </div>

                        <div className="col-3 border d-flex">
                          <Field
                            name={`deliveryAddresses[${index}].contactPerson`}
                            placeholder="contactPerson"
                            className=" rounded-md w-100"
                          />
                          <ErrorMessage
                            name={`deliveryAddresses[${index}].contactPerson`}
                            component="div"
                            className="text-red-500"
                          />
                        </div>

                        <div className="col-3 border d-flex">
                          <Field
                            name={`deliveryAddresses[${index}].phone`}
                            placeholder="phone"
                            className=" rounded-md w-100"
                          />
                          <ErrorMessage
                            name={`deliveryAddresses[${index}].phone`}
                            component="div"
                            className="text-red-500"
                          />
                        </div>

                        <div className="col-2 d-flex justify-content-center align-items-center" style={{ width: "12.5%" }}>
                          <button
                            type="button"
                            onClick={() =>
                              push({
                                address: "",
                                contactPerson: "",
                                phone: "",
                              })
                            }
                            className="btn"
                          >
                           <strong><i className="bi bi-plus-lg text-success"></i></strong>
                          </button>
                        </div>
                        <div className="col-2" style={{ width: "12.5%" }}>
                          <button
                            type="button"
                            onClick={() => remove(index)}
                            className="btn"
                          >
                            <strong><i className="bi bi-x-lg text-danger"></i></strong>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </FieldArray>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default CustomerForm;
