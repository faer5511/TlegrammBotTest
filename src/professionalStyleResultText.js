const PROFESSIONAL_STYLE_RESULT_TEXT = {
  title: '✅✅✅РЕЗУЛЬТАТ ПО ТЕСТУ✅✅✅',
  genderPrompt: 'Угадаем ваш пол ЗА 🔟 вопросов',
  resultLabel: 'Результат',
  answersLabel: 'Ваши ответы',
  qualityLabel: 'Ваши качества',
  insightLabel: 'Что это значит',
  disclaimer: 'Тест шуточный. Не воспринимайте seriously 😉',
  medicalDisclaimer:
    '«Прохождение теста осуществляется на усмотрение пользователя; результаты могут отличаться, поскольку бот не гарантирует абсолютную точность ответов. При необходимости проконсультируйтесь со специалистами медицины».',
  male: {
    verdict: 'вы мужчина',
    comment: 'Мы уверены, на все 💯',
    insight: 'Вы действуете логично, решительно и прямо.',
    emoji: '🔵',
    guessEmoji: '👨',
  },
  female: {
    verdict: 'вы женщина',
    comment: 'Мы уверены, на все 💯',
    insight: 'Вы чувствительны, внимательны и эмоциональны.',
    emoji: '🟣',
    guessEmoji: '👩',
  },
  balance: {
    verdict: 'равновесие',
    comment: 'В вас одинаково сильны оба начала',
    insight: 'Вы сочетаете логику и чувства в равной мере.',
    emoji: '⚖️',
    guessEmoji: '🤷',
  },
  notDiagnosed: 'Это не диагноз.',
  profileNote: 'Это лишь шуточный профиль по вашим ответам.',
  percentLabel: 'от максимума',
  qualityMale: 'штук - качества мужчины',
  qualityFemale: 'штук - качества девушки',
}

function getProfessionalStyleResultCopy(verdict) {
  return PROFESSIONAL_STYLE_RESULT_TEXT[verdict] || PROFESSIONAL_STYLE_RESULT_TEXT.balance
}

module.exports = {
  PROFESSIONAL_STYLE_RESULT_TEXT,
  getProfessionalStyleResultCopy,
}
