export const COURSES = {
  'INFO 490': { color: '#dc3545', bg: '#fce4e4' },
  'INFO 356': { color: '#c9860a', bg: '#fef3d7' },
  'INFO 464': { color: '#2471a3', bg: '#ddeef9' },
}

export const WEEK = [
  { date: 2, day: 'MON' },
  { date: 3, day: 'TUE' },
  { date: 4, day: 'WED' },
  { date: 5, day: 'THU' },
  { date: 6, day: 'FRI' },
]

export const TASKS = [
  // MONDAY
  {
    id: 1,
    title: 'Reading Annotations: Marxist Analysis',
    course: 'INFO 490',
    dayIndex: 0,
    description:
      'Write at least one annotation per assigned reading (4 total) and two replies, starting with "(No) Ethical Design Under Capitalism."',
    dueDate: 'Sunday February 1st, 2026, 11:59',
    summary:
      'Write at least one annotation per assigned reading (4 total) and two replies, starting with "(No) Ethical Design Under Capitalism."',
    readings: [
      { text: '(No) Ethical Design Under Capitalism', subitems: [] },
      {
        text: 'Automation and the Future of Work:',
        subitems: ['The Automation Discourse', 'Global Labor Market Dynamics'],
      },
    ],
    boldNote: 'At least one annotation per reading. 4 annotations/2 replies overall.',
    note: 'I recommend starting with (No) Ethical Design Under Capitalism',
    hasGuidelinesLink: true,
    submissionType: 'None',
  },
  {
    id: 2,
    title: 'Automation and Labor Futures',
    course: 'INFO 490',
    dayIndex: 0,
    description:
      'Examine how automation is reshaping work and the ethical considerations that emerges.',
    dueDate: 'Monday February 2nd, 2026, 23:59',
    summary:
      'Examine how automation is reshaping work and the ethical considerations that emerge in modern labor markets.',
    readings: [],
    boldNote: '',
    note: '',
    hasGuidelinesLink: false,
    submissionType: 'Online Upload',
  },
  {
    id: 3,
    title: 'Global Labor Dynamics Report',
    course: 'INFO 464',
    dayIndex: 0,
    description:
      'Summarize key trends in the global labor market and their social and economic impacts.',
    dueDate: 'Monday February 2nd, 2026, 23:59',
    summary:
      'Summarize key trends in the global labor market and their social and economic impacts.',
    readings: [],
    boldNote: '',
    note: '',
    hasGuidelinesLink: false,
    submissionType: 'Online Upload',
  },

  // TUESDAY
  {
    id: 4,
    title: 'Critical Reading Annotation',
    course: 'INFO 490',
    dayIndex: 1,
    description:
      'Provide thoughtful annotations for each assigned reading, highlighting key ideas and your refl...',
    dueDate: 'Tuesday February 3rd, 2026, 23:59',
    summary:
      'Provide thoughtful annotations for each assigned reading, highlighting key ideas and your reflections.',
    readings: [],
    boldNote: '',
    note: '',
    hasGuidelinesLink: false,
    submissionType: 'Online Upload',
  },
  {
    id: 5,
    title: 'Automation Discourse Reflection',
    course: 'INFO 490',
    dayIndex: 1,
    description:
      'Reflect on the debates surrounding automation, including benefits, risks, and ethical dilemmas.',
    dueDate: 'Tuesday February 3rd, 2026, 23:59',
    summary:
      'Reflect on the debates surrounding automation, including benefits, risks, and ethical dilemmas.',
    readings: [],
    boldNote: '',
    note: '',
    hasGuidelinesLink: false,
    submissionType: 'Online Upload',
  },
  {
    id: 6,
    title: 'Comparative Labor Analysis',
    course: 'INFO 490',
    dayIndex: 1,
    description:
      'Compare labor market trends across different countries and discuss implications for workers.',
    dueDate: 'Tuesday February 3rd, 2026, 23:59',
    summary:
      'Compare labor market trends across different countries and discuss implications for workers.',
    readings: [],
    boldNote: '',
    note: '',
    hasGuidelinesLink: false,
    submissionType: 'Online Upload',
  },
  {
    id: 7,
    title: 'Capitalism and Ethics Debate',
    course: 'INFO 356',
    dayIndex: 1,
    description:
      'Critically evaluate whether ethical design can exist under capitalist constraints.',
    dueDate: 'Tuesday February 3rd, 2026, 23:59',
    summary:
      'Critically evaluate whether ethical design can exist under capitalist constraints.',
    readings: [],
    boldNote: '',
    note: '',
    hasGuidelinesLink: false,
    submissionType: 'Presentation',
  },
  {
    id: 8,
    title: 'Global Work Trends Summary',
    course: 'INFO 356',
    dayIndex: 1,
    description:
      'Summarize trends and insights from the readings on global labor markets and automation.',
    dueDate: 'Tuesday February 3rd, 2026, 23:59',
    summary:
      'Summarize trends and insights from the readings on global labor markets and automation.',
    readings: [],
    boldNote: '',
    note: '',
    hasGuidelinesLink: false,
    submissionType: 'Online Upload',
  },

  // WEDNESDAY
  {
    id: 9,
    title: 'Annotated Reading Portfolio',
    course: 'INFO 356',
    dayIndex: 2,
    description:
      'Compile all reading annotations with personal insights and discussion questions for each.',
    dueDate: 'Wednesday February 4th, 2026, 23:59',
    summary:
      'Compile all reading annotations with personal insights and discussion questions for each.',
    readings: [],
    boldNote: '',
    note: '',
    hasGuidelinesLink: false,
    submissionType: 'Online Upload',
  },
  {
    id: 10,
    title: 'Technology and Work Mini-Essay',
    course: 'INFO 356',
    dayIndex: 2,
    description:
      'Write a short essay connecting automation technology to changing labor conditions.',
    dueDate: 'Wednesday February 4th, 2026, 23:59',
    summary:
      'Write a short essay connecting automation technology to changing labor conditions.',
    readings: [],
    boldNote: '',
    note: '',
    hasGuidelinesLink: false,
    submissionType: 'Online Upload',
  },
  {
    id: 11,
    title: 'Discussion Replies Assignment',
    course: 'INFO 464',
    dayIndex: 2,
    description:
      "Craft two thoughtful replies to classmates' annotations or reflections on the readings.",
    dueDate: 'Wednesday February 4th, 2026, 23:59',
    summary:
      "Craft two thoughtful replies to classmates' annotations or reflections on the readings.",
    readings: [],
    boldNote: '',
    note: '',
    hasGuidelinesLink: false,
    submissionType: 'Online Upload',
  },
  {
    id: 12,
    title: 'Reading Response Journal',
    course: 'INFO 464',
    dayIndex: 2,
    description: null,
    dueDate: 'Wednesday February 4th, 2026, 23:59',
    summary: null,
    readings: [],
    boldNote: '',
    note: '',
    hasGuidelinesLink: false,
    submissionType: 'Online Upload',
  },
]
