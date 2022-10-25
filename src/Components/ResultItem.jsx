import {
  Box, Divider, Typography, Link, Stack, Grid
} from "@mui/material";
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import ButtonPDF from "./ReportButton";
import { useUser } from "../Utils/UserContext";
import theme from "../Style/Theme";

export default function ResultItem({ item }) {
  const { user } = useUser();

  return (
    <Grid container justifyContent="space-between" alignItems="flex-start">
      <Grid
        item
        xs={user ? 11.5 : 12}
        md={user ? 11.6 : 12}
        lg={user ? 11.7 : 12}
      >
        <Stack spacing={1}>
          <Stack
            direction="row"
            divider={(
              <Divider
                sx={{ borderRightWidth: 0.5 }}
                style={{ background: "#757575" }}
                orientation="vertical"
                flexItem
              />
            )}
            spacing={2}
          >
            <Box>
              <Typography noWrap color="secondary">
                {item.published.slice(5, -13)}
              </Typography>
            </Box>
            <Link
              href={item.link}
              target="_blank"
              rel="noopener"
              underline="none"
              noWrap
            >
              <Typography noWrap color="secondary">
                {new URL(item.link).hostname.replace("www.", "")}
              </Typography>
            </Link>
            <RouterLink to={`/archive?link=${item.link}`}>
              <Typography noWrap color="secondary">
                Archived Article
              </Typography>
            </RouterLink>
          </Stack>
          <Link
            style={{ color: theme.palette.primary.main }}
            href={item.link}
            target="_blank"
            rel="noopener"
            underline="hover"
          >
            <Typography variant="h2">{item.title}</Typography>
          </Link>
          <Stack direction="row" color="secondary" spacing={2}>
            {item.keywords.map((crime) => (
              <Box
                key={crime}
                sx={{
                  pl: 0.7,
                  pr: 0.7,
                  borderRadius: 1.5,
                }}
                bgcolor="#e6e7eb"
              >
                <Typography color="secondary">{crime}</Typography>
              </Box>
            ))}
          </Stack>
        </Stack>
      </Grid>
      {user && (
        <Grid item xs={0.5} md={0.4} lg={0.3} textAlign="end">
          <Stack>
            <ButtonPDF articleId={item._id} articleTitle={item.title} />
          </Stack>
        </Grid>
      )}
    </Grid>
  );
}
