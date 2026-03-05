export const API_ROUTES = {
  MENU: '/products/categories',
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh'
  },
  PRODUCTS: {
    BASE: '/products',
    SEARCH: '/products/search',
    CATEGORY: '/products/category',
    NEW_EYEWEAR: '/products/new-eyewear',
    BEST_SELLER: '/products/best-seller',
    RECOMMENDATIONS: (id: string) => `/products/recommendations/${id}`,
    ATTRIBUTES: (id: string) => `/products/${id}/attributes`
  },
  ORDERS: {
    BASE: '/orders',
    SUMMARY: (id: string) => `/orders/summary/${id}`,
    SUBMIT: (id: string) => `/orders/submit/${id}`,
    PAYMENT: '/orders/payment',
    STATUS: (id: string) => `/orders/${id}/status`,
    CHECK_PAYMENT: (id: string) => `/orders/check-payment-status/${id}`
  },
  CART: {
    BASE: '/cart',
    COUNT: '/cart/count'
  },
  WISHLIST: {
    BASE: '/wishlist',
    TOGGLE: '/wishlist/toggle',
    COUNT: '/wishlist/count'
  },
  REFUND: {
    STATUS: (id: string) => `/refund/status/${id}`,
    SUBMIT: '/refund/submit',
    SHIP: '/refund/ship',
    ACCOUNTS: '/refund/accounts',
    SAVE_ACCOUNT: '/refund/accounts/save'
  },
  CANCEL: {
    SUBMIT: '/cancel/submit',
    STATUS: (id: string) => `/cancel/status/${id}`
  },
  SHIPPING: {
    BASE: '/shipping',
    ADDRESS: '/shipping-address',
    SAVE: '/shipping-address/save'
  }
}
