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

export type Regions = {
  [key: string]: string;
};

interface Data {
  results: Array<Article>;
  page_num: number;
  per_page: number;
  query: string;
  search_from: string;
  search_to: string;
  total_pages: number;
  total_results: number;
}

export interface ArticleInReport {
  id: string;
  title: string;
  searchTerm: string | null;
  timeAdded: string;
}

export interface APIResponse {
  ok?: boolean;
  data?: Data | Regions;
  blobData?: any; // check something for ReadableStream,
  reportId: number;
  articlesInReport: Array<ArticleInReport>;
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
