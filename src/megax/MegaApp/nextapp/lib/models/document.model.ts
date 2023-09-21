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

export const documentSchema = yup.object({
  id: yup.number().nullable().default(0),
  documentType: yup.string().label("Document type").required(), // CMND|CCCD
  issueDate: yup.date().label("Issue date").nullable().default(null),
  documentNumber: yup.string().label("Document number").required(),
  issuePlace: yup.string().label("Issue place").required(),
  issueBy: yup.string().label("Issued by").required(),
});

/*
{
  "id": 2,
  "fileName": "100000022-invoice-2022-07-01.pdf",
  "url": "http://localhost:5291/users/2306/documents/100000022-invoice-2022-07-01.pdf",
  "fileSize": 602092,
  "refId": "3"
}
*/
export interface FileReference {
  id: number;
  fileName: string;
  url: string;
  fileSize: number;
  refId: string;
}

export type Document = yup.InferType<typeof documentSchema> & { fileReferences?: FileReference[] };
