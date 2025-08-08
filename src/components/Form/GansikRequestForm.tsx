"use client";

import { useFormFields } from "@/hooks/useFormFields";
import services from "@/services";
import { usePostGansik } from "@/services/gansik/queries";
import { RULES } from "@/utils/rule";
import { Button, Stack, TextField } from "@mui/material";
import React from "react";
import { toast } from "react-toastify";

type FormData = Omit<
  Parameters<typeof services.gansik.postGansik>[0],
  "sheetName"
>;
export function GansikRequestForm({ sheetName }: { sheetName: string }) {
  const { values, onChange, dispatch, onBlur, validateAll, refs, errors } =
    useFormFields<FormData, { link: HTMLDivElement; name: HTMLDivElement }>(
      {
        link: "",
        name: "",
      },
      {
        validators: {
          link: [RULES.required],
          name: [RULES.required],
        },
      }
    );
  const { mutateAsync, isPending } = usePostGansik();
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (!validateAll()) return;
      await mutateAsync({ ...values, sheetName });
      toast.success("간식 제출 성공");
      dispatch("RESET");
    } catch (err) {
      toast.error(`간식 제출 실패 ${err instanceof Error ? err.message : err}`);
    }
  };
  return (
    <Stack component={"form"} direction={"row"} gap={2} onSubmit={onSubmit}>
      <TextField
        ref={refs.name}
        sx={{ flex: 1 }}
        id="name"
        name="name"
        label="간식명"
        variant="filled"
        size="small"
        value={values.name}
        disabled={isPending}
        onChange={onChange}
        onBlur={onBlur}
        error={!!errors.name}
        helperText={errors.name}
      />
      <TextField
        ref={refs.link}
        sx={{ flex: 1 }}
        id="link"
        name="link"
        label="url"
        variant="filled"
        size="small"
        value={values.link}
        disabled={isPending}
        onChange={onChange}
        onBlur={onBlur}
        error={!!errors.link}
        helperText={errors.link}
      />
      <Button type="submit" variant="contained" disabled={isPending}>
        제출
      </Button>
    </Stack>
  );
}
