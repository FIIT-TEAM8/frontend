import {
  Button,
  Grid,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box
} from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import ClearIcon from "@mui/icons-material/Clear";
import React, { useState, useEffect } from "react";
import { emptyFilters } from "../../Utils/AdvancedSearchUtils";
import MultipleSelect from "./MultipleSelect";

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

  const resolveSelectedItem = (item) => (typeof item === "string" ? [item] : item);

  const handleChangeYearFrom = (e) => {
    onYearFromSelect(e.target.value);
  };

  const handleChangeYearTo = (e) => {
    onYearToSelect(e.target.value);
  };

  const handleRegionClick = (e) => {
    onRegionSelect(resolveSelectedItem(e.target.value));
  };

  const handleKeywordClick = (e) => {
    onKeywordSelect(resolveSelectedItem(e.target.value));
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Grid container spacing={2} sx={{ pt: 2 }} direction="column">
        <Grid item>
          <Typography color={isYearFilterSelected ? "primary" : "secondary"}>
            year of publication
          </Typography>
        </Grid>

        <Grid container item spacing={1} direction="row" justifyContent="center">
          <Grid item xs={5}>
            {selectedFilters.from.value && (
              <FormControl fullWidth>
                <InputLabel>from</InputLabel>
                <Select
                  sx={{ textAlign: "center" }}
                  label="from"
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

          <Grid item xs justifyContent="center" alignItems="center" display="flex">
            <Typography variant="h2" component="p" color="secondary" sx={{ pt: 2 }}>
              -
            </Typography>
          </Grid>

          <Grid item xs={5}>
            {selectedFilters.to.value && (
              <FormControl fullWidth>
                <InputLabel>to</InputLabel>
                <Select
                  sx={{ textAlign: "center" }}
                  label="to"
                  value={selectedFilters.to.value}
                  onChange={handleChangeYearTo}
                >
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

        <Grid item container wrap="wrap" direction="column">
          <Grid item>
            <Typography color={selectedFilters.regions.length ? "primary" : "secondary"}>
              regions
            </Typography>
          </Grid>
          <Grid item container>
            <MultipleSelect
              allItems={allRegions}
              selectedItems={selectedFilters.regions}
              handleClick={handleRegionClick}
            />
          </Grid>
        </Grid>

        <Grid item container wrap="wrap" direction="column">
          <Grid item>
            <Typography color={selectedFilters.keywords.length ? "primary" : "secondary"}>
              included keywords
            </Typography>
          </Grid>
          <Grid item container>
            <MultipleSelect
              allItems={allKeywords}
              selectedItems={selectedFilters.keywords}
              handleClick={handleKeywordClick}
            />
          </Grid>
        </Grid>

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
    </Box>
  );
}
