const DIMENSIONS = {
  stability: { label: 'Эмоциональная стабильность' },
  empathy: { label: 'Эмпатия' },
  control: { label: 'Самоконтроль' },
  assertiveness: { label: 'Уверенность в себе' },
  reflection: { label: 'Рефлексия' },
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

function getProfileSummary(scores) {
  const scoreEntries = Object.entries(scores).map(([key, value]) => ({
    key,
    label: DIMENSIONS[key]?.label || key,
    value,
  }))

  const strongest = [...scoreEntries].sort((a, b) => b.value - a.value)[0]
  const lowest = [...scoreEntries].sort((a, b) => a.value - b.value)[0]

  let profile = 'Сбалансированный'

  if (strongest?.key === 'empathy') {
    profile = 'Эмпатичный и социально ориентированный'
  }

  if (strongest?.key === 'assertiveness') {
    profile = 'Уверенный и инициативный'
  }

  if (strongest?.key === 'control') {
    profile = 'Организованный и самоконтрольный'
  }

  if (lowest?.key === 'stability') {
    profile = 'Требует больше эмоциональной устойчивости'
  }

  return {
    strongest,
    lowest,
    profile,
    scoreEntries,
  }
}

function formatScoreResult(scores) {
  const summary = getProfileSummary(scores)
  const lines = scoreEntriesToLines(summary.scoreEntries)

  return [
    'Результат анкеты:',
    `Доминирующий тип: ${summary.profile}`,
    `Наибольший показатель: ${summary.strongest?.label || '—'} (${summary.strongest?.value ?? 0})`,
    `Самый низкий показатель: ${summary.lowest?.label || '—'} (${summary.lowest?.value ?? 0})`,
    '',
    'Баллы по шкалам:',
    ...lines,
    '',
    'Важно: это не медицинская диагностика, а общая карта личностных тенденций для самоанализа.',
  ].join('\n')
}

function scoreEntriesToLines(entries) {
  return entries.map(({ label, value }) => `- ${label}: ${value}`)
}

module.exports = {
  DIMENSIONS,
  scoreAnswers,
  getProfileSummary,
  formatScoreResult,
}
