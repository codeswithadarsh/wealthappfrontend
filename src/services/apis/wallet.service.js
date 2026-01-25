import { getRequest, postRequest } from "../apiClient"
import { API_ROUTES } from "../../constants/apiRoutes"

export const fetchWalletBalanceWithBankDetails = (payload) => {
  return getRequest(API_ROUTES.WALLET_BALANCE_WITH_BANK, payload)
};

export const fetchWalletHistory = (payload) => {
  return getRequest(API_ROUTES.WALLET_HISTORY, payload)
};

export const walletAddBank = (payload) => {
  return postRequest(API_ROUTES.WALLET_ADD_BANK, payload)
};

export const walletWithdrawBalance = (payload) => {
  return postRequest(API_ROUTES.WALLET_WITHDRAW_BALANCE, payload)
};