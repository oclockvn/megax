import jwt_decode from "jwt-decode";
import storage from "../storage";

export default function useAuth() {
  const token = storage.get('token');
  if (token) {
    const jwt = jwt_decode<Record<string, any>>(token);
    console.log(jwt, { expired: expired(Number(jwt["exp"]))});
    if (jwt && typeof jwt === "object") {
      if (!expired(Number(jwt["exp"]))) {
        const name =
          jwt["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
        return [true, name];
      }
    }
  }

  return [false, null];
}

const expired = (exp: number) => Date.now() >= exp * 1000;
