export const cookieConfig = {
  access: {
    maxAge: 5000,
    httpOnly: true,
  },
  refresh: {
    maxAge: 7 * 60 * 60 * 1000, 
    httpOnly: true,
  },
};