const { getProfessionalStyleResultCopy, PROFESSIONAL_STYLE_RESULT_TEXT } = require('./professionalStyleResultText')

const PROFESSIONAL_STYLE_QUESTIONS = [
  {
    id: 'ps1',
    text: 'Утро. Нужно быстро решить, как провести день. Что первым делом?',
    options: [
      { label: 'Прислушаюсь к настроению и решу по ходу', value: { score: 1 } },
      { label: 'Скорее прислушаюсь, чем спланирую', value: { score: 2 } },
      { label: 'Что-то среднее', value: { score: 3 } },
      { label: 'Скорее составлю план', value: { score: 4 } },
      { label: 'Составлю чёткий план и пойду по пунктам', value: { score: 5 } },
    ],
  },
  {
    id: 'ps2',
    text: 'Друг рассказал о проблеме. Ваша первая реакция:',
    options: [
      { label: 'Выслушаю и поддержу', value: { score: 1 } },
      { label: 'Скорее поддержу, чем дам совет', value: { score: 2 } },
      { label: 'Что-то среднее', value: { score: 3 } },
      { label: 'Скорее предложу решение', value: { score: 4 } },
      { label: 'Сразу предложу конкретное решение', value: { score: 5 } },
    ],
  },
  {
    id: 'ps3',
    text: 'Вас незаслуженно критикуют. Что вы сделаете?',
    options: [
      { label: 'Расстроюсь, но сдержусь', value: { score: 1 } },
      { label: 'Скорее расстроюсь', value: { score: 2 } },
      { label: 'Что-то среднее', value: { score: 3 } },
      { label: 'Скорее приведу аргументы', value: { score: 4 } },
      { label: 'Спокойно приведу аргументы', value: { score: 5 } },
    ],
  },
  {
    id: 'ps4',
    text: 'Вам предложили рискованную сделку. Ваш ответ:',
    options: [
      { label: 'Откажусь, если есть сомнения', value: { score: 1 } },
      { label: 'Скорее откажусь', value: { score: 2 } },
      { label: 'Что-то среднее', value: { score: 3 } },
      { label: 'Скорее рискну', value: { score: 4 } },
      { label: 'Рискну, если выгода высокая', value: { score: 5 } },
    ],
  },
  {
    id: 'ps5',
    text: 'Что для вас важнее в коллективе:',
    options: [
      { label: 'Тёплая атмосфера и поддержка', value: { score: 1 } },
      { label: 'Скорее атмосфера', value: { score: 2 } },
      { label: 'Что-то среднее', value: { score: 3 } },
      { label: 'Скорее задачи и порядок', value: { score: 4 } },
      { label: 'Чёткие задачи и порядок', value: { score: 5 } },
    ],
  },
  {
    id: 'ps6',
    text: 'Как вы ведёте себя в новой компании:',
    options: [
      { label: 'Знакомлюсь, общаюсь, сближаюсь', value: { score: 1 } },
      { label: 'Скорее общаюсь', value: { score: 2 } },
      { label: 'Что-то среднее', value: { score: 3 } },
      { label: 'Скорее наблюдаю', value: { score: 4 } },
      { label: 'Наблюдаю, оцениваю, действую', value: { score: 5 } },
    ],
  },
  {
    id: 'ps7',
    text: 'Как вы реагируете на стресс:',
    options: [
      { label: 'Делюсь переживаниями и ищу поддержку', value: { score: 1 } },
      { label: 'Скорее делюсь', value: { score: 2 } },
      { label: 'Что-то среднее', value: { score: 3 } },
      { label: 'Скорее мобилизуюсь', value: { score: 4 } },
      { label: 'Мобилизуюсь и решаю проблему', value: { score: 5 } },
    ],
  },
  {
    id: 'ps8',
    text: 'В переговорах вы:',
    options: [
      { label: 'Ищу взаимовыгодное решение', value: { score: 1 } },
      { label: 'Скорее ищу компромисс', value: { score: 2 } },
      { label: 'Что-то среднее', value: { score: 3 } },
      { label: 'Скорее отстаиваю позицию', value: { score: 4 } },
      { label: 'Жёстко отстаиваю свою позицию', value: { score: 5 } },
    ],
  },
  {
    id: 'ps9',
    text: 'Что вас мотивирует:',
    options: [
      { label: 'Признание, благодарность, отношения', value: { score: 1 } },
      { label: 'Скорее отношения', value: { score: 2 } },
      { label: 'Что-то среднее', value: { score: 3 } },
      { label: 'Скорее карьера', value: { score: 4 } },
      { label: 'Карьера, власть, статус', value: { score: 5 } },
    ],
  },
  {
    id: 'ps10',
    text: 'Ваш внутренний настрой:',
    options: [
      { label: 'Гармония и взаимопонимание', value: { score: 1 } },
      { label: 'Скорее гармония', value: { score: 2 } },
      { label: 'Что-то среднее', value: { score: 3 } },
      { label: 'Скорее соревнование', value: { score: 4 } },
      { label: 'Соревнование и достижения', value: { score: 5 } },
    ],
  },
]

