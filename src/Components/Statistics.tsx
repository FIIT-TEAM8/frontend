import { Grid, Button, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";
import {
  Tooltip, ResponsiveContainer, XAxis, YAxis,
  LineChart, Line, CartesianGrid, BarChart, Bar, Legend
} from "recharts";
import { useSearchParams } from "react-router-dom";
import { apiCall } from "../Utils/APIConnector";
import RegionsPieChart from "./StatisticsPieChart";

export default function Statistics() {
  const [searchParams] = useSearchParams();
  // const [actResults, setActResults] = useState([]);
  // const [isLoaded, setIsLoaded] = useState(false);
  // const [lastSearched, setLastSearched] = useState("null");
  const [articles, setArticles] = useState(0 as any);
  const [topCrimes, setTopCrimes] = useState({} as any);
  const [regions] = useState([
    { name: "Great Britain", number: 20 }
  ]);
  const [query, setQuery] = useState("" as any);

  useEffect(() => {
    // setIsLoaded(false);

    // const q = searchParams.get("q");
    // if (q !== lastSearched) {
    //   setLastSearched(q);
    // }

    setQuery(searchParams.get("q"));

    apiCall(`/stats/api/search?${searchParams.toString()}`, "GET").then(
      (result) => {
        if (result.ok) {
          setArticles(result.data?.stats.articlesCount);
          setTopCrimes(result.data?.stats.stats.articlesByCrime);
          // setIsLoaded(true);
        }
      }
    );
  }, [searchParams]);

  // const articles = [
  //   { year: "2016", articles: 20 },
  //   { year: "2017", articles: 35 },
  //   { year: "2018", articles: 12 },
  //   { year: "2019", articles: 28 },
  //   { year: "2020", articles: 15 },
  //   { year: "2021", articles: 45 },
  //   { year: "2022", articles: 67 },
  // ];
  // const topCrimes = [
  //   { crime: "assault", number: 20 },
  //   { crime: "money laundering", number: 35 },
  //   { crime: "murder", number: 12 },
  //   { crime: "terrorism", number: 28 },
  //   { crime: "hijacking", number: 15 },
  //   { crime: "human trafficing", number: 45 },
  //   { crime: "arsony", number: 10 },
  // ];
  // const languages = [
  //   { language: "english", number: 20 },
  //   { language: "italian", number: 35 },
  //   { language: "romanian", number: 12 },
  //   { language: "czech", number: 28 },
  //   { language: "german", number: 15 },
  //   { language: "polish", number: 45 },
  //   { language: "spanish", number: 10 },
  // ];

  const statsText = "statistics for: ";

  console.log("hahahaha ", regions);

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
      <Grid container spacing={1} style={{ textAlign: "center" }}>
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
              <YAxis type="category" dataKey="crime" />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Legend />
              <Bar dataKey="number" name="number of crimes" fill="#7163B4" />
            </BarChart>
          </ResponsiveContainer>
        </Grid>

        <Grid item xs={6}>
          <RegionsPieChart regions={regions} />
        </Grid>
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
      </Grid>
    </div>
  );
}
