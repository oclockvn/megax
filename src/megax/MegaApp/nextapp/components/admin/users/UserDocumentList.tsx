"use client";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import Drawer from "@mui/material/Drawer";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import { useConfirm } from "material-ui-confirm";
import { Document as UserDocument } from "@/lib/models/document.model";
import { useContext, useReducer } from "react";
import Button from "@mui/material/Button";
import UserDocumentForm from "./UserDocumentForm";
import { toast } from "react-hot-toast";
import datetime from "@/lib/datetime";
import { UserContext } from "@/components/contexts/UserContext";
import { useMutation } from "@tanstack/react-query";
import { deleteDocument } from "@/lib/apis/user.api";
import { MagicMotion } from "react-magic-motion";

type UserDocumentListState = {
  loading: boolean;
  showDrawer: boolean;
  document?: Partial<UserDocument>;
  error?: string;
};

type Action = {
  type: "patch";
  payload: Partial<UserDocumentListState>;
};

function userDocumentListReducer(state: UserDocumentListState, action: Action) {
  const { type, payload } = action;
  switch (type) {
    case "patch":
      return {
        ...state,
        ...payload,
      } as UserDocumentListState;
  }
}

export default function UserDocumentList() {
  const confirmation = useConfirm();
  const [state, dispatch] = useReducer(userDocumentListReducer, {
    loading: false,
    showDrawer: false,
    document: undefined,
  } as UserDocumentListState);

  const { user, updateUser } = useContext(UserContext);
  const { document, loading, showDrawer } = state;
  const documents = user?.documents || [];

  const deleteHandler = useMutation({
    mutationFn: (id: number) => deleteDocument(user?.id!, id),
    onSuccess: (result, id) => {
      result.success
        ? toast.success("Document deleted successfully")
        : toast.error(`Something went wrong but I'm too lazy to check`);

      if (result.success) {
        updateUser?.({
          documents: user?.documents?.filter(d => d.id !== id) || [],
        });
      }
    },
  });

  const handleDeleteDocument = (document: UserDocument) => {
    confirmation({
      title: "Are you sure?",
      description: `Document# ${document.documentNumber} is about to be deleted?`,
      dialogProps: {
        maxWidth: "xs",
      },
    }).then(() => deleteHandler.mutateAsync(document!.id!));
  };

  const handleOpenDocument = (
    document: Partial<UserDocument> | undefined = undefined
  ) => {
    dispatch({
      type: "patch",
      payload: {
        document: document,
        showDrawer: document != null,
        loading: false,
      },
    });
  };

  const onFormClose = (doc?: Partial<UserDocument>) => {
    handleOpenDocument();
    if (!doc) {
      return;
    }

    let documents = user?.documents || [];
    let index = documents.findIndex(d => d.id === doc?.id);
    if (index < 0) {
      // new doc
      documents.unshift(doc as UserDocument);
    } else {
      // update
      documents.splice(index, 1, doc as UserDocument);
    }

    updateUser?.({ documents });
  };

  const RenderRow = (document: UserDocument) => (
    <TableRow
      key={document.id}
      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
    >
      <TableCell scope="row">
        <Button
          variant="text"
          size="small"
          className="!rounded-2xl py-1 px-4 !min-w-[auto]"
          onClick={() => handleOpenDocument(document)}
        >
          {`${document.documentType}${
            document.documentNumber ? `: ${document.documentNumber}` :''
          }`}
        </Button>
      </TableCell>
      <TableCell>
        {document.issueDate &&
          datetime.formatDate(document.issueDate, "dd/MM/yyyy")}
      </TableCell>
      <TableCell align="right">
        <IconButton
          size="small"
          color="error"
          onClick={() => handleDeleteDocument(document)}
        >
          <CloseIcon fontSize="inherit" />
        </IconButton>
      </TableCell>
    </TableRow>
  );

  return (
    <>
      <MagicMotion>
        <div>
          <TableContainer component={Paper} key="exclude">
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Document</TableCell>
                  <TableCell>Issue Date</TableCell>
                  <TableCell align="right" width={100}>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => handleOpenDocument({})}
                    >
                      <AddIcon fontSize="inherit" className="me-2" />
                      Add
                    </Button>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {documents.map(document => (
                  <RenderRow key={document.id} {...document} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </MagicMotion>

      <Drawer
        anchor="right"
        open={showDrawer}
        onClose={() => handleOpenDocument()}
      >
        {document && (
          <UserDocumentForm
            userId={user?.id || 0}
            document={document!}
            handleClose={onFormClose}
          />
        )}
      </Drawer>
    </>
  );
}