// ─────────────────────────────────────────────
// ЭМОДЗИ-ЦИФРЫ
// ─────────────────────────────────────────────
const digitEmoji = number => {
  const digits = {
    0: '0️⃣',
    1: '1️⃣',
    2: '2️⃣',
    3: '3️⃣',
    4: '4️⃣',
    5: '5️⃣',
    6: '6️⃣',
    7: '7️⃣',
    8: '8️⃣',
    9: '9️⃣',
    10: '🔟',
  }
  return digits[number] || String(number)
}

function parseAnswerCallback(data) {
  if (typeof data !== 'string') return null
  const parts = data.split(':')
  if (parts.length !== 4) return null
  const [prefix, testId, questionId, scoreRaw] = parts
  if (prefix !== 'answer') return null

  const score = Number(scoreRaw)
  if (!Number.isInteger(score) || score < 1 || score > 5) return null

  return { testId, questionId, score }
}

function scoreProfessionalStyle(answers) {
  let total = 0
  let count = 0

  for (const answer of Object.values(answers || {})) {
    const score = Number(answer?.score)
    if (Number.isInteger(score) && score >= 1 && score <= 5) {
      total += score
      count += 1
    }
  }

  const max = count * 5
  const percent = max > 0 ? Math.round((total / max) * 100) : 0

  let verdict
  if (percent >= 65) verdict = 'male'
  else if (percent <= 35) verdict = 'female'
  else verdict = 'balance'

  return { total, max, percent, verdict, count }
}

function formatProfessionalStyleResult(result, answers, questions = PROFESSIONAL_STYLE_QUESTIONS) {
  const { verdict } = result
  const copy = getProfessionalStyleResultCopy(verdict)
  const maleCount = Object.values(answers || {}).filter(a => Number(a?.score) >= 4).length
  const femaleCount = Object.values(answers || {}).filter(a => Number(a?.score) <= 2).length

  return [
    PROFESSIONAL_STYLE_RESULT_TEXT.title,
    '',
    PROFESSIONAL_STYLE_RESULT_TEXT.genderPrompt,
    '',
    copy.verdict,
    '',
    copy.comment,
    '',
    PROFESSIONAL_STYLE_RESULT_TEXT.qualityLabel,
    `${maleCount} ${PROFESSIONAL_STYLE_RESULT_TEXT.qualityMale} ${copy.guessEmoji}`,
    `${femaleCount} ${PROFESSIONAL_STYLE_RESULT_TEXT.qualityFemale} ${copy.guessEmoji}`,
    '',
    '',
    PROFESSIONAL_STYLE_RESULT_TEXT.insightLabel,
    `• ${copy.insight}`,
    `• ${PROFESSIONAL_STYLE_RESULT_TEXT.notDiagnosed}`,
    `• ${PROFESSIONAL_STYLE_RESULT_TEXT.profileNote}`,
    '',
    PROFESSIONAL_STYLE_RESULT_TEXT.disclaimer,
    '',
    PROFESSIONAL_STYLE_RESULT_TEXT.medicalDisclaimer,
  ].join('\n')
}

