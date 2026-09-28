const QUESTIONS = [
  {
    id: 'q1',
    text: '1) Как вы обычно реагируете на стрессовую ситуацию?',
    options: [
      { label: 'Сохраняю спокойствие и анализирую', value: 'calm' },
      { label: 'Начинаю действовать быстро и эмоционально', value: 'reactive' },
      { label: 'Стараюсь уйти от проблемы', value: 'avoid' },
    ],
  },
  {
    id: 'q2',
    text: '2) Что для вас важнее в общении?',
    options: [
      { label: 'Понимание и эмпатия', value: 'empathy' },
      { label: 'Результат и эффективность', value: 'result' },
      { label: 'Спокойная атмосфера', value: 'peace' },
    ],
  },
  {
    id: 'q3',
    text: '3) Как обычно строится ваша работа над задачей?',
    options: [
      { label: 'Планирую шаги и соблюдаю структуру', value: 'structured' },
      { label: 'Действую по импульсу', value: 'impulsive' },
      { label: 'Прислушиваюсь к настроению и ощущениям', value: 'intuition' },
    ],
  },
  {
    id: 'q4',
    text: '4) Что чаще всего влияет на ваши решения?',
    options: [
      { label: 'Логика и факты', value: 'logic' },
      { label: 'Эмоции и интуиция', value: 'emotion' },
      { label: 'Собственные ценности', value: 'values' },
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
