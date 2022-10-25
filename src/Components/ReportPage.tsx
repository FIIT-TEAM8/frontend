import {
  Typography,
  Grid,
  Stack,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  AlertColor,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { APIResponse, Article, ArticleInReport } from "../Utils/Interfaces";
import useWindowSize from "../Utils/Screen";
import { useUser } from "../Utils/UserContext";
import { apiCall } from "../Utils/APIConnector";
import ReportItem from "./ReportItem";
import InfoSnackbar from "./InfoSnackbar";
import MainHeading from "./MainHeading";

export default function ReportPage() {
  const { width } = useWindowSize();
  const shouldCollapse = !!(width && width < 992);
  const { articlesInReport, removeArcticleReport } = useUser();
  const [articlesFromReport, setArticlesFromReport] = useState<Article[]>([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [isReportGenerating, setIsReportGenerating] = useState<boolean>(false);
  const [snackbarText, setSnackbarText] = useState<string>("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<AlertColor>("info");

  const searchDivStyle: { margin: string; padding: string } = {
    margin: "auto",
    padding: shouldCollapse ? "20px 7%" : "20px 20%",
  };

  let MainContent;

  const openSnackbar = (text: string, severity: AlertColor): void => {
    setSnackbarText(text);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  useEffect((): void => {
    const articlesIds: Array<string> = articlesInReport.map(
      (article: ArticleInReport) => article.id
    );
    if (articlesIds.length <= 0) {
      return;
    }
    apiCall(`/api/data/report?ids=[${articlesIds.join(", ")}]`, "GET").then(
      (result: APIResponse) => {
        if (result.ok && result.data && result.data.results) {
          setArticlesFromReport([...result.data.results]);
        } else {
          openSnackbar("Unable to get articles in report.", "error");
        }

        setIsLoaded(true);
      }
    );
  }, [articlesInReport]);

  const handleRemoveArticle = (index: number, articleId: string): void => {
    // NOTE: removeArticleReport shouldn't be optional in User interface,
    // but currently it isn't working otherwise...
    if (removeArcticleReport) {
      const currArticlesFromReport = [...articlesFromReport];
      currArticlesFromReport.splice(index, 1);
      removeArcticleReport(articleId);
      setArticlesFromReport(currArticlesFromReport);
      openSnackbar("Article was successfully removed from report.", "success");
    } else {
      openSnackbar("Unable to remove selected article from report.", "error");
    }
  };

  const handleSnackbarClose = (): void => {
    setSnackbarOpen(false);
  };

  const downloadPDF = async (): Promise<void> => {
    if (articlesInReport.length === 0) {
      openSnackbar(
        "Unable to generate PDF, because there are no articles in report.",
        "error"
      );
    }

    // display loading circle
    setIsReportGenerating(true);

    const articlesIds: Array<string> = articlesInReport.map(
      (article: ArticleInReport) => article.id
    );
    const articlesSearchTerms: Array<string | null> = articlesInReport.map(
      (article: ArticleInReport) => article.searchTerm
    );

    const downloadResult = await apiCall(
      `/api/report/download?ids=[${articlesIds.join(", ")}]`,
      "POST",
      {
        articlesIds,
        articlesSearchTerms,
      }
    )
      .then(async (result: APIResponse) => {
        if (!result.ok) {
          return false;
        }
        // https://stackoverflow.com/questions/63942715/how-to-download-a-readablestream-on-the-browser-that-has-been-returned-from-fetc
        const blob: Blob = await result.blobData.blob();
        const newBlob: Blob = new Blob([blob]);
        const blobUrl: string = window.URL.createObjectURL(newBlob);

        // creat element for downloading PDF download
        const link: HTMLAnchorElement = document.createElement("a");
        link.href = blobUrl;
        link.setAttribute("download", "report.pdf");
        document.body.appendChild(link);

        link.click(); // this triggers download

        // remove element, which was only used for download
        document.body.removeChild(link);

        // clean url and
        window.URL.revokeObjectURL(blobUrl);

        return true;
      })
      .catch((err) => {
        console.log(err);
        return false;
      });

    if (downloadResult) {
      openSnackbar("PDF was successfully downloaded.", "success");
    } else {
      openSnackbar("Unable to download PDF for created report.", "error");
    }

    setIsReportGenerating(false);
  };

  if (articlesInReport.length > 0 && isLoaded) {
    MainContent = (
      <>
        <Grid item xs={12} md={4} lg={2} textAlign="end">
          <Button
            fullWidth
            size="large"
            variant="contained"
            color="primary"
            onClick={downloadPDF}
          >
            Download
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Stack spacing={6} sx={{ pt: 4 }}>
            {articlesFromReport.map((article, index) => (
              <ReportItem
                article={article}
                index={index}
                handleRemoveArticle={handleRemoveArticle}
                articlesInReport={articlesInReport}
              />
            ))}
          </Stack>
        </Grid>
      </>
    );
  } else if (articlesInReport.length > 0 && !isLoaded) {
    MainContent = (
      <Grid item xs={12} textAlign="center">
        <CircularProgress size={50} thickness={2} color="secondary" />
      </Grid>
    );
  } else {
    MainContent = (
      <Grid item xs={12} textAlign="center">
        <Typography>PDF report is empty.</Typography>
      </Grid>
    );
  }

  return (
    <>
      <InfoSnackbar
        text={snackbarText}
        open={snackbarOpen}
        severity={snackbarSeverity}
        handleClose={handleSnackbarClose}
      />
      <Dialog open={isReportGenerating} sx={{ textAlign: "center" }}>
        <DialogTitle>We are generating PDF from your report...</DialogTitle>
        <DialogContent>
          <CircularProgress size={50} thickness={2} color="primary" />
        </DialogContent>
      </Dialog>
      {/* Main content of the page starts here */}
      <Grid
        container
        style={searchDivStyle}
        justifyContent="space-between"
        alignItems="center"
      >
        <Grid item xs={12} md={8}>
          <MainHeading text="pdf report" />
        </Grid>
        {MainContent}
      </Grid>
    </>
  );
}
