import {
  Collapse,
  IconButton,
  TextField,
  Typography,
  InputAdornment,
  Stack,
  Button,
  Box,
  ButtonBase,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import {
  Outlet, useNavigate, useSearchParams, Link
} from "react-router-dom";
import React, { useEffect, useState } from "react";
import useWindowSize from "../Utils/Screen";
import { apiCall } from "../Utils/APIConnector";
import AdvancedSearch from "./AdvancedSearch";
import { emptyFilters, getYears } from "../Utils/AdvancedSearchUtils";

export default function TitleSearch() {
  const navigate = useNavigate();
  const { width } = useWindowSize();
  const shouldCollapse = width < 992;

  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [showingResults, setShowingResults] = useState(false);

  // states for advanced search
  const [advancedSearchOpen, setAdvancedSearchOpen] = useState(false);
  const [allYears, setAllYears] = useState([]);
  const [allRegions, setAllRegions] = useState([]);
  const [allKeywords, setAllKeywords] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState(emptyFilters);
  const [numSelectedFilters, setNumSelectedFilters] = useState(0);

  const searchDivStyle = {
    margin: "auto",
    padding: shouldCollapse ? "100px 7%" : "100px 20%",
  };

  const logoStyle = {
    margin: "auto",
    marginBottom: "20px",
    display: "block",
    width: "30%",
    height: "auto"
  };

  if (showingResults) {
    searchDivStyle.padding = shouldCollapse ? "20px 7%" : "20px 20%";
  }

  useEffect(() => {
    apiCall("/api/advanced_search/keyword_categories", "GET").then((result) => {
      if (result.ok) {
        setAllKeywords(Object.keys(result.data));
      }
    });

    apiCall("/api/advanced_search/region_mapping", "GET").then((result) => {
      if (result.ok) {
        setAllRegions(result.data);
      }
    });

    setAllYears(getYears(2016, new Date().getFullYear()));

    const q = searchParams.get("q");

    if (q) {
      setShowingResults(true);
      setSearchTerm(q);
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
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const regionCodes = searchParams.get("regions");
    const keywords = searchParams.get("keywords");

    const prevSelectedFilters = { ...selectedFilters };

    const defaultYearFrom = allYears[0];
    const defaultYearTo = allYears[allYears.length - 1];

    // e.g. from="2019-01-01", to="2022-12-31"
    prevSelectedFilters.from.defaultValue = defaultYearFrom;
    prevSelectedFilters.from.value = from ? from.slice(0, 4) : defaultYearFrom;

    prevSelectedFilters.to.defaultValue = defaultYearTo;
    prevSelectedFilters.to.value = to ? to.slice(0, 4) : defaultYearTo;

    // e.g. regionCodes="[sk,us,gb]"
    if (regionCodes) {
      const regionCodesArr = regionCodes.slice(1, -1).split(",");

      // e.g. selectedRegions=['Slovakia', 'United States', 'Great Britan']
      const selectedRegions = regionCodesArr.map((regionCode) => {
        const regionName = Object.keys(allRegions).find(
          (key) => allRegions[key] === regionCode
        );
        return regionName;
      });

      prevSelectedFilters.regions = selectedRegions;
    }
    if (keywords) {
      const keywordsArr = keywords.slice(1, -1).split(",");
      prevSelectedFilters.keywords = keywordsArr;
    }

    setSelectedFilters(prevSelectedFilters);
  }, [allYears, allRegions, allKeywords]);

  // calculate number of selected filters
  useEffect(() => {
    const yearFrom = selectedFilters.from.defaultValue !== selectedFilters.from.value ? 1 : 0;
    const yearTo = selectedFilters.to.defaultValue !== selectedFilters.to.value ? 1 : 0;
    const regions = selectedFilters.regions.length;
    const keywords = selectedFilters.keywords.length;

    setNumSelectedFilters(yearFrom + yearTo + regions + keywords);
  }, [selectedFilters]);

  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  const onYearFromSelect = (yearFrom) => {
    let yearTo = selectedFilters.to.value;
    // disable wrong year range
    if (yearFrom > selectedFilters.to.value) {
      yearTo = yearFrom;
    }
    setSelectedFilters({
      ...selectedFilters,
      from: { ...selectedFilters.from, value: yearFrom },
      to: { ...selectedFilters.to, value: yearTo },
    });
  };

  const onYearToSelect = (yearTo) => {
    setSelectedFilters({
      ...selectedFilters,
      to: { ...selectedFilters.to, value: yearTo },
    });
  };

  const onRegionSelect = (selectedRegions) => {
    setSelectedFilters({ ...selectedFilters, regions: selectedRegions });
  };

  const onKeywordSelect = (selectedKeywords) => {
    setSelectedFilters({ ...selectedFilters, keywords: selectedKeywords });
  };

  const onAdvancedSearchHide = () => {
    setAdvancedSearchOpen(false);
    window.scroll({ top: 0, left: 0, behavior: "smooth" });
  };

  const onAdvancedSearchClear = () => {
    const defaultYearFrom = allYears[0];
    const defaultYearTo = allYears[allYears.length - 1];

    setSelectedFilters({
      ...emptyFilters,
      from: {
        value: defaultYearFrom,
        defaultValue: defaultYearFrom,
      },
      to: {
        value: defaultYearTo,
        defaultValue: defaultYearTo,
      },
    });
  };

  const submitSearchParams = () => {
    searchParams.delete("q");
    searchParams.delete("page");
    for (let i = 0; i < selectedFilters.length; i += 1) {
      const filterName = selectedFilters[i];
      searchParams.delete(filterName);
    }

    searchParams.append("q", searchTerm);
    searchParams.append("page", 1);

    const selectedFrom = selectedFilters.from.value !== selectedFilters.from.defaultValue
      ? selectedFilters.from.value
      : null;
    const selectedTo = selectedFilters.to.value !== selectedFilters.to.defaultValue
      ? selectedFilters.to.value
      : null;

    let selectedRegions = selectedFilters.regions.map(
      (region) => allRegions[region]
    );
    selectedRegions = selectedRegions.length ? selectedRegions : null;

    const selectedKeywords = selectedFilters.keywords.length
      ? selectedFilters.keywords
      : null;

    if (selectedFrom) {
      searchParams.append("from", `${selectedFrom}-01-01`);
    }
    if (selectedTo) {
      searchParams.append("to", `${selectedTo}-12-31`);
    }
    if (selectedRegions) {
      searchParams.append("regions", `[${selectedRegions.join(",")}]`);
    }
    if (selectedKeywords) {
      searchParams.append("keywords", `[${selectedKeywords.join(",")}]`);
    }

    setShowingResults(true);
    setSearchParams(searchParams);
    navigate(`results?${searchParams.toString()}`);
  };

  const onAdvancedSearchApply = () => {
    onAdvancedSearchHide();
    submitSearchParams();
  };

  const onAdvancedSearchCancel = () => {
    for (let i = 0; i < selectedFilters.length; i += 1) {
      const filterName = selectedFilters[i];
      searchParams.delete(filterName);
    }

    setSearchParams(searchParams);

    onAdvancedSearchClear();
    onAdvancedSearchHide();
  };

  const onSubmit = (event) => {
    event.preventDefault();

    onAdvancedSearchHide();
    submitSearchParams();
  };

  return (
    <div style={searchDivStyle}>
      <form onSubmit={onSubmit}>
        <Link
          to="/search"
          onClick={onAdvancedSearchCancel}
          style={{ textDecoration: "none" }}
        >
          {/* <Typography variant="h1" color="primary">
            ams
          </Typography> */}
          <img style={logoStyle} src="./adversea_logo.svg" alt="adversea" />
        </Link>
        <TextField
          id="outlined-search"
          color="secondary"
          value={searchTerm}
          label="Search"
          autoComplete="off"
          variant="outlined"
          onChange={(event) => handleSearchChange(event.target.value)}
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton color="primary" type="submit">
                  <Search />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </form>

      <Collapse timeout={1200} in={advancedSearchOpen}>
        <AdvancedSearch
          allYearsFromAPI={allYears}
          allRegionsFromAPI={allRegions}
          allKeywordsFromAPI={allKeywords}
          selectedAdvancedFilters={selectedFilters}
          onYearFromSelect={onYearFromSelect}
          onYearToSelect={onYearToSelect}
          onRegionSelect={onRegionSelect}
          onKeywordSelect={onKeywordSelect}
          onHide={onAdvancedSearchHide}
          onClear={onAdvancedSearchClear}
          onApply={onAdvancedSearchApply}
          onCancel={onAdvancedSearchCancel}
        />
      </Collapse>

      {!advancedSearchOpen && (
        <Stack
          alignItems="center"
          justifyContent="flex-end"
          direction="row"
          spacing={1}
        >
          {numSelectedFilters !== 0 && (
            <ButtonBase onClick={() => setAdvancedSearchOpen(true)}>
              <Stack direction="row" spacing={0.3}>
                <Box
                  sx={{
                    textAlign: "center",
                    borderRadius: "50%",
                    width: "0.9rem",
                    height: "0.9rem",
                    backgroundColor: "primary.main",
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
          <Button
            color="secondary"
            variant="text"
            size="small"
            style={{ textDecoration: "underline" }}
            onClick={() => setAdvancedSearchOpen(true)}
          >
            Advanced search
          </Button>
        </Stack>
      )}

      <Outlet />
    </div>
  );
}
