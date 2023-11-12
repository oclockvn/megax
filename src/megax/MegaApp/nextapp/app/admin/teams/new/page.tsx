"use client";

import React, { useEffect, useReducer, useRef } from "react";

import { usePathname } from "next/navigation";
import Link from "next/link";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Breadcrumbs from "@mui/material/Breadcrumbs";
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
import FormControlLabel from "@mui/material/FormControlLabel";
import RemoveIcon from "@mui/icons-material/Remove";
import UserSelector from "@/components/common/UserSelector";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getTeam, updateTeam } from "@/lib/apis/team.api";
import { Team, TeamMember } from "@/lib/models/team.model";
import { User } from "@/lib/models/user.model";
import { uniqBy } from "@/lib/helpers/array";
import toast from "react-hot-toast";
import { getInitial } from "@/lib/string.helper";

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
    default:
      return {
        ...state,
      };
  }
}

export default function TeamDetailPage({ params }: { params: { id: number } }) {
  const initState: TeamDetailState = {
    members: [],
    loading: false,
    error: undefined,
  };

  const [state, dispatch] = useReducer(teamDetailReducer, initState);

  const pathname = usePathname();
  const membersRef = useRef<TeamMember[]>([]);

  const {
    // isLoading,
    status,
    data: current,
  } = useQuery({
    queryKey: ["get-team", params.id],
    queryFn: () => getTeam(params.id),
  });

  const saveTeam = useMutation({
    mutationFn: (team: Partial<Team>) => {
      return updateTeam({
        id: params.id,
        name: team.name!,
        members: team.members || [],
      });
    },
  });

  useEffect(() => {
    if (status === "success") {
      dispatch({
        type: "set",
        payload: { error: undefined, members: current?.members },
      });
    }
  }, [current, status]);

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
  };

  const handleSave = async (team: Team) => {
    const result = await saveTeam.mutateAsync({
      ...team,
      members: membersRef.current,
    });
    if (result.success) {
      toast.success(`Team saved successfully`);
    } else {
      dispatch({
        type: "set",
        payload: { error: `Something went wrong. Error code: ${result.code}` },
      });
    }
  };

  return (
    <>
      <div role="presentation" className="bg-blue-200 py-2 px-6">
        <Breadcrumbs aria-label="breadcrumb">
          <Link
            color="inherit"
            href={`${pathname}/..`}
            className="text-blue-500 flex items-center"
          >
            <ArrowBackIcon className="mr-2" />
            Teams
          </Link>
          <div>{current?.name || "..."}</div>
        </Breadcrumbs>
      </div>

      <div className="container mx-auto py-4">
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

              <div className="mt-4">
                <UserSelector onOk={onSelectedMember} />
              </div>

              <List
                className="border border-gray-200 rounded mt-4 overflow-hidden"
                subheader={<ListSubheader>Members</ListSubheader>}
              >
                {state.members.map(mem => (
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
                <Alert
                  severity="error"
                  children={state.error}
                  className="mt-4"
                />
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
      </div>
    </>
  );
}
