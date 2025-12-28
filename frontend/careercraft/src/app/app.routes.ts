import { Routes } from '@angular/router';

import { HomePage } from './pages/home.page';
import { CoverLetterPage } from './pages/cover-letter.page';
import { AtsScorePage } from './pages/ats-score.page';
import { HistoryPage } from './pages/history.page';
import { CareerAdvicePage } from './pages/career-advice.page';
import { InterviewQuestionsPage } from './pages/interview-questions.page';
import { JobFitPage } from './pages/job-fit.page';
import { ResumeParserPage } from './pages/resume-parser.page';
import { SkillGapPage } from './pages/skill-gap.page';
import { BulletImprovePage } from './pages/bullet-improve.page';
import { SkillRecommendPage } from './pages/skill-recommend.page';

export const routes: Routes = [
  { path: '', component: HomePage },

  { path: 'cover-letter', component: CoverLetterPage },
  { path: 'ats-score', component: AtsScorePage },
  { path: 'career-advice', component: CareerAdvicePage },
  { path: 'interview-questions', component: InterviewQuestionsPage },
  { path: 'job-fit', component: JobFitPage },
  { path: 'resume-parser', component: ResumeParserPage },
  { path: 'skill-gap', component: SkillGapPage },

  { path: 'improve-bullet', component: BulletImprovePage },
  { path: 'skill-recommendation', component: SkillRecommendPage },

  { path: 'history', component: HistoryPage },

  // Fallback
  { path: '**', redirectTo: '' }
];
