import * as yup from "yup";
import { contactSchema } from "./contact.model";

export interface UserDeviceRecord {
  id: number;
  name: string;
  serialNumber: string;
  deviceType: string;
  takenAt: Date;
  returnedAt?: Date;
}

export const userSchema = yup.object({
  id: yup.number().nullable().default(null),
  accountId: yup.number().nullable().default(null),
  code: yup.string().label('Employee ID').required().default(null),
  email: yup.string().required(),
  fullName: yup.string().label('Full name').required(),
  nickname: yup.string().nullable().default(null),
  phone: yup.string().nullable().default(null),
  address: yup.string().nullable().default(null),
  permanentResidence: yup.string().nullable().default(null),
  dob: yup.date().required(), // Date | string | null;
  identityNumber: yup.string().label("Identity").required(),
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
  personalEmail: yup.string().nullable().default(null),
  hometown: yup.string().nullable().default(null),
  birthPlace: yup.string().nullable().default(null),
  nation: yup.string().nullable().default(null),
  religion: yup.string().nullable().default(null),
  taxNumber: yup.string().nullable().default(null),
  insuranceNumber: yup.string().nullable().default(null),
  married: yup.boolean().default(false),
  academicLevel: yup.string().nullable().default(null),
  university: yup.string().nullable().default(null),
  major: yup.string().nullable().default(null),
  vehicleType: yup.string().nullable().default(null), // bike|motobike|automobike
  vehicleBrand: yup.string().nullable().default(null),
  vehicleColor: yup.string().nullable().default(null),
  vehiclePlateNumber: yup.string().nullable().default(null),
  bankAccountNumber: yup.string().nullable().default(null),
  bankBranch: yup.string().nullable().default(null),
  bankId: yup.number().nullable().default(null),
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
    .label('Contract type')
    .oneOf(["official", "contractor", "fresher"])
    .required()
    .default("official"),
  teamId: yup.number().nullable().default(null),
  contacts: yup.array().of(contactSchema).nullable().default([])
});

export type User = yup.InferType<typeof userSchema>;
