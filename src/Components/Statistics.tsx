import { Grid } from "@mui/material";
import React from "react";
import {
  Tooltip, ResponsiveContainer, XAxis, YAxis,
  LineChart, Line, CartesianGrid, BarChart, Bar, Legend
} from "recharts";
import RegionsPieChart from "./StatisticsPieChart";

export default function Statistics() {
  const articles = [
    { year: "2016", articles: 20 },
    { year: "2017", articles: 35 },
    { year: "2018", articles: 12 },
    { year: "2019", articles: 28 },
    { year: "2020", articles: 15 },
    { year: "2021", articles: 45 },
    { year: "2022", articles: 67 },
  ];
  const topCrimes = [
    { crime: "assault", number: 20 },
    { crime: "money laundering", number: 35 },
    { crime: "murder", number: 12 },
    { crime: "terrorism", number: 28 },
    { crime: "hijacking", number: 15 },
    { crime: "human trafficing", number: 45 },
    { crime: "arsony", number: 10 },
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

  // const chartsStyle = {
  //   textAlign: "center"
  // }
  //  const regions = [
  //    { name: "gb", number: 20 },
  //    { name: 'de', number: 35 },
  //    { name: 'fr', number: 12 },
  //    { name: 'it', number: 28},
  //    { name: 'hu', number: 15 },
  //    { name: 'pl', number: 45 },
  //    { name: 'cz', number: 10 },
  //  ]
  //  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  //  const RADIAN = Math.PI / 180;
  //  const renderCustomizedLabel = ({
  //   cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
  //    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  //    const x = cx + radius * Math.cos(-midAngle * RADIAN);
  //    const y = cy + radius * Math.sin(-midAngle * RADIAN);
  //    return (
  //      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'}
  //  dominantBaseline="central">
  //        {`${(percent * 100).toFixed(0)}%`}
  //      </text>
  //    );
  //  };
  return (
    <div className="main">
      <h1>Graph statistics</h1>
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
          {/* <ResponsiveContainer className="languagesChart" width="100%" height={270}>
            <BarChart
              width={200}
              height={300}
              data={languages}
              margin={{
                top: 5,
                bottom: 5,
              }}
            >
              <XAxis dataKey="language" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="number" fill="#0090A4" />
            </BarChart>
          </ResponsiveContainer> */}
          <RegionsPieChart />
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
