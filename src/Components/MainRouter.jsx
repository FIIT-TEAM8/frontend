import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import SearchResults from "./SearchResults";
import Statistics from "./Statistics";
import TitleSearch from "./TitleSearch";
import Login from "./Login";
import Archive from "./Archive";
import ReportPage from "./ReportPage";
import { useUser } from "../Utils/UserContext";
import AboutPage from "./AboutPage/AboutPage";

export default function MainRouter() {
  const { user } = useUser();

  return (
    <Routes>
      <Route path="" element={<TitleSearch />}>
        <Route path="stats" element={<Statistics />} />
        <Route path="results" element={<SearchResults />} />
      </Route>
      <Route path="archive" element={<Archive />} />
      <Route path="about" element={<AboutPage />} />
      {/* TODO: ADD PROPER ON CLOSE */}
      <Route path="login" element={<Login isOpen />} />
      {user ? (
        <Route path="pdf_report" element={<ReportPage />} />
      ) : (
        <Route path="pdf_report" element={<Navigate to="/search" />} />
      )}
    </Routes>
  );
}
