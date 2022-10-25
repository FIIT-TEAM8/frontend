import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Box,
  LinearProgress,
  Stack,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import { format } from "date-fns";
import DOMPurify from "dompurify";
import { apiCall } from "../Utils/APIConnector";
import useWindowSize from "../Utils/Screen";
import MainHeading from "./MainHeading";

const defaultOptions = {
  ALLOWED_TAGS: [
    "b",
    "i",
    "em",
    "strong",
    "a",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "p",
    "span",
  ],
  ALLOWED_ATTR: ["href"],
};

const sanitize = (dirty, options) => ({
  __html: DOMPurify.sanitize(dirty, { ...defaultOptions, ...options }),
});

function SanitizedHTML({ html, options }) {
  return <div dangerouslySetInnerHTML={sanitize(html, options)} />;
}

export function ArchivedArticle({ url = "", displayArticle = undefined }) {
  const [article, setArticle] = useState({
    title: "",
    html: "",
    keywords: [],
    published: "Mon, 04 Jan 2016 08:00:00 GMT",
    region: "",
    link: "",
  });
  const [isLoading, setIsloading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    if (displayArticle) {
      setArticle(displayArticle);
      return;
    }
    if (!url) return;

    setLoadingProgress(0);
    setIsloading(true);

    apiCall(`/api/archive/search?link=${url}`).then((result) => {
      if (result.ok) {
        setTimeout(() => setLoadingProgress(100), 100);
        setIsloading(false);
        setArticle(result.data);
        console.log(result.data);
      } else {
        setTimeout(() => setLoadingProgress(2), 500);
        setError(result.msg);
      }
    });
  }, [url, displayArticle]);

  if (error) {
    return (
      <Box sx={{ width: "100%" }}>
        <LinearProgress
          variant="determinate"
          value={loadingProgress}
          color="error"
        />
        <Typography paragraph color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%" }}>
      <LinearProgress
        variant={isLoading ? "indeterminate" : "determinate"}
        value={loadingProgress}
      />
      <Typography
        variant="caption"
        color="secondary"
        style={{ padding: "20px 0" }}
      >
        Published
        {" "}
        {format(new Date(article.published), "yyyy/MM/dd")}
        {" "}
        in
        {" "}
        {article.region.toUpperCase()}
      </Typography>
      <Typography variant="h3" color="primary" style={{ padding: "20px 0" }}>
        <a href={article.link}>{article.title}</a>
      </Typography>

      <Stack direction="row" color="secondary" spacing={2}>
        {article.keywords.map((crime) => (
          <Box
            key={crime}
            sx={{
              pl: 0.7,
              pr: 0.7,
              borderRadius: 1.5,
            }}
            bgcolor="#e6e7eb"
          >
            <Typography color="secondary">{crime}</Typography>
          </Box>
        ))}
      </Stack>

      <Typography paragraph color="secondary" style={{ padding: "20px 0" }}>
        <SanitizedHTML html={article.html} options={{}} />
      </Typography>
    </Box>
  );
}

export default function Archive() {
  const { width } = useWindowSize();
  const shouldCollapse = width < 992;

  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");

  const searchDivStyle = {
    margin: "auto",
    padding: shouldCollapse ? "50px 7%" : "50px 20%",
  };

  useEffect(() => {
    setSearchTerm(searchParams.get("link"));
  }, []);

  const onSubmit = (event) => {
    event.preventDefault();
    // @ts-ignore
    document.activeElement.blur(); // remove focus from the text field
    searchParams.delete("link");
    searchParams.append("link", searchTerm);
    setSearchParams(searchParams);
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  return (
    <div style={searchDivStyle}>
      <form onSubmit={onSubmit}>
        <MainHeading text="ams archive" />
        <TextField
          sx={{ mt: 2 }}
          id="outlined-search"
          color="secondary"
          value={searchTerm}
          // helperText={"Search for an archived URL"}
          label="Search URL"
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
      <ArchivedArticle url={searchParams.get("link")} />
    </div>
  );
}
