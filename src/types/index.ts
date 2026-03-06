export interface Submission {
  id: string;
  full_name: string;
  email: string;
  role: string;
  company: string | null;
  idea_title: string;
  idea_description: string;
  target_audience: string | null;
  business_model: string | null;
  referral_source: string | null;
  status:
    | "pending"
    | "reviewing"
    | "call_scheduled"
    | "selected"
    | "building"
    | "completed"
    | "declined";
  created_at: string;
}

export interface Project {
  id: string;
  submission_id: string;
  week_number: number;
  title: string;
  description: string;
  tech_stack: string[];
  github_url: string | null;
  demo_url: string | null;
  is_open_source: boolean;
  thumbnail_url: string | null;
  created_at: string;
}
