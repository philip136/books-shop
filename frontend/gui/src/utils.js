import axios from 'axios';
import {endpoint} from './constants';

export const authAxios = axios.create({
    baseUrl: endpoint,
    headers: {
        Authorization: `Token ${localStorage.getItem("token")}`
    }
});