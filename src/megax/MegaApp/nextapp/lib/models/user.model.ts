import * as yup from "yup";
import { contactSchema } from "./contact.model";
import { documentSchema } from "./document.model";

export interface UserDeviceRecord {
  id: number;
  name: string;
  serialNumber: string;
  deviceType: string;
  takenAt: Date;
  returnedAt?: Date;
}

export type UserCard = {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  totalAnnual: number;
  takenAnnual: number;
  takenPaidLeave: number;
};

export const userSchema = yup.object({
  id: yup.number().nullable().default(null),
  accountId: yup.number().nullable().default(null),
  code: yup.string().label("Employee ID").required().default(null).max(100),
  email: yup.string().required().max(100),
  fullName: yup.string().label("Full name").required().max(100),
  title: yup.string().label("Title").max(100).nullable().default(null),
  nickname: yup.string().nullable().default(null).max(100),
  phone: yup.string().nullable().default(null).max(100),
  address: yup.string().nullable().default(null).max(255),
  permanentResidence: yup.string().nullable().default(null).max(255),
  dob: yup.date().required(), // Date | string | null;
  identityNumber: yup.string().label("Identity").required().max(255),
  role: yup.string().nullable().default(null),
  workingType: yup
    .string()
    .oneOf(["remote", "office", "hybrid"])
    .nullable()
    .default(null)
    .default("office"),
  gender: yup
    .string()
    .oneOf(["male", "female", "secret"])
    .nullable()
    .default(null)
    .default("male"),
  personalEmail: yup.string().nullable().default(null).max(255),
  hometown: yup.string().nullable().default(null).max(255),
  birthPlace: yup.string().nullable().default(null).max(255),
  nation: yup.string().nullable().default(null).max(255),
  religion: yup.string().nullable().default(null).max(255),
  taxNumber: yup.string().nullable().default(null).max(255),
  insuranceNumber: yup.string().nullable().default(null).max(255),
  married: yup.boolean().default(false),
  academicLevel: yup.string().nullable().default(null).max(255),
  university: yup.string().nullable().default(null).max(255),
  major: yup.string().nullable().default(null).max(255),
  vehicleType: yup.string().nullable().default(null).max(255), // bike|motobike|automobike
  vehicleBrand: yup.string().nullable().default(null).max(255),
  vehicleColor: yup.string().nullable().default(null).max(255),
  vehiclePlateNumber: yup.string().nullable().default(null).max(255),
  bankAccountNumber: yup.string().nullable().default(null).max(255),
  bankBranch: yup.string().nullable().default(null).max(255),
  bankId: yup.number().nullable().default(null).max(255),
  contractStart: yup.date().required().label("Contract start"),
  contractEnd: yup
    .date()
    .label("Contract end")
    .required()
    .min(
      yup.ref("contractStart"),
      "Contract end must be greater than contract start"
    ),
  contractType: yup
    .string()
    .label("Contract type")
    .oneOf(["official", "contractor", "fresher"])
    .required()
    .default("official"),
  teamId: yup.number().nullable().default(null),
  contacts: yup.array().of(contactSchema).nullable().default([]),
  documents: yup.array().of(documentSchema).nullable().default([]),
});

export type User = yup.InferType<typeof userSchema>;
