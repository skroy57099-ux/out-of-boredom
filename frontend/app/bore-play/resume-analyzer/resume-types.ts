export interface ResumeTextItem {
  text: string;
  x: number;
  y: number;
  fontSize: number;
  page: number;
  width: number;
  height: number;
}

export interface ResumeLine {
  text: string;
  page: number;
  x: number;
  y: number;
  fontSize: number;
  items: ResumeTextItem[];
}

export interface ResumeBlock {
  lines: ResumeLine[];
  startPage: number;
  endPage: number;
}