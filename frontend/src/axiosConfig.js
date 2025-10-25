import axios from 'axios';

axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'https://doctor-appointment-system-7sb1.onrender.com';

export default axios;
