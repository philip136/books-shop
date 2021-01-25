const localhost = "http://127.0.0.1:8000";

const apiUrl = "/api/";

export const endpoint = `${localhost}${apiUrl}`;

export const productListUrl = `${endpoint}products/`;
export const productTypeUrl = slug => `${endpoint}products/type/${slug}/`;
export const productDetailUrl = id => `${endpoint}products/${id}/`;
export const addToCartUrl = id => `${endpoint}cart/${id}/`;
export const myCartUrl = username =>  `${endpoint}cart/${username}/`;
export const deleteCartItemUrl = id => `${endpoint}cart/delete/${id}/`;
export const updateCartItemUrl = id => `${endpoint}cart/update/${id}/`;
export const orderUrl = `${endpoint}order/success/`;
export const locationDetail = user => `${endpoint}location/${user}/`;
export const socket_url = roomId => `ws://127.0.0.1:8000/ws/${roomId}/`;
export const orderRoomUrl = roomId => `${endpoint}order-room/${roomId}/`;
export const roomUrl = `${endpoint}get-room/`;
export const registrationUrl = `${endpoint}create/user/`;
export const loginUrl = `${endpoint}token/obtain/`;
export const refreshTokenUrl = `${endpoint}token/refresh/`;
export const closeOrderUrl = id => `${endpoint}order-room/${id}/`;