const QUESTION_MAP = {
  yes: { score: 2 },
  no: { score: 0 },
  unsure: { score: 1 },
  skip: { score: 0 },
}

const QUESTIONS = [
  {
    id: 'q1',
    text: '1) Часто ли вы замечаете, что в конфликте начинаете контролировать ситуацию, даже если это вызывает напряжение?',
    options: [
      { label: 'Да', value: { control: QUESTION_MAP.yes.score, stability: 1 } },
      { label: 'Нет', value: { control: QUESTION_MAP.no.score, empathy: 1 } },
      { label: 'Сомневаюсь', value: { control: QUESTION_MAP.unsure.score } },
      { label: 'Пропустить', value: {} },
    ],
  },
  {
    id: 'q2',
    text: '2) Вы обычно чувствительны к настроению других людей и легко замечаете, когда им плохо?',
    options: [
      { label: 'Да', value: { empathy: QUESTION_MAP.yes.score, stability: 1 } },
      { label: 'Нет', value: { empathy: QUESTION_MAP.no.score, assertiveness: 1 } },
      { label: 'Сомневаюсь', value: { empathy: QUESTION_MAP.unsure.score } },
      { label: 'Пропустить', value: {} },
    ],
  },
  {
    id: 'q3',
    text: '3) Вам обычно проще принять решение, когда вы чувствуете внутреннюю уверенность, чем когда ждёте идеальных условий?',
    options: [
      { label: 'Да', value: { assertiveness: QUESTION_MAP.yes.score, control: 1 } },
      { label: 'Нет', value: { assertiveness: QUESTION_MAP.no.score, reflection: 1 } },
      { label: 'Сомневаюсь', value: { assertiveness: QUESTION_MAP.unsure.score } },
      { label: 'Пропустить', value: {} },
    ],
  },
  {
    id: 'q4',
    text: '4) Часто ли вы долго анализируете свои ошибки и стараетесь извлечь из них урок?',
    options: [
      { label: 'Да', value: { reflection: QUESTION_MAP.yes.score, control: 1 } },
      { label: 'Нет', value: { reflection: QUESTION_MAP.no.score, stability: 1 } },
      { label: 'Сомневаюсь', value: { reflection: QUESTION_MAP.unsure.score } },
      { label: 'Пропустить', value: {} },
    ],
  },
  {
    id: 'q5',
    text: '5) Вы обычно легче переживаете стресс, когда вокруг спокойная и гармоничная обстановка?',
    options: [
      { label: 'Да', value: { stability: QUESTION_MAP.yes.score, empathy: 1 } },
      { label: 'Нет', value: { stability: QUESTION_MAP.no.score, assertiveness: 1 } },
      { label: 'Сомневаюсь', value: { stability: QUESTION_MAP.unsure.score } },
      { label: 'Пропустить', value: {} },
    ],
  },
  {
    id: 'q6',
    text: '6) Вы часто ощущаете, что понимаете не только себя, но и состояние людей рядом?',
    options: [
      { label: 'Да', value: { empathy: QUESTION_MAP.yes.score, stability: 1 } },
      { label: 'Нет', value: { empathy: QUESTION_MAP.no.score, control: 1 } },
      { label: 'Сомневаюсь', value: { empathy: QUESTION_MAP.unsure.score } },
      { label: 'Пропустить', value: {} },
    ],
  },
  {
    id: 'q7',
    text: '7) Вам важно, чтобы решения были продуманными и логически обоснованными?',
    options: [
      { label: 'Да', value: { control: QUESTION_MAP.yes.score, reflection: 1 } },
      { label: 'Нет', value: { control: QUESTION_MAP.no.score, assertiveness: 1 } },
      { label: 'Сомневаюсь', value: { control: QUESTION_MAP.unsure.score } },
      { label: 'Пропустить', value: {} },
    ],
  },
  {
    id: 'q8',
    text: '8) Вы часто замечаете, что внутреннее состояние влияет на принятие решений сильнее, чем логика?',
    options: [
      { label: 'Да', value: { stability: QUESTION_MAP.yes.score, empathy: 1 } },
      { label: 'Нет', value: { stability: QUESTION_MAP.no.score, control: 1 } },
      { label: 'Сомневаюсь', value: { stability: QUESTION_MAP.unsure.score } },
      { label: 'Пропустить', value: {} },
    ],
  },
]

module.exports = {
  QUESTIONS,
}
