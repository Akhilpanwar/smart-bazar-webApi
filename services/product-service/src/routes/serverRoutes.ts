export const serverRoutes = {
  auth: {
    register: "/auth/register",
    login: "/auth/login",
    google: "/auth/google",
    googleCallback: "/auth/google/callback",
    facebook: "/auth/facebook",
    facebookCallback: "/auth/facebook/callback",
  },
  product: {
    getAll: "/products",
    getById: (id: string | number) => `/products/${id}`,
  },
};
