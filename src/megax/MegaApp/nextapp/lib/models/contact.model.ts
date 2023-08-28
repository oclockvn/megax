import * as yup from "yup";

// export interface Contact {
//   id: number;
//   name: string;
//   phone: string;
//   email: string;
//   address: string;
//   dob: Date | string | null;
//   relationship: string; //wife|child|relative
//   isPrimaryContact: boolean;
//   userId: number;
// }

export const contactSchema = yup.object({
  id: yup.number().nullable().default(0),
  userId: yup.number().nullable().default(null),
  name: yup.string().required(),
  phone: yup.string().nullable().default(null),
  email: yup.string().nullable().default(null),
  address: yup.string().nullable().default(null),
  dob: yup.string().nullable().default(null),
  relationship: yup.string().nullable().default(null),
  isPrimaryContact: yup.boolean().default(false),
});

export type Contact = yup.InferType<typeof contactSchema>;
