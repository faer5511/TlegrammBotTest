const QUESTIONS = [
  {
    id: 'q1',
    text: '1) В конфликтной ситуации вы в первую очередь:',
    options: [
      {
        label: 'Сохраняю спокойствие и пытаюсь разобраться в причинах',
        value: { stability: 2, reflection: 2, control: 2 },
      },
      { label: 'Выражаю эмоции и говорю прямо, что чувствую', value: { assertiveness: 2, stability: 1 } },
      { label: 'Ухожу от конфликта, чтобы не усугублять ситуацию', value: { empathy: 1, control: 1 } },
    ],
  },
  {
    id: 'q2',
    text: '2) Что для вас важнее в отношениях с людьми?',
    options: [
      { label: 'Понимание, поддержка и эмоциональная близость', value: { empathy: 2, stability: 2 } },
      { label: 'Честность, ясность и уверенность', value: { assertiveness: 2, control: 1 } },
      { label: 'Спокойствие, гармония и отсутствие давления', value: { stability: 2, empathy: 1 } },
    ],
  },
  {
    id: 'q3',
    text: '3) Как вы обычно работаете над задачей?',
    options: [
      { label: 'Сначала планирую, потом действую по шагам', value: { control: 2, reflection: 2 } },
      { label: 'Действую быстро, опираясь на импульс и интуицию', value: { assertiveness: 2, stability: 1 } },
      { label: 'Сначала чувствую состояние и только потом выбираю подход', value: { empathy: 2, reflection: 2 } },
    ],
  },
  {
    id: 'q4',
    text: '4) Если вы ошиблись, что вы обычно делаете?',
    options: [
      { label: 'Анализирую причину и делаю выводы', value: { reflection: 2, control: 2 } },
      { label: 'Стараюсь быстро исправить и двигаться дальше', value: { assertiveness: 2, stability: 1 } },
      { label: 'Слишком переживаю и избегаю обсуждения', value: { stability: 1, empathy: 1 } },
    ],
  },
  {
    id: 'q5',
    text: '5) Как вы обычно принимаете решения?',
    options: [
      { label: 'На основании фактов и логики', value: { control: 2, reflection: 2 } },
      { label: 'На основании интуиции и внутреннего ощущения', value: { empathy: 2, stability: 1 } },
      { label: 'С учётом мнения близких и эмоциональной атмосферы', value: { empathy: 2, assertiveness: 1 } },
    ],
  },
  {
    id: 'q6',
    text: '6) Что сильнее влияет на ваше настроение?',
    options: [
      { label: 'Ощущение контроля над происходящим', value: { control: 2, stability: 2 } },
      { label: 'Эмоциональная атмосфера и отношения вокруг', value: { empathy: 2, stability: 2 } },
      { label: 'Внутреннее чувство цели и уверенность в себе', value: { assertiveness: 2, reflection: 1 } },
    ],
  },
]

function getQuestionById(id) {
  return QUESTIONS.find(question => question.id === id)
}

module.exports = {
  QUESTIONS,
  getQuestionById,
}
