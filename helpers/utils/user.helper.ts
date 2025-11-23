/**
 * Representa un usuario utilizado para registro, login y tests que requieren autenticación.
 */
export type AEUser = {
  name: string;
  email: string;
  password: string;
  day: string;
  month: string;
  year: string;
  firstName: string;
  lastName: string;
  address: string;
  country: string;
  state: string;
  city: string;
  zipCode: string;
  mobileNumber: string;
};

/**
 * Genera un usuario dinámico basado en un nombre y timestamp.
 */
export function makeUser(username: string): AEUser {
  const timestamp = Date.now();
  return {
    name: `${username}_${timestamp}`,
    email: `${username}_${timestamp}@pw.com`,
    password: "12345678",
    day: "13",
    month: "11",
    year: "2000",
    firstName: `${username}`,
    lastName: "N.A.",
    address: "N.A.",
    country: "United States",
    state: "QC",
    city: "N.A.",
    zipCode: "N.A",
    mobileNumber: "123456",
  };
}

/**
 * Devuelve solo las credenciales necesarias para flujos de autenticación.
 */
export function getAuth(user: AEUser) {
  return {
    email: user.email,
    password: user.password,
    name: user.name
  };
}
