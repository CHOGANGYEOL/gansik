"use client";

import { GetGansikResponse } from "@/services/gansik/types";
import { setSearchParams } from "@/utils/common";
import { formatDate } from "@/utils/format";
import { ContentCopy } from "@mui/icons-material";
import {
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from "@mui/material";
import { Suspense, useEffect, useState } from "react";

const CREATED_AT_IDX = 3;

interface GansikTableProps {
  sheetName: string;
}

export function GansikTable({ sheetName }: GansikTableProps) {
  return (
    <Suspense>
      <Content sheetName={sheetName} />
    </Suspense>
  );
}

export function Content({ sheetName }: GansikTableProps) {
  const [data, setData] = useState<GetGansikResponse>({
    headers: [],
    rows: [],
  });

  useEffect(() => {
    const es = new EventSource(`/api/gansik${setSearchParams({ sheetName })}`);

    es.onmessage = (event) => {
      const parsed = JSON.parse(event.data) as {
        sheetName: string;
        data: GetGansikResponse;
      };
      const sortedData = parsed.data.rows.sort(
        (a, b) =>
          new Date(b[CREATED_AT_IDX]).getTime() -
          new Date(a[CREATED_AT_IDX]).getTime()
      );
      setData({ headers: parsed.data.headers, rows: sortedData });
    };

    es.onerror = (e) => {
      console.error("❌ SSE Error:", e);
      es.close();
    };

    return () => {
      es.close();
    };
  }, [sheetName]);

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650, width: "100%" }} aria-label="gansik table">
        <TableHead>
          <TableRow>
            {data.headers.map((header, idx) => (
              <TableCell key={`header-${idx}`}>{header}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.rows.map((row, idx) => (
            <TableRow
              key={`data-row-${idx}`}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              {row.map((d, i) => {
                const value = isISOString(d) ? formatDate(new Date(d)) : d;
                if (isUrl(value)) {
                  return (
                    <CopyableCell
                      key={`data-row-${idx}-cell-${i}`}
                      value={value}
                    />
                  );
                }
                return (
                  <TableCell
                    key={`data-row-${idx}-cell-${i}`}
                    sx={{
                      maxWidth: 200,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {value}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
function isISOString(val: string): val is string {
  return (
    typeof val === "string" &&
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/.test(val)
  );
}

function isUrl(val: string): val is string {
  return typeof val === "string" && /^https?:\/\//.test(val);
}

function CopyableCell({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  return (
    <TableCell
      sx={{
        position: "relative",
        maxWidth: 250,
        paddingRight: 4,
      }}
    >
      <span
        style={{
          display: "inline-block",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          maxWidth: "100%",
        }}
      >
        {value}
      </span>
      <Tooltip title={copied ? "복사 성공" : "복사"}>
        <IconButton
          onClick={handleCopy}
          size="small"
          sx={{
            position: "absolute",
            top: "50%",
            right: 8,
            transform: "translateY(-50%)",
            padding: "2px",
          }}
        >
          <ContentCopy fontSize="inherit" />
        </IconButton>
      </Tooltip>
    </TableCell>
  );
}
