// import * as yup from "yup";

export interface Contact {
  id: number;
  name: string;
  phone: string;
  email: string;
  address: string;
  dob: Date | string | null;
  relationship: string; //wife|child|relative
  isPrimaryContact: boolean;
  userId: number;
}
