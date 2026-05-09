export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Topic {
  _id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  order: number;
  problemCount: number;
}

export interface Problem {
  _id: string;
  title: string;
  topicId: string;
  difficulty: "Easy" | "Medium" | "Hard";
  leetcodeUrl: string;
  youtubeUrl: string;
  articleUrl?: string;
  order: number;
}
