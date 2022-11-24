import {
  Grid,
  Button,
  Typography,
  Stack,
  CircularProgress
} from "@mui/material";
import React, { useState, useEffect } from "react";
import {
  Tooltip, ResponsiveContainer, XAxis, YAxis,
  LineChart, Line, CartesianGrid, BarChart, Bar, Legend
} from "recharts";
import { useSearchParams, useNavigate } from "react-router-dom";
import { apiCall } from "../Utils/APIConnector";
import RegionsPieChart from "./StatisticsPieChart";

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
  const [searchParams] = useSearchParams();
  // const [actResults, setActResults] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  // const [lastSearched, setLastSearched] = useState("null");
  // const [articles, setArticles] = useState(0 as any);
  const [statsData, setStatsData] = useState({} as any);
  const [topCrimes, setTopCrimes] = useState({} as any);
  const [regions, setRegions] = useState([] as any);
  const [totalResults, setTotalResuls] = useState(0);
  const [articlesCount, setArticlesCount] = useState(0);
  const [query, setQuery] = useState("" as any);
  const navigate = useNavigate();

  interface GraphData {
    name: string;
    value: number;
  }
  function generateGraphData(name: string, value: number): GraphData {
    return { name, value };
  }
  function getGraphData(dataNames: string[], dataValues: number[]): GraphData[] {
    let result: GraphData[] = [];

    for (let i = 0; i < dataNames.length; i += 1) {
      result.push(generateGraphData(dataNames[i], dataValues[i]));
    }

    const sortedData = result.slice().sort((a, b) => b.value - a.value);
    result = sortedData.slice(0, 7);

    return result;
  }

  interface StatsData {
    statsarticlesCount: number;
    statsQuery: string;
    searchFrom: string;
    searchTo: string;
    stats: {};
    statsTotalResults: number;
    status: number;
    ok: boolean;
  }
  function generateStatsData(
    statsarticlesCount: number,
    statsQuery: string,
    searchFrom: string,
    searchTo: string,
    stats: {},
    statsTotalResults: number,
    status: number,
    ok: boolean
  ): StatsData {
    return {
      statsarticlesCount, statsQuery, searchFrom, searchTo, stats, statsTotalResults, status, ok
    };
  }
  function getStatsData(resultValues: string[]): StatsData[] {
    const result: StatsData[] = [];

    result.push(generateStatsData(
      +resultValues[0],
      resultValues[1],
      resultValues[2],
      resultValues[3],
      resultValues[4],
      +resultValues[5],
      +resultValues[6],
      (/true/i).test(resultValues[7])
    ));

    return result;
  }

  useEffect(() => {
    setIsLoaded(false);

    // const q = searchParams.get("q");
    // if (q !== lastSearched) {
    //   setLastSearched(q);
    // }

    setQuery(searchParams.get("q"));

    apiCall(
      "http://localhost:8010/proxy/",
      `stats/api/search?${searchParams.toString()}`,
      "GET"
    ).then(
      (result) => {
        if (result.ok) {
          const reslutKeys: string[] = [];
          const resultValues: string[] = [];
          Object.keys(result).forEach((k) => reslutKeys.push(k));
          Object.values(result).forEach((val) => resultValues.push(val));

          setStatsData(getStatsData(resultValues));
          setIsLoaded(true);
        }
      }
    );

    console.log(statsData[0].statsarticlesCount);
    setTotalResuls(statsData[0].statsTotalResults);
    setArticlesCount(statsData[0].statsarticlesCount);

    // getting top crimes
    const crimeKeys: string[] = [];
    Object.keys(statsData[0].stats.articles_by_crime).forEach((k) => crimeKeys.push(k));

    const crimeNumbers: number[] = [];
    Object.values(statsData[0].stats.articles_by_crime).forEach(
      (n: any) => crimeNumbers.push(n.length)
    );

    // getting regions
    const regionsKeys: string[] = [];
    Object.keys(statsData[0].stats.articles_by_region).forEach((k) => regionsKeys.push(k));

    const regionsNumbers: number[] = [];
    Object.values(statsData[0].stats.articles_by_region).forEach(
      (n: any) => regionsNumbers.push(n.length)
    );

    const regionNames = mapRegions(regionsKeys);

    setTopCrimes(getGraphData(crimeKeys, crimeNumbers));
    setRegions(getGraphData(regionNames, regionsNumbers));
  }, [searchParams]);

  const articles = [
    { year: "2016", articles: 20 },
    { year: "2017", articles: 35 },
    { year: "2018", articles: 12 },
    { year: "2019", articles: 28 },
    { year: "2020", articles: 15 },
    { year: "2021", articles: 45 },
    { year: "2022", articles: 67 },
  ];
  // const languages = [
  //   { language: "english", number: 20 },
  //   { language: "italian", number: 35 },
  //   { language: "romanian", number: 12 },
  //   { language: "czech", number: 28 },
  //   { language: "german", number: 15 },
  //   { language: "polish", number: 45 },
  //   { language: "spanish", number: 10 },
  // ];

  const showSearchResults = () => {
    navigate(`/results?${searchParams.toString()}`);
  };

  const statsText = "statistics for: ";
  const resultsText = "total articles found: ";
  const statsResultsText = `statistics generated from ${articlesCount} articles`;

  const crimesGraphTitle = "top crimes";
  const regionsGraphTitle = "regions";
  const datesGraphTitle = "articles in time";

  const topCrimesGraphText1 = `We found the top 7 crimes ${query} was linked to. This person is most associated with the crime of `;
  const topCrimesGraphText2 = `. We found exactly ${topCrimes[0].value} articles related to this crime and ${query}.`;
  const regionsGraphText1 = `Most articles about ${query} were published in `;
  const regionsGraphText2 = `. More specifically, we found ${regions[0].value} articles about the searched person, that were published in this country.`;
  const datesGraphText = `On the line graph above we can see how articles about ${query} were published during the given time period. From this graph, we can see that most articles about the searched person were published in ${articles[0].year}.`;

  if (isLoaded) {
    return (
      <div className="main">
        <Grid item container justifyContent="center" spacing={0} marginTop={3} marginBottom={3} columns={16}>
          <Grid item xs="auto">
            <Button
              size="large"
              color="primary"
              variant="text"
              sx={{
                borderRight: "1px solid",
                borderRadius: "0",
                width: "28vw"
              }}
              style={{ backgroundColor: "rgb(240, 251, 250)" }}
            >
              statistics
            </Button>
          </Grid>

          <Grid item xs="auto">
            <Button
              size="large"
              color="secondary"
              variant="text"
              onClick={showSearchResults}
              sx={{
                width: "28vw"
              }}
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
                marginBottom: 2,
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
                marginTop: 2,
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
          <Grid item>
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
        <Grid container spacing={1} marginBottom={2} style={{ textAlign: "left" }}>
          <Grid item xs={6}>
            <ResponsiveContainer className="topCrimesChart" width="100%" height={270}>
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
                <Bar dataKey="value" name="number of crimes" fill="#7163B4" />
              </BarChart>
            </ResponsiveContainer>
          </Grid>
          <Grid item xs={5} marginLeft={5}>
            <Typography color="primary" marginTop={4} fontSize={25}>
              {crimesGraphTitle}
            </Typography>
            <Typography marginTop={1} color="secondary" display="inline">
              {topCrimesGraphText1}
            </Typography>
            <Typography color="primary" display="inline">
              {topCrimes[0].name.toLowerCase()}
            </Typography>
            <Typography color="secondary" display="inline">
              {topCrimesGraphText2}
            </Typography>
          </Grid>
        </Grid>
        <Grid container spacing={0} justifyContent="center" style={{ textAlign: "right" }}>
          <Grid item xs={4}>
            <Typography marginTop={7} color="primary" fontSize={25}>
              {regionsGraphTitle}
            </Typography>
            <Typography marginTop={1} color="secondary" display="inline">
              {regionsGraphText1}
            </Typography>
            <Typography color="primary" display="inline">
              {regions[0].name}
            </Typography>
            <Typography color="secondary" display="inline">
              {regionsGraphText2}
            </Typography>
          </Grid>
          <Grid item xs={7} marginLeft={2}>
            <RegionsPieChart regions={regions} />
          </Grid>
        </Grid>
        <Grid container spacing={1} justifyContent="center" style={{ textAlign: "center" }}>
          <Grid item xs={12}>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart
                width={500}
                height={200}
                data={articles}
                margin={{
                  top: 20
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Line connectNulls type="monotone" dataKey="articles" stroke="#9D4993" fill="#9D4993" />
              </LineChart>
            </ResponsiveContainer>
          </Grid>
          <Grid item xs={8} style={{ textAlign: "center" }}>
            <Typography marginTop={2} color="primary" fontSize={25}>
              {datesGraphTitle}
            </Typography>
            <Typography marginTop={1} marginBottom={7} color="secondary">
              {datesGraphText}
            </Typography>
          </Grid>
        </Grid>
      </div>
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
