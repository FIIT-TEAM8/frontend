import React, { useEffect, useState } from "react";
import {
  Typography, Stack, Box, ButtonBase
} from "@mui/material";

type Props = {
  numSelectedFilters: number;
  onClick: () => void;
};

export default function AppliedAdvSearchInfo({ numSelectedFilters, onClick }: Props) {
  const [numFilters, setNumFilters] = useState(0);

  useEffect(() => {
    setNumFilters(numSelectedFilters);
  }, [numSelectedFilters]);

  return (
    <Stack alignItems="center" justifyContent="flex-end" direction="row" spacing={1}>
      {numFilters !== 0 && (
        <ButtonBase onClick={onClick}>
          <Stack direction="row" spacing={0.3}>
            <Box
              sx={{
                textAlign: "center",
                borderRadius: "50%",
                width: "0.9rem",
                height: "0.9rem",
                backgroundColor: "primary.main"
              }}
            >
              <Typography fontSize={11} color="white">
                {numSelectedFilters}
              </Typography>
            </Box>
            {numSelectedFilters === 1 ? (
              <Typography color="primary" fontSize={11}>
                applied filter
              </Typography>
            ) : (
              <Typography color="primary" fontSize={11}>
                applied filters
              </Typography>
            )}
          </Stack>
        </ButtonBase>
      )}
    </Stack>
  );
}
