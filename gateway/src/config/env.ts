import dotenv from "dotenv";

dotenv.config();

export const env = {
  clientOrigin: process.env.CLIENT_ORIGIN ?? "http://localhost:5173",

  services: {
    auth: process.env.AUTH_SERVICE_URL!,
    product: process.env.PRODUCT_SERVICE_URL!,
    user: process.env.USER_SERVICE_URL!,

    order: process.env.ORDER_SERVICE_URL!,
    cart: process.env.CART_SERVICE_URL!,
    payment: process.env.PAYMENT_SERVICE_URL!,
  },
};
