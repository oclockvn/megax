"use client";

import React, { useEffect, useReducer, useRef } from "react";

import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import CardActions from "@mui/material/CardActions";
import { FormContainer, TextFieldElement, useForm } from "react-hook-form-mui";
import List from "@mui/material/List";
import ListSubheader from "@mui/material/ListSubheader";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import CheckIcon from "@mui/icons-material/Check";
import AddIcon from "@mui/icons-material/Add";
import FormControlLabel from "@mui/material/FormControlLabel";
import RemoveIcon from "@mui/icons-material/Remove";
import CloseIcon from "@mui/icons-material/Close";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import UserSelector from "@/components/common/UserSelector";
import { useMutation } from "@tanstack/react-query";
import { updateTeam } from "@/lib/apis/team.api";
import { Team, TeamMember } from "@/lib/models/team.model";
import { User } from "@/lib/models/user.model";
import { uniqBy } from "@/lib/helpers/array";
import toast from "react-hot-toast";
import { getInitial } from "@/lib/string.helper";
import {
  usePopupState,
  bindTrigger,
  bindDialog,
} from "material-ui-popup-state/hooks";
import IconButton from "@mui/material/IconButton";

type TeamDetailState = {
  members: TeamMember[];
  loading?: boolean;
  error?: string;
};

type TeamDetailAction =
  | {
      type: "set";
      payload: Partial<TeamDetailState>;
    }
  | {
      type: "toggleLeader";
      payload: number[];
    }
  | {
      type: "addMember";
      payload: TeamMember[];
    }
  | {
      type: "removeMember";
      payload: number;
    };

function teamDetailReducer(state: TeamDetailState, action: TeamDetailAction) {
  const { type, payload } = action;
  switch (type) {
    case "set":
      return {
        ...state,
        ...payload,
      };
    case "toggleLeader":
      return {
        ...state,
        members: state.members.map(m => ({
          ...m,
          leader: payload.includes(m.memberId) ? !m.leader : m.leader,
        })),
      };
    case "addMember":
      return {
        ...state,
        members: uniqBy([...payload, ...state.members], "memberId"),
      };
    case "removeMember":
      return {
        ...state,
        members: state.members.filter(m => m.memberId !== payload),
      };
    default:
      return {
        ...state,
      };
  }
}

export default function TeamForm({
  current,
  onSuccess,
}: {
  current?: Team;
  onSuccess?: (team: Team) => void;
}) {
  const initState: TeamDetailState = {
    members: [],
    loading: false,
    error: undefined,
  };

  const [state, dispatch] = useReducer(teamDetailReducer, initState);
  const membersRef = useRef<TeamMember[]>([]);

  const popupState = usePopupState({
    variant: "dialog",
  });

  const saveTeam = useMutation({
    mutationFn: (team: Partial<Team>) => {
      return updateTeam({
        id: current?.id || 0,
        name: team.name!,
        members: team.members || [],
      });
    },
  });

  useEffect(() => {
    dispatch({
      type: "set",
      payload: { error: undefined, members: current?.members },
    });
  }, [current]);

  useEffect(() => {
    membersRef.current = state.members;
  }, [state]);

  const form = useForm({
    values: current,
  });

  const onSelectedMember = (selected: Pick<User, "id" | "fullName">[]) => {
    dispatch({
      type: "addMember",
      payload: selected.map(
        ({ id, fullName }) =>
          ({ memberId: id, memberName: fullName } as TeamMember)
      ),
    });

    popupState.close();
  };

  const handleSave = async (team: Team) => {
    const result = await saveTeam.mutateAsync({
      ...team,
      members: membersRef.current,
    });
    if (result.success) {
      toast.success(`Team saved successfully`);
      onSuccess && onSuccess(result.data);
    } else {
      dispatch({
        type: "set",
        payload: { error: `Something went wrong. Error code: ${result.code}` },
      });
    }
  };

  return (
    <>
      <FormContainer formContext={form} onSuccess={handleSave}>
        <Card className="max-w-[800px] mx-auto">
          <CardHeader title="Team detail" />
          <CardContent>
            <TextFieldElement
              name="name"
              fullWidth
              required
              label="Team name"
            />

            <List
              className={ `border border-gray-200 rounded mt-4 overflow-hidden${!state.members || !state.members.length ? ' !pb-0' : ''}` }
              subheader={
                <ListSubheader>
                  <div className="flex items-center justify-between">
                    <span>Members</span>
                    <Button
                      size="small"
                      variant="contained"
                      startIcon={<AddIcon />}
                      {...bindTrigger(popupState)}
                    >
                      Add members
                    </Button>
                  </div>
                </ListSubheader>
              }
            >
              {state.members?.map(mem => (
                <ListItem
                  key={mem.memberId}
                  className={`border-t border-gray-300${
                    mem.leader ? " bg-fuchsia-100" : ""
                  }`}
                  secondaryAction={
                    <div>
                      <FormControlLabel
                        label="Leader"
                        control={
                          <Checkbox
                            checked={!!mem.leader}
                            icon={<RemoveIcon />}
                            checkedIcon={<CheckIcon />}
                            onChange={() =>
                              dispatch({
                                type: "toggleLeader",
                                payload: [mem.memberId],
                              })
                            }
                          />
                        }
                      />

                      <IconButton
                        color="warning"
                        size="small"
                        onClick={() =>
                          dispatch({
                            type: "removeMember",
                            payload: mem.memberId,
                          })
                        }
                      >
                        <CloseIcon />
                      </IconButton>
                    </div>
                  }
                >
                  <ListItemIcon>
                    <Avatar
                      children={getInitial(mem.memberName!)}
                      sizes={"32px"}
                    />
                  </ListItemIcon>
                  <ListItemText children={mem.memberName} />
                </ListItem>
              ))}
            </List>

            {state.error && (
              <Alert severity="error" children={state.error} className="mt-4" />
            )}
          </CardContent>
          <CardActions className="bg-blue-50">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className="px-8"
            >
              Save
            </Button>
          </CardActions>
        </Card>
      </FormContainer>

      <Dialog
        {...bindDialog(popupState)}
        aria-labelledby="approval-popup"
        aria-describedby="approval-popup"
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle id="approval-popup">{"Are you sure?"}</DialogTitle>
        <DialogContent>
          <UserSelector
            onCancel={() => popupState.close()}
            onOk={onSelectedMember}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
