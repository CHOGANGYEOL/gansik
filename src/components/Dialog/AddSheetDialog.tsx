"use client";
import { useFormFields } from "@/hooks/useFormFields";
import { GANSIK_KEYS, usePostAddSheet } from "@/services/gansik/queries";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useQueryClient } from "@tanstack/react-query";
import { DialogProps } from "@toolpad/core";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { toast } from "react-toastify";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import dayjs from "dayjs";
import { CommonResponse } from "@/services/types";

export function AddSheetDialog({ open, onClose }: DialogProps) {
  const { mutateAsync, isPending } = usePostAddSheet();
  const queryClient = useQueryClient();
  const { values, dispatch } = useFormFields<Parameters<typeof mutateAsync>[0]>(
    { sheetName: dayjs(new Date()).format("YYYY-MM-DD") }
  );

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await mutateAsync(values);
      const { message } = (await res.json()) as CommonResponse;

      if (!res.ok) throw new Error(message);
      await queryClient.refetchQueries({
        queryKey: GANSIK_KEYS.getGansikSheetNames(),
      });
      toast.success("시트 생성 성공");
      await onClose();
    } catch (e) {
      toast.error(`시트 생성 실패 : ${e instanceof Error ? e.message : e}`);
    }
  };

  return (
    <Dialog open={open}>
      <form onSubmit={onSubmit}>
        <DialogTitle>{"Add Sheet"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["DatePicker"]}>
                <DatePicker
                  disabled={isPending}
                  defaultValue={dayjs(values.sheetName)}
                  views={["year", "month", "day"]}
                  onChange={(date) => {
                    if (!date) return;
                    dispatch("SET", { sheetName: date.format("YYYY-MM-DD") });
                  }}
                />
              </DemoContainer>
            </LocalizationProvider>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => onClose?.()} variant="outlined">
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={!values.sheetName || isPending}
          >
            Add
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
