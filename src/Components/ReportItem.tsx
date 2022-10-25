import DeleteIcon from "@mui/icons-material/Delete";
import {
  Typography,
  Grid,
  Stack,
  IconButton,
  Link,
  Box,
  Divider,
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
} from "@mui/material";
import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Article, ArticleInReport } from "../Utils/Interfaces";
import theme from "../Style/Theme";

interface Props {
  article: Article;
  index: number;
  articlesInReport: Array<ArticleInReport>;
  handleRemoveArticle: CallableFunction;
}

export default function ReportItem({
  article,
  index,
  articlesInReport,
  handleRemoveArticle,
}: Props) {
  const [showDialog, setShowDialog] = useState<boolean>(false);

  const handleCloseDialog = (): void => {
    setShowDialog(false);
  };

  const handleOpenDialog = (): void => {
    setShowDialog(true);
  };

  const handleConfirmRemove = (): void => {
    handleRemoveArticle(index, article._id);
    setShowDialog(false);
  };

  return (
    <>
      <Dialog open={showDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          Do you really want to remove article from PDF report?
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleConfirmRemove} sx={{ border: 1 }}>
            Yes
          </Button>
          <Button onClick={handleCloseDialog} variant="contained">
            No
          </Button>
        </DialogActions>
      </Dialog>
      <Grid container key={index}>
        <Grid item xs={11.5} md={11.6} lg={11.7}>
          <Stack spacing={1}>
            <Typography noWrap variant="h6" color="secondary">
              Found by term:
              {" "}
              <strong>{articlesInReport[index].searchTerm}</strong>
            </Typography>
            <Stack
              direction="row"
              divider={(
                <Divider
                  sx={{ borderRightWidth: 0.5 }}
                  style={{ background: "#757575" }}
                  orientation="vertical"
                  flexItem
                />
              )}
              spacing={2}
            >
              <Box>
                <Typography noWrap color="secondary">
                  {article.published.slice(5, -13)}
                </Typography>
              </Box>
              <Link
                href={article.link}
                target="_blank"
                rel="noopener"
                underline="none"
                noWrap
              >
                <Typography noWrap color="secondary">
                  {new URL(article.link).hostname.replace("www.", "")}
                </Typography>
              </Link>
              <RouterLink to={`/archive?link=${article.link}`}>
                <Typography noWrap color="secondary">
                  Archived Article
                </Typography>
              </RouterLink>
            </Stack>
            <Link
              href={article.link}
              style={{ color: theme.palette.primary.main }}
              target="_blank"
              rel="noopener"
              underline="hover"
            >
              <Typography variant="h2" color="primary">
                {article.title}
              </Typography>
            </Link>
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
          </Stack>
        </Grid>
        <Grid item xs={0.5} md={0.4} lg={0.3} textAlign="end">
          <IconButton
            size="small"
            onClick={handleOpenDialog}
            sx={{ padding: 0.2 }}
          >
            <DeleteIcon fontSize="medium" />
          </IconButton>
        </Grid>
      </Grid>
    </>
  );
}

// const ReportItem: React.FC<Props> = ({
//   article, index, articlesInReport, handleRemoveArticle,
// }) => {

// };

// export default ReportItem;
