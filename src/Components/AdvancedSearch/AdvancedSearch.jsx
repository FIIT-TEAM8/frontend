import {
  Button, Grid, Typography, FormControl, InputLabel, Select, MenuItem
} from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import ClearIcon from "@mui/icons-material/Clear";
import React, { useState, useEffect } from "react";
import { StyledToggleButton, StyledToggleButtonGroup } from "../../Style/StyledToggleButton";
import { emptyFilters } from "../../Utils/AdvancedSearchUtils";

export default function AdvancedSearch({
  allYearsFromAPI,
  allRegionsFromAPI,
  allKeywordsFromAPI,
  selectedAdvancedFilters,
  onYearFromSelect,
  onYearToSelect,
  onRegionSelect,
  onKeywordSelect,
  onHide,
  onClear,
  onApply,
  onCancel
}) {
  const [selectedFilters, setSelectedFilters] = useState(emptyFilters);
  const [allYears, setAllYears] = useState([]);
  const [allRegions, setAllRegions] = useState([]);
  const [allKeywords, setAllKeywords] = useState([]);

  const isYearFilterSelected = selectedFilters.from.value !== selectedFilters.from.defaultValue
    || selectedFilters.to.value !== selectedFilters.to.defaultValue;

  useEffect(() => {
    setSelectedFilters(selectedAdvancedFilters);
  }, [selectedAdvancedFilters]);

  useEffect(() => {
    setAllYears(allYearsFromAPI);
    setAllRegions(Object.keys(allRegionsFromAPI));
    setAllKeywords(allKeywordsFromAPI);
  }, [allYearsFromAPI, allRegionsFromAPI, allKeywordsFromAPI]);

  const handleChangeYearFrom = (e) => {
    onYearFromSelect(e.target.value);
  };

  const handleChangeYearTo = (e) => {
    onYearToSelect(e.target.value);
  };

  const handleRegionClick = (e, selectedRegions) => {
    onRegionSelect(selectedRegions);
  };

  const handleKeywordClick = (e, selectedKeywords) => {
    onKeywordSelect(selectedKeywords);
  };

  return (
    <Grid container spacing={2} sx={{ pt: 2 }}>
      <Grid item>
        <Typography color={isYearFilterSelected ? "primary" : "secondary"}>
          year of publication
        </Typography>
      </Grid>

      <Grid item container spacing={1} direction="row">
        <Grid item container xs={5} justifyContent="center">
          {selectedFilters.from.value && (
            <FormControl variant="standard">
              <InputLabel>from</InputLabel>
              <Select
                label="From"
                value={selectedFilters.from.value}
                onChange={handleChangeYearFrom}
              >
                {allYears.map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </Grid>

        <Grid item container xs justifyContent="center">
          <Typography variant="h2" component="p" color="secondary" sx={{ pt: 2 }}>
            -
          </Typography>
        </Grid>

        <Grid item container xs={5} justifyContent="center">
          {selectedFilters.to.value && (
            <FormControl variant="standard">
              <InputLabel>to</InputLabel>
              <Select label="To" value={selectedFilters.to.value} onChange={handleChangeYearTo}>
                {allYears.slice(allYears.indexOf(selectedFilters.from.value)).map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </Grid>
      </Grid>

      <Grid item>
        <Typography color={selectedFilters.regions.length ? "primary" : "secondary"}>
          regions
        </Typography>
      </Grid>

      <StyledToggleButtonGroup value={selectedFilters.regions} onChange={handleRegionClick}>
        {allRegions.map((region) => (
          <StyledToggleButton
            key={region}
            sx={{ whiteSpace: "nowrap" }}
            size="small"
            value={region}
          >
            {region}
          </StyledToggleButton>
        ))}
      </StyledToggleButtonGroup>

      <Grid item>
        {selectedFilters.keywords.length ? (
          <Typography color="primary">included keywords</Typography>
        ) : (
          <Typography color="secondary">included keywords</Typography>
        )}
      </Grid>

      <StyledToggleButtonGroup value={selectedFilters.keywords} onChange={handleKeywordClick}>
        {allKeywords.map((keyword) => (
          <StyledToggleButton
            key={keyword}
            sx={{ whiteSpace: "nowrap" }}
            size="small"
            value={keyword}
          >
            {keyword}
          </StyledToggleButton>
        ))}
      </StyledToggleButtonGroup>

      <Grid item container justifyContent="flex-end" spacing={1}>
        <Grid item>
          <Button
            color="secondary"
            variant="text"
            size="small"
            style={{ textDecoration: "underline" }}
            onClick={onHide}
          >
            <KeyboardArrowUpIcon />
            Hide
          </Button>
        </Grid>
        <Grid item>
          <Button
            color="secondary"
            variant="text"
            size="small"
            style={{ textDecoration: "underline" }}
            onClick={onClear}
          >
            <ClearIcon />
            Clear
          </Button>
        </Grid>
        <Grid item>
          <Button size="small" variant="contained" onClick={onApply}>
            Apply & Search
          </Button>
        </Grid>
        <Grid item>
          <Button color="secondary" variant="contained" size="small" onClick={onCancel}>
            Cancel
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
}
