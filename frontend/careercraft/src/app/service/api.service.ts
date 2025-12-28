import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ApiService {

  private AI_BASE  = 'http://127.0.0.1:8000/ai';
  private LLM_BASE = 'http://127.0.0.1:8000/llm';

  constructor(private http: HttpClient) {}


  jobFit(payload: { resume: string; job_description: string }) {
    return this.http.post<any>(`${this.AI_BASE}/job-fit`, payload);
  }

  smartSkillGap(payload: { resume: string; job_description: string }) {
    return this.http.post<any>(`${this.AI_BASE}/smart-skill-gap`, payload);
  }

  recommendSkills(payload: { resume: string; job_description: string }) {
    return this.http.post<any>(`${this.AI_BASE}/recommend-skills`, payload);
  }

  atsScore(payload: { resume: string; job_description: string }) {
    return this.http.post<any>(`${this.AI_BASE}/ats-score`, payload);
  }

  parseResume(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<any>(
      `${this.AI_BASE}/parse-resume-advanced`,
      formData
    );
  }

  // ================= LLM ROUTES =================

  generateCoverLetter(payload: { resume: string; job_description: string }) {
    return this.http.post<any>(
      `${this.LLM_BASE}/cover-letter`,
      payload
    );
  }

  interviewQuestions(payload: { job_description: string }) {
    return this.http.post<any>(
      `${this.LLM_BASE}/interview-questions`,
      payload
    );
  }

  careerAdvice(payload: { resume: string; job_description: string }) {
    return this.http.post<any>(
      `${this.LLM_BASE}/career-advice`,
      payload
    );
  }

  improveBullet(payload: { text: string }) {
    return this.http.post<any>(
      `${this.LLM_BASE}/improve-bullet`,
      payload
    );
  }

  resumeStructure(payload: { text: string }) {
    return this.http.post<any>(
      `${this.LLM_BASE}/resume-structure`,
      payload
    );
  }
}
