"use client";

import { AddSheetDialog } from "@/components/Dialog";
import { GansikRequestForm } from "@/components/Form/GansikRequestForm";
import { GansikTable } from "@/components/Table/GansikTable";
import {
  useGetGansikSheetNames,
  usePostAddSheet,
} from "@/services/gansik/queries";
import {
  Button,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
} from "@mui/material";
import { useDialogs } from "@toolpad/core";
import React, { useEffect, useState } from "react";

export default function Home() {
  const { data, isSuccess } = useGetGansikSheetNames();
  const [sheetName, setSheetName] = useState<string>("");
  const dialog = useDialogs();

  useEffect(() => {
    if (isSuccess) setSheetName(data[0]);
  }, [data, isSuccess]);

  return (
    <Stack gap={2} mt={6} sx={{ width: "100%" }}>
      <Stack direction={"row"} justifyContent={"space-between"}>
        <Stack direction={"row"} gap={1}>
          <FormControl>
            <InputLabel id="sheet-select">Sheet</InputLabel>
            <Select
              labelId="sheet-select"
              id="sheet-name"
              value={sheetName}
              label="Sheet"
              onChange={(e: SelectChangeEvent) => {
                setSheetName(e.target.value);
              }}
            >
              {isSuccess &&
                data.map((sheet, idx) => (
                  <MenuItem key={`sheet-${idx}`} value={sheet}>
                    {sheet}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
          <Button
            variant="outlined"
            onClick={() => dialog.open(AddSheetDialog)}
          >
            생성
          </Button>
        </Stack>
      </Stack>
      <GansikRequestForm sheetName={sheetName} />
      <Divider />
      <GansikTable sheetName={sheetName} />
    </Stack>
  );
}
