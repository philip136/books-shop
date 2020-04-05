const localhost = "http://127.0.0.1:8000";

const apiUrl = "/api/";

export const endpoint = `${localhost}${apiUrl}`;

export const productListUrl = `${endpoint}products/`;
export const productDetailUrl = id => `${endpoint}products/${id}/`;
export const addToCartUrl = id => `${endpoint}cart/${id}/`;
export const myCartUrl = `${endpoint}cart/`;