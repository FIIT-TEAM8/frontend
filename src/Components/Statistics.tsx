import { Grid, Button, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";
import {
  Tooltip, ResponsiveContainer, XAxis, YAxis,
  LineChart, Line, CartesianGrid, BarChart, Bar, Legend
} from "recharts";
import { useSearchParams, useNavigate } from "react-router-dom";
// import { apiCall } from "../Utils/APIConnector";
import RegionsPieChart from "./StatisticsPieChart";
import myData from "./test.json";

export default function Statistics() {
  const [searchParams] = useSearchParams();
  // const [actResults, setActResults] = useState([]);
  // const [isLoaded, setIsLoaded] = useState(false);
  // const [lastSearched, setLastSearched] = useState("null");
  // const [articles, setArticles] = useState(0 as any);
  const [statsData, setStatsData] = useState({});
  const [topCrimes, setTopCrimes] = useState({} as any);
  const [regions, setRegions] = useState([] as any);
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
    const result: GraphData[] = [];

    for (let i = 0; i < 7; i += 1) {
      result.push(generateGraphData(dataNames[i], dataValues[i]));
    }

    return result;
  }

  useEffect(() => {
    // setIsLoaded(false);

    // const q = searchParams.get("q");
    // if (q !== lastSearched) {
    //   setLastSearched(q);
    // }

    setQuery(searchParams.get("q"));

    // apiCall(`/stats/api/search?${searchParams.toString()}`, "GET").then(
    //   (result) => {
    //     if (result.ok) {
    //       // setIsLoaded(true);
    //       setStatsData(result.data?.stats);
    //       console.log("ok");
    //     }
    //   }
    // );

    fetch(`https://adversea.com/stats/api/search?${searchParams.toString()}`)
      .then((response) => response.json())
      .then((data) => setStatsData(data.message));

    console.log(statsData);

    // getting top crimes
    const crimeKeys: string[] = [];
    Object.keys(myData.stats.articles_by_crime).forEach((k) => crimeKeys.push(k));

    const crimeNumbers: number[] = [];
    Object.values(myData.stats.articles_by_crime).forEach((n) => crimeNumbers.push(n.length));

    // getting regions
    const regionsKeys: string[] = [];
    Object.keys(myData.stats.articles_by_region).forEach((k) => regionsKeys.push(k));

    const regionsNumbers: number[] = [];
    Object.values(myData.stats.articles_by_region).forEach((n) => regionsNumbers.push(n.length));

    setTopCrimes(getGraphData(crimeKeys, crimeNumbers));
    setRegions(getGraphData(regionsKeys, regionsNumbers));
    console.log(getGraphData(regionsKeys, regionsNumbers));
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
    navigate(`/search/results?${searchParams.toString()}`);
  };

  const statsText = "statistics for: ";
  const graphsText = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.";

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
              width: 300
            }}
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
              width: 300
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
              margin: 2,
              marginBottom: 6,
              fontSize: 30,
              fontWeight: 500
            }}
          >
            {statsText}
            {query}
          </Typography>
        </Grid>
      </Grid>
      <Grid container spacing={5} style={{ textAlign: "center" }}>
        <Grid item xs={6}>
          <ResponsiveContainer className="topCrimesChart" width="100%" height={270}>
            <BarChart
              width={300}
              height={200}
              data={topCrimes}
              layout="vertical"
              margin={{
                top: 5, bottom: 5
              }}
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
          <Typography marginTop={7}>
            {graphsText}
          </Typography>
        </Grid>
      </Grid>
      <Grid container spacing={8} style={{ textAlign: "center" }}>
        <Grid item xs={4}>
          <Typography marginTop={10}>
            {graphsText}
          </Typography>
        </Grid>
        <Grid item xs={7} marginLeft={9}>
          <RegionsPieChart regions={regions} />
        </Grid>
      </Grid>
      <Grid container spacing={1} justifyContent="center" style={{ textAlign: "center" }}>
        <Grid item xs={12}>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart
              width={500}
              height={200}
              data={articles}
              margin={{
                top: 50
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
          <Typography marginTop={3} marginBottom={7}>
            {graphsText}
          </Typography>
        </Grid>
      </Grid>
    </div>
  );
}
