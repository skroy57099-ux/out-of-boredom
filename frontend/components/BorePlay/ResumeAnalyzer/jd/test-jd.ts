import {
  parseJobDescription,
} from "./jd-parser";

const jd = `
Data Analyst

Company: Example Analytics

Responsibilities
- Analyze business data and generate reports
- Build dashboards using Power BI
- Work with stakeholders to identify trends

Required Qualifications
- Strong SQL skills
- Python experience
- Experience with Power BI
- Knowledge of data analysis

Preferred Qualifications
- Tableau experience
- Experience with cloud platforms

Education
- Bachelor's degree in Computer Science, Statistics, Mathematics, or related field

Experience
- 2+ years of experience in data analytics
`;

const result =
  parseJobDescription(jd);

console.log(
  JSON.stringify(
    result,
    null,
    2,
  ),
);