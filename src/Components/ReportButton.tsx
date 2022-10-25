import IconButton from "@mui/material/IconButton";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { AlertColor, Tooltip } from "@mui/material";
import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import InfoSnackbar from "./InfoSnackbar";
import { useUser } from "../Utils/UserContext";

interface Props {
  articleId: string;
  articleTitle: string;
}

export default function ReportButton({ articleId, articleTitle }: Props) {
  const { articlesInReport, addArticleReport, removeArcticleReport } = useUser();
  const [isInReport, setIsInReport] = useState<boolean>(
    articlesInReport.some((article) => article.id === articleId)
  );
  const [searchParams] = useSearchParams();
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarText, setSnackbarText] = useState<string>("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<AlertColor>("info");
  const buttonSize = "small";
  const iconSize = "medium";

  const openSnackbar = (text: string, severity: AlertColor): void => {
    setSnackbarOpen(false);
    setSnackbarText(text);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleAddArticle = (
    selectedArticleId: string,
    selectedArticleTitle: string
  ): void => {
    if (addArticleReport) {
      addArticleReport({
        id: selectedArticleId,
        searchTerm: searchParams.get("q"),
        title: selectedArticleTitle,
        timeAdded: new Date().toLocaleString(), // example: Tue, 05 Apr 2022 06:30:57 GMT
      });
      setIsInReport(true);
      openSnackbar("Article was added to report!", "success");
    }
  };

  const handleRemoveArticle = (selectedArticleId: string): void => {
    if (removeArcticleReport) {
      removeArcticleReport(selectedArticleId);
      setIsInReport(false);
      openSnackbar("Article was removed from report!", "success");
    }
  };

  const handleSnackbarClose = (): void => {
    setSnackbarOpen(false);
  };

  // if user doesn't have this article in report, allow him to add it
  // otherwise allow him to remove article from report
  return (
    <>
      <InfoSnackbar
        text={snackbarText}
        open={snackbarOpen}
        severity={snackbarSeverity}
        handleClose={handleSnackbarClose}
      />
      {isInReport ? (
        <Tooltip
          title="Remove from PDF report"
          placement="top"
          TransitionProps={{ timeout: 500 }}
          arrow
        >
          <IconButton
            size={buttonSize}
            aria-label="Remove from PDF report"
            onClick={() => handleRemoveArticle(articleId)}
            sx={{
              padding: 0,
            }}
          >
            <CheckCircleIcon fontSize={iconSize} />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip
          title="Add to PDF report"
          placement="top"
          TransitionProps={{ timeout: 500 }}
          arrow
        >
          <IconButton
            size={buttonSize}
            aria-label="Add to PDF report"
            onClick={() => handleAddArticle(articleId, articleTitle)}
            sx={{
              padding: 0,
            }}
          >
            <AddCircleOutlineIcon fontSize={iconSize} />
          </IconButton>
        </Tooltip>
      )}
    </>
  );
}
