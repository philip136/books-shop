import axios from 'axios';
import {endpoint} from './constants';


export function authAxios() {
    const accessToken = localStorage.getItem("token");
    return axios.create({
        baseUrl: endpoint,
        timeout: 5000,
        headers: {
            Authorization: accessToken ? "Token " + accessToken : null,
            "Content-Type": "application/json",
            accept: "application/json",
        },
    });
}
