import * as yup from "yup";

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
  code: yup.string().nullable().default(null),
  email: yup.string().required(),
  fullName: yup.string().required(),
  nickname: yup.string().nullable().default(null),
  phone: yup.string().nullable().default(null),
  address: yup.string().nullable().default(null),
  permanentResidence: yup.string().nullable().default(null),
  dob: yup.date().required(), // Date | string | null;
  identityNumber: yup.string().label('Identity').required(),
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
  contractStart: yup.date().required().label('Contract start'),
  contractEnd: yup
    .date()
    .label('Contract end')
    .required()
    .min(
      yup.ref("contractStart"),
      "Contract end must be greater than contract start"
    ),
  contractType: yup
    .string()
    .oneOf(["official", "contractor", "fresher"])
    .required()
    .default("official"),
  teamId: yup.number().nullable().default(null),
});

export type User = yup.InferType<typeof userSchema>;

// export interface User {
//   id: number;
//   code: string;
//   email: string;
//   fullName: string;
//   nickname: string;
//   phone: string;
//   address: string;
//   permanentResidence: string;
//   dob: Date;
//   identityNumber: string;
//   role: string;
//   workingType: 'remote' | 'office' | 'hybrid'
//   gender: 'male' | 'female' | 'secret';
//   personalEmail: string;
//   hometown: string;
//   birthPlace: string;
//   nation: string;
//   religion: string;
//   taxNumber: string;
//   insuranceNumber: string;
//   married: boolean;
//   academicLevel: string;
//   university: string;
//   major: string;
//   vehicleType: string;// bike|motobike|automobike
//   vehicleBrand: string;
//   vehicleColor: string;
//   vehiclePlateNumber: string;
//   bankAccountNumber: string;
//   bankBranch: string;
//   bankId: number | null;
//   // bank: Bank;
//   contractStart: Date;
//   contractEnd: Date | null;
//   contractType: 'official'|'contractor'|'fresher'
//   teamId: number | null;
//   // team: Team;
//   // accounts: Account[];
//   // documents: UserDocument[];
//   // contacts: Contact[];
//   // createdAt: Date | string;
//   // createdBy: number | null;
// }
