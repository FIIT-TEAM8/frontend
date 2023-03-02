import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Collapse } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";

import { apiCall } from "../../Utils/APIConnector";
import { getYears } from "../../Utils/AdvancedSearchUtils";
import { AdvSearchItems, APIResponse, Regions } from "../../types/Interfaces";
import AdvancedSearch from "./AdvancedSearch";
import SmallAdvancedSearch from "./SmallAdvancedSearch";

const emptyFilters: AdvSearchItems = {
  from: {
    value: "",
    defaultValue: ""
  },
  to: {
    value: "",
    defaultValue: ""
  },
  regions: [],
  keywords: []
};

type Props = {
  open: boolean;
  submitAllowed: boolean;
  // eslint-disable-next-line no-unused-vars
  onFilterSelect: (numSelectedFilters: number) => void;
  apply: () => void;
  hide: () => void;
};

export default function Handler({
  open, submitAllowed, onFilterSelect, apply, hide
}: Props) {
  const matches = useMediaQuery("(min-width:800px)");
  const [searchParams, setSearchParams] = useSearchParams();

  const [advancedSearchOpen, setAdvancedSearchOpen] = useState(false);
  const [allYears, setAllYears] = useState<string[]>([]);
  const [allRegions, setAllRegions] = useState<Regions>({});
  const [allKeywords, setAllKeywords] = useState<string[]>([]);
  const [selectedFilters, setSelectedFilters] = useState(emptyFilters);
  const [numSelectedFilters, setNumSelectedFilters] = useState(0);
  const [canSubmit, setCanSubmit] = useState(true);

  useEffect(() => {
    apiCall(
      window._env_.REACT_APP_FLASK_DATA_URL,
      `/api/${window._env_.REACT_APP_FLASK_DATA_API_VERSION}/keyword_categories/`,
      "GET"
    ).then((result: APIResponse) => {
      if (result.ok && result.data) {
        setAllKeywords(Object.keys(result.data));
      }
    });

    apiCall(
      window._env_.REACT_APP_FLASK_DATA_URL,
      `/api/${window._env_.REACT_APP_FLASK_DATA_API_VERSION}/region_mapping/`,
      "GET"
    ).then((result: APIResponse) => {
      if (result.ok && result.data && !("results" in result.data)) {
        setAllRegions(result.data);
      }
    });

    setAllYears(getYears(2016, new Date().getFullYear()));
  }, []);

  useEffect(() => {
    setAdvancedSearchOpen(open);
  }, [open]);

  useEffect(() => {
    setCanSubmit(submitAllowed);
  }, [submitAllowed]);

  useEffect(() => {
    setNumSelectedFilters(() => {
      const yearFrom = selectedFilters.from.defaultValue !== selectedFilters.from.value ? 1 : 0;
      const yearTo = selectedFilters.to.defaultValue !== selectedFilters.to.value ? 1 : 0;
      const regions = selectedFilters.regions.length;
      const keywords = selectedFilters.keywords.length;
      return yearFrom + yearTo + regions + keywords;
    });
  }, [selectedFilters]);

  useEffect(() => {
    onFilterSelect(numSelectedFilters);
  }, [numSelectedFilters]);

  useEffect(() => {
    apply();
  }, [searchParams]);

  useEffect(() => {
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const regionCodes: string | null = searchParams.get("regions");
    const keywords = searchParams.get("keywords");

    const updatedSelectedFilters = { ...selectedFilters };

    const defaultYearFrom = allYears[0];
    const defaultYearTo = allYears[allYears.length - 1];

    // e.g. from="2019-01-01", to="2022-12-31"
    updatedSelectedFilters.from.defaultValue = defaultYearFrom;
    updatedSelectedFilters.from.value = from ? from.slice(0, 4) : defaultYearFrom;

    updatedSelectedFilters.to.defaultValue = defaultYearTo;
    updatedSelectedFilters.to.value = to ? to.slice(0, 4) : defaultYearTo;

    // e.g. regionCodes="[sk,us,gb]"
    if (regionCodes) {
      const regionCodesArr: Array<string> = regionCodes.slice(1, -1).split(",");

      // e.g. selectedRegions=["Slovakia", "United States", "Great Britan"]
      const selectedRegions: Array<string> = regionCodesArr.map((regionCode) => {
        const regionName = Object.keys(allRegions).find((key) => allRegions[key] === regionCode);
        return regionName ?? "";
      });

      updatedSelectedFilters.regions = selectedRegions;
    }
    if (keywords) {
      const keywordsArr = keywords.slice(1, -1).split(",");
      updatedSelectedFilters.keywords = keywordsArr;
    }

    setSelectedFilters(updatedSelectedFilters);
  }, [allYears, allRegions, allKeywords]);

  const getClearedFilters = () => {
    const defaultYearFrom = allYears[0];
    const defaultYearTo = allYears[allYears.length - 1];

    return {
      ...emptyFilters,
      from: {
        value: defaultYearFrom,
        defaultValue: defaultYearFrom
      },
      to: {
        value: defaultYearTo,
        defaultValue: defaultYearTo
      }
    };
  };

  const updateSearchParams = (updatedSelectedFilters: AdvSearchItems) => {
    const filters = Object.keys(updatedSelectedFilters);

    filters.forEach((filterName) => {
      searchParams.delete(filterName);
    });

    const selectedRegions = updatedSelectedFilters.regions.map((region) => allRegions[region]);

    if (updatedSelectedFilters.from.value !== updatedSelectedFilters.from.defaultValue) {
      searchParams.append("from", `${updatedSelectedFilters.from.value}-01-01`);
    }
    if (updatedSelectedFilters.to.value !== updatedSelectedFilters.to.defaultValue) {
      searchParams.append("to", `${updatedSelectedFilters.to.value}-12-31`);
    }
    if (selectedRegions.length) {
      searchParams.append("regions", `[${selectedRegions.join(",")}]`);
    }
    if (updatedSelectedFilters.keywords.length) {
      searchParams.append("keywords", `[${updatedSelectedFilters.keywords.join(",")}]`);
    }

    setSearchParams(searchParams);
  };

  const onYearFromSelect = (yearFrom: string) => {
    let yearTo = selectedFilters.to.value;
    // disable wrong year range
    if (yearFrom > selectedFilters.to.value) {
      yearTo = yearFrom;
    }
    setSelectedFilters({
      ...selectedFilters,
      from: { ...selectedFilters.from, value: yearFrom },
      to: { ...selectedFilters.to, value: yearTo }
    });
  };

  const onYearToSelect = (yearTo: string) => {
    setSelectedFilters({
      ...selectedFilters,
      to: { ...selectedFilters.to, value: yearTo }
    });
  };

  const onRegionSelect = (selectedRegions: string[]) => {
    setSelectedFilters({ ...selectedFilters, regions: selectedRegions });
  };

  const onKeywordSelect = (selectedKeywords: string[]) => {
    setSelectedFilters({ ...selectedFilters, keywords: selectedKeywords });
  };

  const onHide = () => {
    setAdvancedSearchOpen(false);
    window.scroll({ top: 0, left: 0, behavior: "smooth" });
    hide();
  };

  const onClear = () => {
    setSelectedFilters(() => getClearedFilters());
  };

  const onApply = () => {
    // can submit only if the search term is not empty
    if (canSubmit) {
      updateSearchParams(selectedFilters);
      onHide();
    }
  };

  const onCancel = () => {
    setSelectedFilters(() => {
      const clearedFilters = getClearedFilters();

      updateSearchParams(clearedFilters);

      return clearedFilters;
    });

    onHide();
  };

  return (
    <Collapse timeout={1200} in={advancedSearchOpen}>
      {matches ? (
        <AdvancedSearch
          allYearsFromAPI={allYears}
          allRegionsFromAPI={allRegions}
          allKeywordsFromAPI={allKeywords}
          selectedAdvancedFilters={selectedFilters}
          onYearFromSelect={onYearFromSelect}
          onYearToSelect={onYearToSelect}
          onRegionSelect={onRegionSelect}
          onKeywordSelect={onKeywordSelect}
          onHide={onHide}
          onClear={onClear}
          onApply={onApply}
          onCancel={onCancel}
        />
      ) : (
        <SmallAdvancedSearch
          allYearsFromAPI={allYears}
          allRegionsFromAPI={allRegions}
          allKeywordsFromAPI={allKeywords}
          selectedAdvancedFilters={selectedFilters}
          onYearFromSelect={onYearFromSelect}
          onYearToSelect={onYearToSelect}
          onRegionSelect={onRegionSelect}
          onKeywordSelect={onKeywordSelect}
          onHide={onHide}
          onClear={onClear}
          onApply={onApply}
          onCancel={onCancel}
        />
      )}
    </Collapse>
  );
}
