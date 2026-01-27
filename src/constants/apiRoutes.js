export const API_ROUTES = {
  USER_EXIST_CHECK: "/api/users/check-email",
  USER_LOGIN: "/api/auth/login",
  USER_Register: "/api/auth/register",
  FORGET_PASSWORD: "/api/auth/forgot-password",
  RESET_PASSWORD: "/api/auth/reset-password",
  USER_PROFILE: "/api/users/getprofile",

  WALLET_BALANCE_WITH_BANK: "/api/wallet/wallet-balance",
  WALLET_HISTORY: '/api/wallet/wallet-history',
  WALLET_ADD_BANK: '/api/wallet/add-bank',
  WALLET_WITHDRAW_BALANCE: '/api/wallet/withdraw-wallet-balance',

  GOLD_INVESTED_SUMMARY: "/api/gold/invested-summary",
  GOLD_ORDER_DETAILS: "/api/gold/orders",

  BUY_GOLD_VALIDATE: "/api/gold/validate-buy",
  CREATE_GOLD_ORDER: "/api/payments/create-order",
  CREATE_GOLD_ORDER_VERIFY: "/api/payments/verify",

  SELL_GOLD_VALIDATE: "/api/sellgold/validatesellgold",
  INITIATE_SELL_GOLD: "/api/sellgold/sellgold",

  FETCH_SELL_LIVE_PRICE: "/api/gold/sell-price",
  FETCH_GOLD_LIVE_PRICE: "/api/gold/live-price",

  GET_DASHBOARD_ALL_ASSETS_DETAILS: "/api/users/assets-details"
}
