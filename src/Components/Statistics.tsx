import {
  Grid,
  Button,
  Typography,
  Stack,
  CircularProgress,
  Modal,
  Box
} from "@mui/material";
import React, { useState, useEffect } from "react";
import {
  Tooltip, ResponsiveContainer, XAxis, YAxis,
  LineChart, Line, CartesianGrid, BarChart, Bar, Legend
} from "recharts";
import { useSearchParams, useNavigate } from "react-router-dom";
import { apiCall } from "../Utils/APIConnector";
import RegionsPieChart from "./StatisticsPieChart";

interface GraphData {
  name: string;
  value: number;
  articlesIDs: string;
}

function generateGraphData(name: string, value: number, articlesIDs: string): GraphData {
  return { name, value, articlesIDs };
}

function getGraphData(
  dataNames: string[],
  dataValues: number[],
  articlesIDs: string[],
  sort: boolean
): GraphData[] {
  let result: GraphData[] = [];

  for (let i = 0; i < dataNames.length; i += 1) {
    result.push(generateGraphData(dataNames[i], dataValues[i], articlesIDs[i]));
  }

  if (sort) {
    const sortedData = result.slice().sort((a, b) => b.value - a.value);
    result = sortedData.slice(0, 7);
  }

  return result;
}

interface DatesGraphData {
  month: string;
  value: string;
}

function generateDatesGraphData(month: string, value: string): DatesGraphData {
  return { month, value };
}

function getDatesGraphData(dataNames: string[], dataValues: string[]): DatesGraphData[] {
  const result: DatesGraphData[] = [];

  for (let i = 0; i < dataNames.length; i += 1) {
    result.push(generateDatesGraphData(dataNames[i], dataValues[i]));
  }

  return result;
}

type regionsType = {
  [key: string]: string
}

const regionMap:regionsType = {
  Slovakia: "sk",
  "United States": "us",
  "Great Britan": "gb",
  Bulgaria: "bg",
  "Czech Republic": "cz",
  France: "fr",
  Belgium: "be",
  Germany: "de",
  Austria: "at",
  Switzerland: "ch",
  Greece: "gr",
  Netherlands: "nl",
  Hungary: "hu",
  Italy: "it",
  Latvia: "lv",
  Lithuania: "lt",
  Poland: "pl",
  Portugal: "pt",
  Romania: "ro",
  Slovenia: "sl",
  Ukraine: "ua"
};

function mapRegions(regionsKeys: string[]): any {
  // e.g. selectedRegions=['Slovakia', 'United States', 'Great Britan']
  const regions = regionsKeys.map((regionCode) => {
    const regionName = Object.keys(regionMap).find((key) => regionMap[key] === regionCode);
    return regionName;
  });

  return regions;
}