function getQuestionCaption(test, question, questionNumber, total) {
  return [
    `🧭 ${(test.title || 'ТЕСТ').toLocaleUpperCase('ru-RU')}`,
    `Вопрос ${String(questionNumber).padStart(2, '0')} / ${total}`,
    '',
    question.text,
    '',
    'Оцените, насколько вам близок каждый вариант:',
    question.options.map((option, i) => `${i + 1}. ${option.label}`).join('\n'),
    '',
    'Выберите балл кнопкой ниже.',
  ].join('\n')
}

function getQuestionButtons(test, question) {
  return [
    [
      { text: '1', callback_data: `answer:${test.id}:${question.id}:1` },
      { text: '2', callback_data: `answer:${test.id}:${question.id}:2` },
      { text: '3', callback_data: `answer:${test.id}:${question.id}:3` },
    ],
    [
      { text: '4', callback_data: `answer:${test.id}:${question.id}:4` },
      { text: '5', callback_data: `answer:${test.id}:${question.id}:5` },
    ],
  ]
}

function isProfessionalStyleTest(test) {
  return test?.id === 'professional-style'
}

function applyProfessionalStyleAnswer(data, session) {
  const parsed = parseAnswerCallback(data)
  if (!parsed || parsed.testId !== session?.test?.id) {
    return { accepted: false }
  }

  const question = session.test.questions[session.currentQuestionIndex]
  if (!question || parsed.questionId !== question.id) {
    return { accepted: false }
  }

  session.answers[question.id] = { score: parsed.score }
  session.responses[question.id] = `${parsed.score} балл(ов)`
  session.currentQuestionIndex += 1
  session.lastUpdatedAt = Date.now()

  return { accepted: true, question }
}

function findNextQuestionIndex(answers, questions = PROFESSIONAL_STYLE_QUESTIONS) {
  return questions.findIndex(q => {
    const score = answers?.[q.id]?.score
    return !(Number.isInteger(score) && score >= 1 && score <= 5)
  })
}

async function handleProfessionalStyleCallback(query, deps) {
  const { getSession, saveSession, sendMessage, answerCallback, testTitle = 'Тест: мужчина или женщина' } = deps || {}

  const data = query?.data || ''
  const parsed = parseAnswerCallback(data)
  if (!parsed) return false

  const { testId, questionId, score } = parsed
  const userId = query.from.id
  const chatId = query.message?.chat?.id ?? userId

  // 1. Берём сессию
  const session = (await getSession(userId, testId)) || { answers: {} }
  if (!session.answers) session.answers = {}

  // 2. Перезаписываем ответ (никакой блокировки повторных нажатий)
  session.answers[questionId] = { score }

  // 3. Снимаем «крутилку» в Telegram
  if (typeof answerCallback === 'function') {
    await answerCallback(query.id)
  }

  // 4. Ищем следующий неотвеченный вопрос
  const nextIndex = findNextQuestionIndex(session.answers)

  if (nextIndex === -1) {
    // Все 10 ответов собраны → считаем результат
    const result = scoreProfessionalStyle(session.answers)
    const text = formatProfessionalStyleResult(result, session.answers)

    if (typeof saveSession === 'function') {
      await saveSession(userId, testId, { ...session, finished: true, result })
    }

    await sendMessage(chatId, text)
    return true
  }

  // 5. Сохраняем прогресс и показываем следующий вопрос
  if (typeof saveSession === 'function') {
    await saveSession(userId, testId, session)
  }

  const question = PROFESSIONAL_STYLE_QUESTIONS[nextIndex]
  const caption = getQuestionCaption(
    { id: testId, title: testTitle },
    question,
    nextIndex + 1,
    PROFESSIONAL_STYLE_QUESTIONS.length
  )
  const buttons = getQuestionButtons({ id: testId }, question)

  await sendMessage(chatId, caption, {
    reply_markup: { inline_keyboard: buttons },
  })

  return true
}

module.exports = {
  PROFESSIONAL_STYLE_QUESTIONS,
  isProfessionalStyleTest,
  applyProfessionalStyleAnswer,
  scoreProfessionalStyle,
  formatProfessionalStyleResult,
  getQuestionCaption,
  getQuestionButtons,
  parseAnswerCallback,
  findNextQuestionIndex,
  handleProfessionalStyleCallback,
}
