"use client";

import React, { useReducer } from "react";

import Button from "@mui/material/Button";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";

import { Device } from "@/lib/models/device.model";
import { UserDeviceRecord } from "@/lib/models/user.model";
import { useMutation } from "@tanstack/react-query";
import { assignDevice } from "@/lib/apis/user.api";

type UserDeviceAddProps = {
  userId: number;
  devices?: Device[];
  onAdded: (d: UserDeviceRecord) => void;
  onCancel: () => void;
};

type UserDeviceFormState = {
  device: Device | null;
  error: string | null;
};

type Action = {
  type: "set";
  payload: Partial<UserDeviceFormState>;
};

function reducer(state: UserDeviceFormState, action: Action) {
  const { type, payload } = action;

  switch (type) {
    case "set":
      return {
        ...state,
        ...payload,
      } as UserDeviceFormState;
  }
}

export default function UserDeviceListForm({
  userId,
  devices,
  onAdded,
  onCancel,
}: UserDeviceAddProps) {
  const [state, dispatch] = useReducer(reducer, {
    device: null,
    error: null,
  });

  const assignDeviceMutation = useMutation({
    mutationFn: (deviceId: number) => assignDevice(userId, deviceId),
  });

  const handleAssignDevice = async () => {
    const result = await assignDeviceMutation.mutateAsync(
      Number(state.device?.id)
    );

    if (result.success && result?.data) {
      onAdded(result.data);
      dispatch({
        type: "set",
        payload: {
          device: null,
          error: null,
        },
      });
    } else {
      dispatch({
        type: "set",
        payload: {
          error: `Could not add device. Error code: ${result.code}`,
        },
      });
    }
  };

  const error = state.error;
  const device = state.device;

  return (
    <div className="p-4 bg-slate-100">
      {error && (
        <div className="mb-5">
          <Alert
            severity="error"
            className="border-red-500 border-solid border"
            onClose={() => dispatch({ type: "set", payload: { error: null } })}
          >
            {error}
          </Alert>
        </div>
      )}

      <div>
        <Autocomplete
          value={device}
          onChange={(_, d) => dispatch({ type: "set", payload: { device: d } })}
          autoComplete
          options={devices || []}
          renderInput={params => <TextField {...params} label="Device" />}
          renderOption={(attrs, o) => (
            <li {...attrs} key={o.id}>
              {o.name} - {o.serialNumber ? o.serialNumber : "N/A"}
            </li>
          )}
          getOptionLabel={o => `${o.name} - ${o.serialNumber}`}
        />
      </div>

      <div className="mt-2 flex gap-2">
        <Button
          variant="text"
          className="flex-1"
          type="button"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          disabled={!device || !device.id}
          type="button"
          variant="contained"
          onClick={handleAssignDevice}
        >
          Add
        </Button>
      </div>
    </div>
  );
}
