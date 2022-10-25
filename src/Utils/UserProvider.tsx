import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { apiCall, getCookieToken, refreshToken } from "./APIConnector";
import { ArticleInReport, APIResponse, User } from "./Interfaces";
import { UserContext } from "./UserContext";

interface Props {
  children: React.ReactNode;
}

export default function UserProvider({ children }: Props) {
  // const [accessToken, setAccessToken] = useState(localStorage.getItem("access_token"));
  // user = {username: "", }
  const [user, setUser] = useState<User | undefined>(undefined);
  const [articlesInReport, setArticlesInReport] = useState<
    Array<ArticleInReport>
  >([]);
  const [reportId, setReportId] = useState<number>(0);

  const refresh = async () => {
    const loginRefToken = getCookieToken("__refToken");
    if (!loginRefToken) {
      setUser(undefined);
      return;
    }

    // TODO: this isn't very good I guess... FIX
    const loggedUser: User = {
      user,
      username: loginRefToken.username,
      id: loginRefToken.id,
      articlesInReport,
      reportId,
    };

    setUser(loggedUser);

    await refreshToken().then((ok) => {
      if (!ok) {
        setArticlesInReport([]);
        setReportId(0);
        setUser(undefined);
      }
    });
    console.log("Logged in via refToken");

    // use user id from loginRefToken
    await apiCall(`/api/report/${loginRefToken.id}?status=In Progress`, "GET")
      .then((result: APIResponse) => {
        if (result.ok) {
          console.log("PDF report was succesfully loaded.");
          setReportId(result.reportId);
          setArticlesInReport(result.articlesInReport);
        } else {
          console.log("Unable to load PDF report");
        }
      })
      .catch((err) => {
        console.log(err);
        console.log("Error while loading in progress report");
      });
  };

  useEffect(() => {
    refresh();
  }, []);

  // TODO: change from any
  const login = async (loginData: any): Promise<boolean> => {
    const isLogged = await apiCall("/api/user/login", "POST", loginData).then(
      (result: APIResponse) => {
        if (result.ok) {
          return true;
        }
        return false;
      }
    );

    if (isLogged) {
      // setUser({ username: loginData.username });
      await refresh();
      return true;
    }
    return false;
  };

  const logout = (): void => {
    apiCall("/api/user/logout", "POST")
      .then((result: APIResponse) => {
        if (result.ok) {
          setUser(undefined);
          setReportId(0);
          setArticlesInReport([]);
        }
      })
      .catch((err) => console.log(err));

    Cookies.remove("__authToken");
    Cookies.remove("__refToken");
  };

  const updateReportAPI = (
    newArticlesInReport: Array<ArticleInReport>
  ): void => {
    apiCall(`/api/report/update/${reportId}`, "POST", {
      articlesInReport: newArticlesInReport,
    })
      .then((result) => {
        if (result.ok) {
          console.log("Updated articles in PDF report");
        } else {
          console.log("Unable to update PDF report.");
        }
      })
      .catch((err) => console.log(err));
  };

  const reportRequest = (newArticlesInReport: Array<ArticleInReport>) => {
    if (reportId !== 0) {
      // update user's in progress report
      updateReportAPI(newArticlesInReport);
    } else if (user && typeof user.id === "number") {
      // create new user's 'In progress' report
      apiCall("/api/report/create", "POST", {
        userId: user.id,
        articlesInReport: newArticlesInReport,
      })
        .then((result: APIResponse) => {
          if (result.ok) {
            setReportId(result.reportId);
            console.log("Report successfully initialized");
          } else {
            console.log(
              "Report wasn't successfully initialized, because something went wrong during communication with server"
            );
          }
        })
        .catch((err) => {
          console.log(err);
          console.log("Error during report initialization");
        });
    }
  };

  const addArticleReport = (article: ArticleInReport): void => {
    setArticlesInReport((prevState) => {
      prevState.push(article);
      reportRequest(prevState);
      return prevState;
    });
  };

  const removeArcticleReport = (articleId: string): void => {
    setArticlesInReport((prevState) => {
      const articleIndex = prevState.findIndex(
        (article) => article.id === articleId
      );

      // don't change state, when article isn't in it
      if (articleIndex !== -1) {
        prevState.splice(articleIndex, 1);
        reportRequest(prevState);
      }

      return prevState;
    });
  };

  // TODO: change from any
  const signup = async (signupData: any): Promise<boolean> => {
    const isSignedup = await apiCall(
      "/api/user/signup",
      "POST",
      signupData
    ).then((result) => {
      if (result.ok) {
        return true;
      }
      return false;
    });

    if (isSignedup) {
      // setUser({ username: signupData.username });
      await refresh();
      return true;
    }
    return false;
  };

  return (
    <UserContext.Provider
      value={{
        user,
        login,
        logout,
        signup,
        articlesInReport,
        addArticleReport,
        removeArcticleReport,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