export default function Statistics() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoaded, setIsLoaded] = useState(false);
  const [topCrimes, setTopCrimes] = useState({} as any);
  const [regions, setRegions] = useState([] as any);
  const [articlesDates, setArticlesDates] = useState([] as any);
  const [mostArticlesYear, setMostArticlesYear] = useState("");
  const [totalResults, setTotalResuls] = useState(0);
  const [articlesCount, setArticlesCount] = useState(0);
  const [query, setQuery] = useState("" as any);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const navigate = useNavigate();

  interface StatsData {
    statsArticlesCount: number;
    statsQuery: string;
    searchFrom: string;
    searchTo: string;
    stats: any;
    statsTotalResults: number;
    status: number;
    ok: boolean;
  }
  function generateStatsData(
    statsArticlesCount: number,
    statsQuery: string,
    searchFrom: string,
    searchTo: string,
    stats: any,
    statsTotalResults: number,
    status: number,
    ok: boolean
  ): StatsData {
    return {
      statsArticlesCount, statsQuery, searchFrom, searchTo, stats, statsTotalResults, status, ok
    };
  }
  function getStatsData(resultValues: string[]): StatsData[] {
    const result: StatsData[] = [];

    result.push(generateStatsData(
      Number(resultValues[0]),
      resultValues[1],
      resultValues[2],
      resultValues[3],
      resultValues[4],
      Number(resultValues[5]),
      Number(resultValues[6]),
      (/true/i).test(resultValues[7])
    ));

    return result;
  }

  useEffect(() => {
    setIsLoaded(false);
    setQuery(searchParams.get("q"));

    apiCall(
      window._env_.REACT_APP_STATS_SERVER,
      `/api/search?${searchParams.toString()}`,
      "GET"
    ).then(
      (result) => {
        if (result.ok && result.data) {
          const resultValues: string[] = [];
          Object.values(result.data).forEach((val) => resultValues.push(val));

          const myData = getStatsData(resultValues);

          setTotalResuls(myData[0].statsTotalResults);
          setArticlesCount(myData[0].statsArticlesCount);
          setIsLoaded(true);

          // getting top crimes
          const crimeKeys: string[] = [];
          Object.keys(myData[0].stats.articles_by_crime).forEach((k) => crimeKeys.push(k));

          const crimeNumbers: number[] = [];
          Object.values(myData[0].stats.articles_by_crime).forEach(
            (n: any) => crimeNumbers.push(n.length)
          );

          const crimeArticlesIDs: string[] = [];
          Object.values(myData[0].stats.articles_by_crime).forEach(
            (n: any) => crimeArticlesIDs.push(n)
          );

          // getting regions
          const regionsKeys: string[] = [];
          Object.keys(myData[0].stats.articles_by_region).forEach((k) => regionsKeys.push(k));

          const regionsNumbers: number[] = [];
          Object.values(myData[0].stats.articles_by_region).forEach(
            (n: any) => regionsNumbers.push(n.length)
          );

          const regionsArticlesIDs: string[] = [];
          Object.values(myData[0].stats.articles_by_region).forEach(
            (n: any) => regionsArticlesIDs.push(n)
          );

          // getting articles by date
          const articlesIDs: string[] = [];
          Object.keys(myData[0].stats.articles_by_date).forEach((k) => articlesIDs.push(k));

          const articlesDatesMonths: string[] = [];
          Object.values(myData[0].stats.articles_by_date).forEach(
            (n: any) => articlesDatesMonths.push(n)
          );

          const datesData = getDatesGraphData(articlesDatesMonths, articlesIDs);

          const objectWithGroupByDate = {} as any;

          // generating JSON from articles_by_date response data
          for (let i = 0; i < datesData.length; i += 1) {
            let { month: months } = datesData[i];
            months = months.slice(0, 7);
            if (!objectWithGroupByDate[months]) {
              objectWithGroupByDate[months] = [];
            }
            objectWithGroupByDate[months].push(datesData[i]);
          }

          const articlesMonths: string[] = [];
          Object.keys(objectWithGroupByDate).forEach((k) => articlesMonths.push(k));

          const articlesMonthsValues: number[] = [];
          Object.values(objectWithGroupByDate).forEach(
            (n: any) => articlesMonthsValues.push(n.length)
          );

          // sort dates by months
          const artDates = (getGraphData(articlesMonths, articlesMonthsValues, [], false));
          artDates.sort((a, b) => {
            const x: any = a.name < b.name ? -1 : 1;
            return x;
          });

          // sort dates by number of articles
          const artDatesValues = (getGraphData(articlesMonths, articlesMonthsValues, [], false));
          artDatesValues.sort((a, b) => b.value - a.value);
          setMostArticlesYear(artDatesValues[0].name);

          const regionNames = mapRegions(regionsKeys);

          setTopCrimes(getGraphData(crimeKeys, crimeNumbers, crimeArticlesIDs, true));
          setRegions(getGraphData(regionNames, regionsNumbers, regionsArticlesIDs, true));
          setArticlesDates(artDates);
        }
      }
    );
  }, [searchParams]);

  const showSearchResults = () => {
    navigate(`/results?${searchParams.toString()}`);
  };

  const showArticlesFromGraph = (e: any) => {
    searchParams.append("page", `${1}`);
    searchParams.append("ids", `[${e.articlesIDs}]`);

    handleOpen();
  };

  const showArticlesByIDs = () => {
    setSearchParams(searchParams);
    navigate(`/results?${searchParams.toString()}`);
  };

  let numberOfTopCrimes;
  if (topCrimes.length < 7) {
    numberOfTopCrimes = topCrimes.length;
  } else { numberOfTopCrimes = 7; }

  const statsText = "statistics for: ";
  const resultsText = "total articles found: ";
  const statsResultsText = `statistics generated from ${articlesCount} articles`;

  const crimesGraphTitle = "top crimes";
  const regionsGraphTitle = "regions";
  const datesGraphTitle = "articles in time";

  const topCrimesGraphText1 = `We found the top ${numberOfTopCrimes} crimes ${query} was linked to. This person is most associated with the crime of `;
  const topCrimesGraphText2 = `. We found exactly ${topCrimes[0]?.value} articles related to this crime and ${query}.`;
  const regionsGraphText1 = `Most articles about ${query} were published in `;
  const regionsGraphText2 = `. More specifically, we found ${regions[0]?.value} articles about the searched person, that were published in this country.`;
  const datesGraphText = `On the line graph above we can see how articles about ${query} were published during the given time period. From this graph, we can see that most articles about the searched person were published in `;

  const data = {
    regions,
    searchParams,
    navigate
  };

  if (isLoaded) {
    if (totalResults === 0) {
      return (
        <div>
          <Grid item container justifyContent="center" spacing={0} marginTop={3} marginBottom={3} columns={16}>
            <Grid item xs={8}>
              <Button
                size="large"
                color="info"
                variant="text"
                sx={{
                  borderRight: "1px solid",
                  borderRadius: "0",
                  width: "100%"
                }}
                style={{ backgroundColor: "rgb(38, 166, 154)" }}
              >
                statistics
              </Button>
            </Grid>

            <Grid item xs={8}>
              <Button
                size="large"
                color="secondary"
                variant="text"
                onClick={showSearchResults}
                sx={{
                  borderRadius: "0",
                  width: "100%"
                }}
                style={{ backgroundColor: "rgb(240, 245, 247)" }}
              >
                articles
              </Button>
            </Grid>
          </Grid>
          <Grid item container justifyContent="center" spacing={1}>
            <Grid item>
              <Typography
                sx={{
                  marginTop: 2,
                  marginBottom: { xs: 0, md: 2 },
                  fontSize: 30,
                  fontWeight: 500
                }}
                color="primary"
              >
                {statsText}
              </Typography>
            </Grid>
            <Grid item>
              <Typography
                sx={{
                  marginTop: { xs: 0, md: 2 },
                  marginBottom: 2,
                  fontSize: 30,
                  fontWeight: 500
                }}
                color="secondary"
              >
                {query}
              </Typography>
            </Grid>
          </Grid>
          <Grid item container justifyContent="center" spacing={0} direction="column" style={{ textAlign: "center" }}>
            <Grid item>
              <Typography
                sx={{
                  fontSize: 15,
                  fontWeight: 200
                }}
                color="secondary"
              >
                {resultsText}
                {totalResults}
              </Typography>
            </Grid>
          </Grid>
        </div>
      );
    }

    return (
      <div className="main">
        <Grid item container justifyContent="center" spacing={0} marginTop={3} marginBottom={3} columns={16}>
          <Grid item xs={8}>
            <Button
              size="large"
              color="info"
              variant="text"
              sx={{
                borderRight: "1px solid",
                borderRadius: "0",
                width: "100%"
              }}
              style={{ backgroundColor: "rgb(38, 166, 154)" }}
            >
              statistics
            </Button>
          </Grid>

          <Grid item xs={8}>
            <Button
              size="large"
              color="secondary"
              variant="text"
              onClick={showSearchResults}
              sx={{
                width: "100%",
                borderRadius: "0"
              }}
              style={{ backgroundColor: "rgb(240, 245, 247)" }}
            >
              articles
            </Button>
          </Grid>
        </Grid>
        <Grid item container justifyContent="center" spacing={1}>
          <Grid
            item
            xs="auto"
          >
            <Typography
              sx={{
                marginTop: 2,
                marginBottom: { xs: 0, md: 2 },
                fontSize: 30,
                fontWeight: 500
              }}
              color="primary"
            >
              {statsText}
            </Typography>
          </Grid>
          <Grid
            item
            xs="auto"
          >
            <Typography
              sx={{
                marginTop: { xs: 0, md: 2 },
                marginBottom: 2,
                fontSize: 30,
                fontWeight: 500
              }}
              color="secondary"
            >
              {query}
            </Typography>
          </Grid>
        </Grid>
        <Grid item container justifyContent="center" spacing={0} direction="column" style={{ textAlign: "center" }} xs="auto">
          <Grid
            item
            xs="auto"
          >
            <Typography
              sx={{
                fontSize: 15,
                fontWeight: 200
              }}
              color="secondary"
            >
              {resultsText}
              {totalResults}
            </Typography>
          </Grid>
          <Grid
            item
            xs="auto"
          >
            <Typography
              sx={{
                fontSize: 15,
                fontWeight: 200,
                marginBottom: 4
              }}
              color="secondary"
            >
              {statsResultsText}
            </Typography>
          </Grid>
        </Grid>
        <Grid container spacing={1} marginBottom={1} sx={{ textAlign: { xs: "center", md: "left" } }}>
          <Grid
            item
            xs={12}
            md={6}
            order={{ xs: 2, md: 1 }}
            sx={{ marginLeft: { xs: -2, md: 0 } }}
          >
            <ResponsiveContainer className="topCrimesChart" width="99%" height={270}>
              <BarChart
                width={300}
                height={200}
                data={topCrimes}
                layout="vertical"
                margin={{
                  top: 5, bottom: 5, left: 50
                }}
                style={{ fontSize: 12 }}
              >
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" name="number of found articles" fill="#7163B4" onClick={showArticlesFromGraph} />
              </BarChart>
            </ResponsiveContainer>
          </Grid>
          <Grid
            item
            xs={12}
            md={5}
            sx={{ marginLeft: { xs: 0, md: 5 } }}
            marginBottom={3}
            order={{ xs: 1, md: 2 }}
          >
            <Typography color="primary" sx={{ marginTop: { xs: 2, md: 4 } }} fontSize={25}>
              {crimesGraphTitle}
            </Typography>
            <Typography marginTop={1} color="secondary" display="inline">
              {topCrimesGraphText1}
            </Typography>
            <Typography color="primary" display="inline">
              {topCrimes[0]?.name.toLowerCase()}
            </Typography>
            <Typography color="secondary" display="inline">
              {topCrimesGraphText2}
            </Typography>
          </Grid>
        </Grid>
        <Grid
          container
          spacing={0}
          justifyContent="center"
          sx={{
            textAlign: { xs: "center", md: "right" }
          }}
        >
          <Grid item xs={12} md={4}>
            <Typography sx={{ marginTop: { xs: 4, md: 7 } }} color="primary" fontSize={25}>
              {regionsGraphTitle}
            </Typography>
            <Typography marginTop={1} color="secondary" display="inline">
              {regionsGraphText1}
            </Typography>
            <Typography color="primary" display="inline">
              {regions[0]?.name}
            </Typography>
            <Typography color="secondary" display="inline">
              {regionsGraphText2}
            </Typography>
          </Grid>
          <Grid item xs={12} md={7} marginLeft={2}>
            <RegionsPieChart data={data} />
          </Grid>
        </Grid>
        <Grid container spacing={1} justifyContent="center" style={{ textAlign: "center" }}>
          <Grid
            item
            xs={12}
            order={{ xs: 2, md: 1 }}
            sx={{ marginTop: { xs: 0, md: 3 }, marginLeft: { xs: -4, md: 0 } }}
          >
            <ResponsiveContainer width="99%" height={180}>
              <LineChart
                width={500}
                height={200}
                data={articlesDates}
                margin={{
                  top: 2
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line connectNulls type="monotone" dataKey="value" name="number of found articles" stroke="#9D4993" fill="#9D4993" />
              </LineChart>
            </ResponsiveContainer>
          </Grid>
          <Grid item xs={12} md={8} style={{ textAlign: "center" }} marginBottom={5} order={{ xs: 1, md: 2 }}>
            <Typography sx={{ marginTop: { xs: 0, md: 2 } }} color="primary" fontSize={25}>
              {datesGraphTitle}
            </Typography>
            <Typography marginTop={1} color="secondary" display="inline">
              {datesGraphText}
            </Typography>
            <Typography color="primary" display="inline">
              {mostArticlesYear.slice(0, 4)}
            </Typography>
            <Typography color="secondary" display="inline">
              .
            </Typography>
          </Grid>
        </Grid>
        <Modal
          open={open}
          onClose={handleClose}
        >
          <Box sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            p: 4,
            px: 4,
            pb: 3,
            textAlign: "center"
          }}
          >
            <Typography sx={{ mt: 2, textAlign: "center" }}>
              Do you want to show related articles?
            </Typography>
            <Grid container spacing={3} justifyContent="center" style={{ textAlign: "center" }}>
              <Grid item>
                <Button
                  color="info"
                  variant="text"
                  style={{
                    textAlign: "center",
                    width: "30%",
                    backgroundColor: "rgb(38, 166, 154)",
                    marginBottom: "10px",
                    marginTop: "30px"
                  }}
                  onClick={showArticlesByIDs}
                >
                  Yes
                </Button>
              </Grid>
              <Grid item>
                <Button
                  sx={{
                    textAlign: "center",
                    width: "30%",
                    marginTop: "30px",
                    marginBottom: "10px"
                  }}
                  onClick={handleClose}
                >
                  No
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Modal>
      </div>
    );
  }

  return (
    <div>
      <Grid item container justifyContent="center" spacing={0} marginTop={3} marginBottom={3} columns={16}>
        <Grid item xs={8}>
          <Button
            size="large"
            color="info"
            variant="text"
            sx={{
              borderRight: "1px solid",
              borderRadius: "0",
              width: "100%"
            }}
            style={{ backgroundColor: "rgb(38, 166, 154)" }}
          >
            statistics
          </Button>
        </Grid>

        <Grid item xs={8}>
          <Button
            size="large"
            color="secondary"
            variant="text"
            onClick={showSearchResults}
            sx={{
              borderRadius: "0",
              width: "100%"
            }}
            style={{ backgroundColor: "rgb(240, 245, 247)" }}
          >
            articles
          </Button>
        </Grid>
      </Grid>
      <Grid item container justifyContent="center" spacing={1}>
        <Grid item>
          <Typography
            sx={{
              marginTop: 2,
              marginBottom: { xs: 0, md: 2 },
              fontSize: 30,
              fontWeight: 500
            }}
            color="primary"
          >
            {statsText}
          </Typography>
        </Grid>
        <Grid item>
          <Typography
            sx={{
              marginTop: { xs: 0, md: 2 },
              marginBottom: 2,
              fontSize: 30,
              fontWeight: 500
            }}
            color="secondary"
          >
            {query}
          </Typography>
        </Grid>
      </Grid>
      <Stack spacing={1} sx={{ pt: 2 }} alignItems="center">
        <CircularProgress size={50} thickness={2} color="secondary" />
      </Stack>
    </div>
  );
}
