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
    articlesByCrime: {},
    articlesByDate: {},
    articlesByLanguage: {},
    articlesByRegion: {}
  };
}

// {
//   "articles_count": 27,
//   "query": "Marian Kocner",
//   "search_from": "",
//   "search_to": "",
//   "stats": {
//       "articles_by_crime": {
//           "Antitrust": [
//               "6240f3e3fcf239665d512756",
//               "62709aceabf5bf8856f1a62f"
//           ],
//           "Assault": [],
//           ...
//       },
//       "articles_by_date": {
//           "623ea8294f6d0b2df2d43670": "2018-10-08",
//           "624093593f41c127d0432af1": "2018-02-27",
//           ...
//       },
//       "articles_by_language": {
//           "cs": [
//               "624b1ade431fce169efa1159",
//               "623ea8294f6d0b2df2d43670"
//           ],
//           "it": [],
//           "sk": []
//       },
//       "articles_by_region": {
//           "cz": [
//               "624b1ade431fce169efa1159",
//               "623ea8294f6d0b2df2d43670"
//           ],
//           "it": [],
//           "sk": []
//       }
//   },
//   "total_results": 27
// }

interface Data {
  results: Array<Article>;
  stats: StatsData;
}

export interface ArticleInReport {
  id: string;
  title: string;
  searchTerm: string | null;
  timeAdded: string;
}

export interface APIResponse {
  ok?: boolean;
  data?: Data;
  blobData?: any; // check something for ReadableStream,
  reportId: number;
  articlesInReport: Array<ArticleInReport>;
  status: any;
}

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
