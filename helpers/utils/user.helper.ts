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

export function getAuth(user: AEUser) {
  return {
    email: user.email,
    password: user.password,
  };
}
