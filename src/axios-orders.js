import axios from 'axios';

const instance = axios.create({
    baseURL:'https://react-my-burger-d4cec.firebaseio.com/'
})

export default instance;
