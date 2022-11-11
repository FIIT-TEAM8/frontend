// import { Regions } from "../Components/AdvancedSearch-handler";

/* eslint-disable no-unused-vars */
export interface Article {
  _id: string;
  html: string;
  keywords: Array<string>;
  language: string;
  link: string;
  published: string;
  region: string;
  title: string;
}

interface StatsData {
  articlesCount: number;
  query: string;
  stats: {
    articlesByCrime: {};
    articlesByDate: {};
    articlesByLanguage: {};
    articlesByRegion: {};
  };
}

export type Regions = {
  [key: string]: string;
};

export interface ArticleInReport {
  id: string;
  title: string;
  searchTerm: string | null;
  timeAdded: string;
}

interface Data {
  results: Array<Article>;
  stats: StatsData;
  reportId: number;
  articlesInReport: Array<ArticleInReport>;
}

export interface APIResponse {
  ok?: boolean;
  data?: Data | Regions;
  blobData?: any; // check something for ReadableStream,
  status: any;
}

export type AdvSearchItems = {
  from: {
    value: string;
    defaultValue: string;
  };
  to: {
    value: string;
    defaultValue: string;
  };
  regions: Array<string>;
  keywords: Array<string>;
};

type RemoveArcticleReport = (articleId: string) => void;
type AddArticleReport = (article: ArticleInReport) => void;
type Login = (loginData: any) => void;
type Logout = () => void;
type SignUp = (signupData: any) => Promise<boolean>;

// should be refactored...
export interface User {
  user: User | undefined;
  id?: string;
  username?: any;
  articlesInReport: Array<ArticleInReport>;
  reportId?: number;
  removeArcticleReport?: RemoveArcticleReport;
  addArticleReport?: AddArticleReport;
  login?: Login;
  logout?: Logout;
  signup?: SignUp;
}
