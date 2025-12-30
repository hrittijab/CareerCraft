import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home.page').then(m => m.HomePage)
  },

  {
    path: 'cover-letter',
    loadComponent: () =>
      import('./pages/cover-letter.page').then(m => m.CoverLetterPage)
  },

  {
    path: 'ats-score',
    loadComponent: () =>
      import('./pages/ats-score.page').then(m => m.AtsScorePage)
  },

  {
    path: 'career-advice',
    loadComponent: () =>
      import('./pages/career-advice.page').then(m => m.CareerAdvicePage)
  },

  {
    path: 'interview-questions',
    loadComponent: () =>
      import('./pages/interview-questions.page').then(m => m.InterviewQuestionsPage)
  },

  {
    path: 'job-fit',
    loadComponent: () =>
      import('./pages/job-fit.page').then(m => m.JobFitPage)
  },

  {
    path: 'resume-parser',
    loadComponent: () =>
      import('./pages/resume-parser.page').then(m => m.ResumeParserPage)
  },

  {
    path: 'skill-gap',
    loadComponent: () =>
      import('./pages/skill-gap.page').then(m => m.SkillGapPage)
  },

  {
    path: 'improve-bullet',
    loadComponent: () =>
      import('./pages/bullet-improve.page').then(m => m.BulletImprovePage)
  },

  {
    path: 'skill-recommendation',
    loadComponent: () =>
      import('./pages/skill-recommend.page').then(m => m.SkillRecommendPage)
  },

  {
    path: 'history',
    loadComponent: () =>
      import('./pages/history.page').then(m => m.HistoryPage)
  },

  { path: '**', redirectTo: '' }
];
