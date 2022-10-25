import {
  Pagination,
  Stack,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { apiCall } from "../Utils/APIConnector";
import ResultItem from "./ResultItem";

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [actResults, setActResults] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalResults, setTotalResults] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [lastSearched, setLastSearched] = useState("");

  useEffect(() => {
    setIsLoaded(false);

    const q = searchParams.get("q");
    if (q !== lastSearched) {
      setTotalResults(0);
      setLastSearched(q);
    }

    apiCall(`/api/data/search/?${searchParams.toString()}`, "GET").then(
      (result) => {
        if (result.ok) {
          setActResults(result.data.results);
          setTotalPages(result.data.total_pages);
          setTotalResults(result.data.total_results);
          setIsLoaded(true);
        }
      }
    );
  }, [searchParams]);

  const handlePageChange = (event, value) => {
    window.scroll({ top: 0, left: 0, behavior: "smooth" });
    searchParams.delete("page");
    searchParams.append("page", value);
    setSearchParams(searchParams);
  };

  if (isLoaded) {
    return (
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
              count={totalPages}
              page={parseInt(searchParams.get("page"), 10)}
              onChange={handlePageChange}
            />
          )}
        </Box>
      </Stack>
    );
  }
  return (
    <div>
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
