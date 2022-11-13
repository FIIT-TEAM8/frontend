import {
  Button, Grid, IconButton, TextField, InputAdornment, Typography
} from "@mui/material";
import { Search } from "@mui/icons-material";
import {
  Outlet, useNavigate, useSearchParams, Link
} from "react-router-dom";
import React, { useEffect, useState } from "react";
import useWindowSize from "../Utils/Screen";
import Handler from "./AdvancedSearch/Handler";
import AppliedFilters from "./AdvancedSearch/AppliedFilters";

export default function TitleSearch() {
  const navigate = useNavigate();
  const { width } = useWindowSize();
  const shouldCollapse = width < 992;

  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [showingResults, setShowingResults] = useState(false);
  const [shouldSubmitSearchParams, setShouldSubmitSearchParams] = useState(true);

  // states for advanced search
  const [advancedSearchOpen, setAdvancedSearchOpen] = useState(false);
  const [numSelectedFilters, setNumSelectedFilters] = useState(0);

  const searchDivStyle = {
    margin: "auto",
    padding: shouldCollapse ? "100px 7%" : "100px 20%"
  };

  if (showingResults) {
    searchDivStyle.padding = shouldCollapse ? "20px 7%" : "20px 20%";
  }

  const SearchFieldInputProps = {
    endAdornment: !advancedSearchOpen ? (
      <InputAdornment position="end">
        <IconButton color="primary" type="submit">
          <Search />
        </IconButton>
      </InputAdornment>
    ) : undefined
  };

  useEffect(() => {
    const q = searchParams.get("q");
    setSearchTerm(q);

    if (q) {
      setShowingResults(true);
    }
  }, []);

  // check if we should change actual state to main page state
  // handling when click on logo
  useEffect(() => {
    const q = searchParams.get("q");
    if (!q) {
      setShowingResults(false);
      setSearchTerm("");
    }
  }, [searchParams]);

  useEffect(() => {
    if (searchTerm === "" && advancedSearchOpen) {
      setShouldSubmitSearchParams(false);
    } else {
      setShouldSubmitSearchParams(true);
    }
  }, [searchTerm, advancedSearchOpen]);

  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  const submitSearchParams = () => {
    if (searchTerm === "" && advancedSearchOpen) {
      setShouldSubmitSearchParams(false);
      return;
    }
    searchParams.delete("q");
    searchParams.delete("page");

    searchParams.append("q", searchTerm);
    searchParams.append("page", 1);

    setShowingResults(true);
    setSearchParams(searchParams);
    setAdvancedSearchOpen(false);
    navigate(`results?${searchParams.toString()}`);
  };

  const updateNumSelectedFilters = (num) => {
    setNumSelectedFilters(num);
  };

  const onAdvancedSearchCancel = () => {
    // adv search handler should be notified
    // isCanceled - true
  };

  const onAdvancedSearchHide = () => {
    setAdvancedSearchOpen(false);
  };

  const onSubmit = (event) => {
    event.preventDefault();

    // onAdvancedSearchHide();
    // adv search handler should be notified
    // isApplied - true
    submitSearchParams();
  };

  return (
    <Grid style={searchDivStyle} direction="column">
      <Grid container spacing={2} direction="column">
        <Grid container direction="column" alignItems="center" justifyContent="center">
          <Grid item>
            <Link to="/search" onClick={onAdvancedSearchCancel} style={{ textDecoration: "none" }}>
              <img src="/adversea_logo.svg" alt="adversea" />
            </Link>
          </Grid>
          <Grid item>
            <Typography color="secondary">
              your adverse media screening portal.
              {" "}
              <Link to="/about">learn more</Link>
              .
            </Typography>
          </Grid>
        </Grid>
        <Grid item>
          <form onSubmit={onSubmit}>
            <TextField
              id="outlined-search"
              color="secondary"
              value={searchTerm}
              label="search"
              autoComplete="off"
              variant="outlined"
              onChange={(event) => handleSearchChange(event.target.value)}
              fullWidth
              InputProps={SearchFieldInputProps}
            />
          </form>
        </Grid>
      </Grid>
      <Grid item container direction="row">
        {!shouldSubmitSearchParams && (
          <Grid item>
            <Typography color="error">search field cannot be empty</Typography>
          </Grid>
        )}

        {!advancedSearchOpen && (
          <Grid container justifyContent="flex-end" spacing={1} alignItems="center">
            <Grid item>
              <AppliedFilters
                numSelectedFilters={numSelectedFilters}
                onClick={() => setAdvancedSearchOpen(true)}
              />
            </Grid>
            <Grid item>
              <Button
                color="secondary"
                variant="text"
                size="small"
                style={{ textDecoration: "underline" }}
                onClick={() => setAdvancedSearchOpen(true)}
              >
                Advanced search
              </Button>
            </Grid>
          </Grid>
        )}
      </Grid>

      <Grid item>
        <Handler
          open={advancedSearchOpen}
          submitAllowed={shouldSubmitSearchParams}
          onFilterSelect={updateNumSelectedFilters}
          apply={submitSearchParams}
          hide={onAdvancedSearchHide}
        />
      </Grid>

      <Grid item>
        <Outlet />
      </Grid>
    </Grid>
  );
}
