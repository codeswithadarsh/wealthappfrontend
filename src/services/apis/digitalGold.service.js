import { getRequest, postRequest } from "../apiClient"
import { API_ROUTES } from "../../constants/apiRoutes"

export const buyGoldValidate = (payload) => {
    return postRequest(API_ROUTES.BUY_GOLD_VALIDATE, payload)
};

export const createGoldOrder = (payload) => {
    return postRequest(API_ROUTES.CREATE_GOLD_ORDER, payload)
};

export const createGoldOrderVerify = (payload) => {
    return postRequest(API_ROUTES.CREATE_GOLD_ORDER_VERIFY, payload)
};

export const goldLivePrice = (payload) => {
    return getRequest(API_ROUTES.FETCH_GOLD_LIVE_PRICE, payload)
};

export const getGoldPricehistory = (payload) => {
    return getRequest(API_ROUTES.GOLD_PRICE_HISTORY, payload)
};

export const sellLivePrice = (payload) => {
    return getRequest(API_ROUTES.FETCH_SELL_LIVE_PRICE, payload)
};

export const sellGoldValidate = (payload) => {
    return postRequest(API_ROUTES.SELL_GOLD_VALIDATE, payload)
};

export const initiateSellGold = (payload) => {
    return postRequest(API_ROUTES.INITIATE_SELL_GOLD, payload)
};

export const fetchGoldInvestedSummary = (payload) => {
    return getRequest(API_ROUTES.GOLD_INVESTED_SUMMARY, payload)
};

export const getGoldOrders = (payload) => {
    return getRequest(API_ROUTES.GOLD_ORDER_DETAILS, payload)
};