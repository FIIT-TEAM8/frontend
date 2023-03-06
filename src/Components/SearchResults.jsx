import {
  Pagination,
  Stack,
  Box,
  Typography,
  CircularProgress,
  Grid,
  Button
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { apiCall } from "../Utils/APIConnector";
import ResultItem from "./ResultItem";

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [actResults, setActResults] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalResults, setTotalResults] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [lastSearched, setLastSearched] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoaded(false);

    const q = searchParams.get("q");
    if (q !== lastSearched) {
      setTotalResults(0);
      setLastSearched(q);
    }

    const ids = searchParams.get("ids");
    const query = searchParams.get("q");

    // if there are ids, then show results based on given ids
    if (ids) {
      searchParams.delete("q");

      apiCall(window._env_.REACT_APP_STATS_SERVER, `/api/selected?${searchParams.toString()}`, "GET").then(
        (result) => {
          if (result.ok) {
            setActResults(result.data.results);
            setTotalPages(result.data.total_pages);
            setTotalResults(result.data.total_results);
            setIsLoaded(true);
          }
        }
      );
      searchParams.append("q", query);
    } else {
      apiCall(window._env_.REACT_APP_FLASK_DATA_URL, `/api/${window._env_.REACT_APP_FLASK_DATA_API_VERSION}/search?${searchParams.toString()}`, "GET").then(
        (result) => {
          if (result.ok) {
            setActResults(result.data.results);
            setTotalPages(result.data.total_pages);
            setTotalResults(result.data.total_results);
            setIsLoaded(true);
          }
        }
      );
    }
  }, [searchParams]);

  const handlePageChange = (event, value) => {
    window.scroll({ top: 0, left: 0, behavior: "smooth" });
    searchParams.delete("page");
    searchParams.append("page", value);
    setSearchParams(searchParams);
  };

  const showStatistics = () => {
    searchParams.delete("ids");
    searchParams.delete("page");
    navigate(`/stats?${searchParams.toString()}`);
  };

  if (isLoaded) {
    return (
      <div>
        <Grid item container justifyContent="center" spacing={0} marginTop={3} marginBottom={3} columns={16}>
          <Grid item xs={8}>
            <Button
              size="large"
              color="secondary"
              variant="text"
              onClick={showStatistics}
              sx={{
                borderRadius: "0",
                width: "100%"
              }}
              style={{ backgroundColor: "rgb(240, 245, 247)" }}
            >
              statistics
            </Button>
          </Grid>

          <Grid item xs={8}>
            <Button
              size="large"
              color="info"
              variant="text"
              sx={{
                borderLeft: "1px solid",
                borderRadius: "0",
                width: "100%"
              }}
              style={{ backgroundColor: "rgb(38, 166, 154)" }}
            >
              articles
            </Button>
          </Grid>
        </Grid>
        <Stack sx={{ pt: 2 }}>
          {totalResults === 1 ? (
            <Typography color="secondary">
              {totalResults}
              {" "}
              result found.
            </Typography>
          ) : (
            <Typography color="secondary">
              {totalResults}
              {" "}
              results found.
            </Typography>
          )}
          <Stack spacing={6} sx={{ pt: 4 }}>
            {actResults.map((result) => (
              <ResultItem item={result} key={result.title} />
            ))}
          </Stack>
          <Box my={2} display="flex" justifyContent="center">
            {totalPages > 1 && (
            <Pagination
              size="small"
              count={totalPages}
              page={parseInt(searchParams.get("page"), 10)}
              onChange={handlePageChange}
            />
            )}
          </Box>
        </Stack>
      </div>
    );
  }
  return (
    <div>
      <Grid item container justifyContent="center" spacing={0} marginTop={3} marginBottom={3} columns={16}>
        <Grid item xs={8}>
          <Button
            size="large"
            color="secondary"
            variant="text"
            onClick={showStatistics}
            sx={{
              borderRadius: "0",
              width: "100%"
            }}
            style={{ backgroundColor: "rgb(240, 245, 247)" }}
          >
            statistics
          </Button>
        </Grid>

        <Grid item xs={8}>
          <Button
            size="large"
            color="info"
            variant="text"
            sx={{
              borderLeft: "1px solid",
              borderRadius: "0",
              width: "100%"
            }}
            style={{ backgroundColor: "rgb(38, 166, 154)" }}
          >
            articles
          </Button>
        </Grid>
      </Grid>
      {totalResults === 0 ? (
        <div style={{ paddingTop: "2" }} />
      ) : (
        <Typography pt={2} color="secondary">
          {totalResults}
          {" "}
          results found.
        </Typography>
      )}
      <Stack spacing={1} sx={{ pt: 2 }} alignItems="center">
        <CircularProgress size={50} thickness={2} color="secondary" />
      </Stack>
    </div>
  );
}
