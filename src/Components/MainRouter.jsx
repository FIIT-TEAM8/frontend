import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import SearchResults from "./SearchResults";
import TitleSearch from "./TitleSearch";
import Login from "./Login";
import Archive from "./Archive";
import ReportPage from "./ReportPage";
import { useUser } from "../Utils/UserContext";
import AboutPage from "./AboutPage";

export default function MainRouter() {
  const { user } = useUser();

  return (
    <Routes>
      <Route path="" element={<Navigate to="search" />} />
      <Route path="search" element={<TitleSearch />}>
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
