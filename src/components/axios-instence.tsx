import axios from "axios";

const api = axios.create(
    {
        baseURL: "http://localhost:5028/api", 
        timeout: 10000, 
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
    }
}
)
export default api;