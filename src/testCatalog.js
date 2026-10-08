const { QUESTIONS } = require('./questions')
const { PROFESSIONAL_STYLE_QUESTIONS } = require('./professionalStyleQuestions')

function buildQuestion(id, text, primary, secondary) {
  return {
    id,
    text,
    options: [
      { label: 'Часто', value: { [primary]: 2, [secondary]: 1 } },
      { label: 'Иногда', value: { [primary]: 1 } },
      { label: 'Редко', value: { [primary]: 0 } },
      { label: 'Пропустить', value: {} },
    ],
  }
}

const COMMUNICATION_QUESTIONS = [
  buildQuestion('c1', 'Вам легко спокойно сказать, чего вы хотите?', 'assertiveness', 'reflection'),
  buildQuestion('c2', 'Вы стараетесь дослушать собеседника, даже если не согласны?', 'empathy', 'reflection'),
  buildQuestion('c3', 'Вам удаётся отказывать, когда просьба вам неудобна?', 'assertiveness', 'control'),
  buildQuestion('c4', 'Вы можете обсуждать разногласия без перехода на личности?', 'stability', 'empathy'),
  buildQuestion('c5', 'Вы уточняете, правильно ли поняли чувства или мысль собеседника?', 'empathy', 'reflection'),
  buildQuestion(
    'c6',
    'После недопонимания вы готовы вернуться к разговору и прояснить его?',
    'reflection',
    'assertiveness'
  ),
]

const STRESS_QUESTIONS = [
  buildQuestion('s1', 'Вы замечаете первые признаки усталости или напряжения?', 'stability', 'reflection'),
  buildQuestion('s2', 'Вам удаётся находить время на отдых до полного истощения?', 'stability', 'control'),
  buildQuestion('s3', 'Вы обращаетесь за поддержкой, когда она вам нужна?', 'empathy', 'assertiveness'),
  buildQuestion('s4', 'Вы разделяете то, что можете изменить, и то, что от вас не зависит?', 'control', 'reflection'),
  buildQuestion('s5', 'После сложного дня вам удаётся постепенно восстановить силы?', 'stability', 'control'),
  buildQuestion('s6', 'В напряжённый период вы сохраняете хотя бы базовый распорядок дня?', 'control', 'stability'),
]

const TESTS = [
  {
    id: 'anchor',
    title: 'Точка опоры',
    description: 'Самоконтроль, эмпатия и привычные способы принимать решения.',
    image: 'welcome',
    questions: QUESTIONS,
  },
  {
    id: 'communication',
    title: 'Стиль общения',
    description: 'Личные границы, умение слушать и говорить о разногласиях.',
    image: 'communication',
    questions: COMMUNICATION_QUESTIONS,
  },
  {
    id: 'stress',
    title: 'Ресурс и стресс',
    description: 'Как вы замечаете напряжение, восстанавливаетесь и просите поддержки.',
    image: 'reflection',
    questions: STRESS_QUESTIONS,
  },
  {
    id: 'professional-style',
    title: 'Стиль профессионального поведения',
    description:
      'Краткая самооценка ориентации на задачу и отношения. Это не тест пола, не диагноз и не оценка компетенции.',
    image: 'reflection',
    questions: PROFESSIONAL_STYLE_QUESTIONS,
  },
]

function getTestById(id) {
  return TESTS.find(test => test.id === id) || null
}

module.exports = {
  TESTS,
  getTestById,
}
