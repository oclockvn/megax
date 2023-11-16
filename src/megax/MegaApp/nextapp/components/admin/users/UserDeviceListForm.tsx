"use client";

import React, { useState } from "react";

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

export default function UserDeviceAdd({
  userId,
  devices,
  onAdded,
  onCancel,
}: UserDeviceAddProps) {
  const [value, setValue] = useState<Device | null>(null);
  let [error, setError] = useState<string | undefined>();

  const assignDeviceMutation = useMutation({
    mutationFn: (deviceId: number) => assignDevice(userId, deviceId),
  });

  const handleAssignDevice = async () => {
    const result = await assignDeviceMutation.mutateAsync(Number(value?.id));

    if (result.success && result?.data) {
      onAdded(result.data);
      setError(undefined);
    } else {
      setError(`Could not add device. Error code: ${result.code}`);
    }
  };

  return (
    <div className="p-4 bg-slate-100">
      {error && (
        <div className="mb-5">
          <Alert
            severity="error"
            className="border-red-500 border-solid border"
            onClose={() => setError(undefined)}
          >
            {error}
          </Alert>
        </div>
      )}

      <div>
        <Autocomplete
          value={value}
          onChange={(_, d) => setValue(d)}
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
        <Button type="button" variant="contained" onClick={handleAssignDevice}>
          Add
        </Button>
      </div>
    </div>
  );
}
