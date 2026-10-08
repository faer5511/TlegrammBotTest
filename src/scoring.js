const DIMENSIONS = {
  stability: { label: 'Эмоциональная стабильность' },
  empathy: { label: 'Эмпатия' },
  control: { label: 'Самоконтроль' },
  assertiveness: { label: 'Уверенность в себе' },
  reflection: { label: 'Рефлексия' },
}
const { QUESTIONS } = require('./questions')

const DIMENSION_ICONS = {
  stability: '🌤️',
  empathy: '💚',
  control: '🎯',
  assertiveness: '✨',
  reflection: '🔎',
}

const SUGGESTIONS = {
  stability: 'Заметьте, что помогает вам восстановиться после напряжённого дня, и выделите этому немного времени.',
  empathy: 'Проверьте, хватает ли места собственным потребностям, когда вы поддерживаете других.',
  control: 'Разделите ситуацию на то, что вы можете изменить, и то, что можно отпустить.',
  assertiveness: 'Попробуйте обозначить одно своё желание или решение спокойно и прямо.',
  reflection: 'Выберите один полезный вывод из прошлого опыта и превратите его в небольшой следующий шаг.',
}

function scoreAnswers(answers) {
  const totals = Object.fromEntries(Object.keys(DIMENSIONS).map(key => [key, 0]))

  for (const answer of Object.values(answers)) {
    if (!answer || typeof answer !== 'object') {
      continue
    }

    for (const [dimension, value] of Object.entries(answer)) {
      if (typeof totals[dimension] === 'number') {
        totals[dimension] += Number(value) || 0
      }
    }
  }

  return totals
}

function getProfileSummary(scores, answers, questions = QUESTIONS) {
  const answeredQuestions = questions.filter(question => {
    if (!answers) return true
    const answer = answers[question.id]
    return answer && Object.keys(answer).length > 0
  })
  const maximums = Object.fromEntries(Object.keys(DIMENSIONS).map(key => [key, 0]))

  // Сравниваем шкалы только по вопросам с содержательным ответом.
  for (const question of answeredQuestions) {
    for (const dimension of Object.keys(DIMENSIONS)) {
      const maximum = Math.max(...question.options.map(option => Number(option.value[dimension]) || 0))
      maximums[dimension] += maximum
    }
  }

  const scoreEntries = Object.entries(scores).map(([key, value]) => ({
    key,
    label: DIMENSIONS[key]?.label || key,
    value,
    percentage: maximums[key] ? Math.min(100, Math.round((value / maximums[key]) * 100)) : 0,
    icon: DIMENSION_ICONS[key] || '📊',
  }))

  const strongest = [...scoreEntries].sort((a, b) => b.percentage - a.percentage)[0]
  const lowest = [...scoreEntries].sort((a, b) => a.percentage - b.percentage)[0]

  return {
    strongest,
    lowest,
    scoreEntries,
    suggestion:
      SUGGESTIONS[lowest?.key] || 'Отнеситесь к результатам с любопытством и выберите один небольшой шаг для себя.',
    answeredCount: answeredQuestions.length,
  }
}

function formatScoreResult(scores, answers, questions = QUESTIONS, testTitle = 'Точка опоры') {
  const summary = getProfileSummary(scores, answers, questions)
  const lines = summary.scoreEntries.map(({ icon, label, percentage }) => {
    const filled = Math.round(percentage / 10)
    return `${icon} ${label}\n${'🟩'.repeat(filled)}${'⬜'.repeat(10 - filled)} ${percentage}%`
  })

  return [
    `🪞 РЕЗУЛЬТАТ · ${testTitle.toLocaleUpperCase('ru-RU')}`,
    '',
    `${summary.strongest?.icon || '✨'} Ваша опора: ${summary.strongest?.label || '—'}`,
    `🌱 Тема для внимания: ${summary.lowest?.label || '—'}`,
    '',
    'ОЦЕНИТЬ СВОИПОЛОЖЕНИЯ',
    '',
    ...lines,
    '',
    `💡 Идея для практики: ${summary.suggestion}`,
    '',
    `На основе ответов: ${summary.answeredCount} из ${questions.length}.`,
    'Это не диагноз: шкалы отражают только выбранные ответы и не заменяют консультацию специалиста.',
  ].join('\n')
}

function formatShortConclusion(scores, answers, questions = QUESTIONS) {
  const summary = getProfileSummary(scores, answers, questions)
  if (!summary.answeredCount) {
    return 'В последнем тесте не было содержательных ответов. Пройдите тест, чтобы увидеть краткий вывод.'
  }

  return `Возможная опора: ${summary.strongest.label}. Тема для внимания: ${summary.lowest.label}. ${summary.suggestion}`
}

module.exports = {
  DIMENSIONS,
  scoreAnswers,
  getProfileSummary,
  formatScoreResult,
  formatShortConclusion,
}
