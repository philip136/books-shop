import axios from 'axios';
import {endpoint} from './constants';


export const authAxios = () => {
    const accessToken = localStorage.getItem("token");
    return axios.create({
        baseUrl: endpoint,
        headers: {
            Authorization: "JWT " + accessToken,
            "Content-Type": "application/json",
            "accept": "application/json",
        },
    });
};



