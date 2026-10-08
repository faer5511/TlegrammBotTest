require('dotenv').config()
const fs = require('node:fs')
const path = require('node:path')
const { Bot, InputFile } = require('node-telegram-bot-api')
const { TESTS, getTestById } = require('./testCatalog')
const { isAllowedChatId } = require('./privacy')
const { scoreAnswers, formatScoreResult, formatShortConclusion } = require('./scoring')
const {
  isProfessionalStyleTest,
  applyProfessionalStyleAnswer,
  scoreProfessionalStyle,
  formatProfessionalStyleResult,
  getQuestionCaption,
  getQuestionButtons,
} = require('./professionalStyleQuestions')

const token = process.env.BOT_TOKEN
const ACCESS_DENIED = 'Доступ к боту ограничен.'
const HOME_CALLBACK = 'menu:home'
const MAX_PROFILE_RESULTS = 12
const TEST_ICONS = { anchor: '🧠', communication: '💬', stress: '🌿', 'professional-style': '🎯' }
const TEST_ICONS_LABELS = {
  anchor: 'Точка опоры',
  communication: 'Стиль общения',
  stress: 'Ресурс и стресс',
  'professional-style': 'Стиль профессионального поведения',
}
const allowedChatIds = (process.env.ALLOWED_CHAT_IDS || '')
  .split(',')
  .map(id => id.trim())
  .filter(Boolean)

if (!token) {
  throw new Error('BOT_TOKEN is missing. Add it to your .env file.')
}

const bot = new Bot(token)
const sessions = new Map()
const profiles = new Map()
const photos = {
  welcome: { file: new InputFile(fs.readFileSync(path.join(__dirname, '../assets/welcome.jpg'))), fileId: null },
  reflection: { file: new InputFile(fs.readFileSync(path.join(__dirname, '../assets/reflection.jpg'))), fileId: null },
  communication: {
    file: new InputFile(fs.readFileSync(path.join(__dirname, '../assets/communication.jpg'))),
    fileId: null,
  },
}

function resetSession(chatId) {
  sessions.delete(chatId)
}

function createSession(chatId, test) {
  sessions.set(chatId, {
    active: true,
    test,
    currentQuestionIndex: 0,
    answers: {},
    responses: {},
    lastUpdatedAt: Date.now(),
  })

  return sessions.get(chatId)
}

function getSession(chatId) {
  return sessions.get(chatId) || null
}

function withHomeButton(rows = [], includeHome = true) {
  const keyboard = [...rows]
  if (includeHome) {
    keyboard.push([{ text: '🏠 Главное меню', callback_data: HOME_CALLBACK }])
  }

  return { inline_keyboard: keyboard }
}

async function sendScreen(chatId, image, caption, rows = [], includeHome = true) {
  const photo = photos[image]
  if (!photo) {
    throw new Error(`Unknown screen image: ${image}`)
  }

  const message = await bot.api.sendPhoto({
    chat_id: chatId,
    photo: photo.fileId || photo.file,
    caption,
    reply_markup: withHomeButton(rows, includeHome),
  })

  // Upload each image once; Telegram file IDs make later screens quicker.
  if (!photo.fileId && message.photo?.length) {
    photo.fileId = message.photo[message.photo.length - 1].file_id
  }

  return message
}

function currentQuestionText(question) {
  return question.text.replace(/^\d+[.)]\s*/, '')
}

function buildProgressBar(current, total) {
  const percentage = Math.round((current / total) * 100)
  const filled = Math.round((percentage / 100) * 8)
  return `${'🟩'.repeat(filled)}${'⬜'.repeat(8 - filled)} ${percentage}%`
}

function buildQuestionButtons(test, question) {
  if (isProfessionalStyleTest(test)) {
    return getQuestionButtons(test, question)
  }

  const rows = []
  for (let index = 0; index < question.options.length; index += 2) {
    rows.push(
      question.options.slice(index, index + 2).map((option, offset) => ({
        text: option.label,
        callback_data: `answer:${test.id}:${question.id}:${index + offset}`,
      }))
    )
  }

  return rows
}

function getTestIcon(testId) {
  return TEST_ICONS[testId] || '📝'
}

function getTestLabel(testId) {
  return TEST_ICONS_LABELS[testId] || 'Тест'
}

function saveProfileResult(chatId, session, result, conclusion) {
  const history = profiles.get(chatId) || []
  history.unshift({
    id: `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`,
    testId: session.test.id,
    title: session.test.title,
    image: session.test.image,
    completedAt: Date.now(),
    responses: { ...session.responses },
    result,
    conclusion,
  })
  profiles.set(chatId, history.slice(0, MAX_PROFILE_RESULTS))
}

async function showFinalResult(chatId, session) {
  const professionalStyle = isProfessionalStyleTest(session.test)
  const scores = professionalStyle ? scoreProfessionalStyle(session.answers) : scoreAnswers(session.answers)
  const result =
    professionalStyle ?
      formatProfessionalStyleResult(scores, session.answers, session.test.questions)
    : formatScoreResult(scores, session.answers, session.test.questions, session.test.title)
  const conclusion =
    professionalStyle ?
      result.split('\n').slice(0, 8).join('\n')
    : formatShortConclusion(scores, session.answers, session.test.questions)
  saveProfileResult(chatId, session, result, conclusion)
  resetSession(chatId)

  await sendScreen(chatId, session.test.image, result, [
    [{ text: '👤 Открыть профиль', callback_data: 'menu:profile' }],
  ])
}

async function sendQuestion(chatId, session) {
  const question = session.test.questions[session.currentQuestionIndex]
  if (!question) {
    await showFinalResult(chatId, session)
    return
  }

  const questionNumber = session.currentQuestionIndex + 1
  const total = session.test.questions.length

  if (isProfessionalStyleTest(session.test)) {
    const caption = getQuestionCaption(session.test, question, questionNumber, total)

    await bot.api.sendMessage({
      chat_id: chatId,
      text: caption,
      reply_markup: { inline_keyboard: buildQuestionButtons(session.test, question) },
    })
    return
  }

  const caption = [
    `🧭 ${session.test.title.toLocaleUpperCase('ru-RU')} · ВОПРОС ${String(questionNumber).padStart(2, '0')} / ${total}`,
    buildProgressBar(questionNumber, total),
    '',
    'ВЫБЕРИТЕ ОДИН ВАРИАНТ',
    '',
    currentQuestionText(question),
  ].join('\n')

  await sendScreen(chatId, session.test.image, caption, buildQuestionButtons(session.test, question))
}

async function startTest(chatId, test) {
  const activeSession = getSession(chatId)
  if (activeSession?.active) {
    if (activeSession.test.id === test.id) {
      await sendQuestion(chatId, activeSession)
    } else {
      await showTestDetails(chatId, test)
    }
    return
  }

  await sendQuestion(chatId, createSession(chatId, test))
}

async function showMainMenu(chatId, notice = '') {
  const caption = [
    '🧠 ТОЧКА ОПОРЫ',
    'Краткие тесты для самоанализа',
    '',
    notice || 'Выберите раздел, чтобы начать.',
    '',
    '✦ Тесты помогают прислушаться к своим реакциям и привычкам.',
    '✦ Результаты носят ознакомительный характер.',
    '',
    'Справка: /help',
  ].join('\n')

  await sendScreen(
    chatId,
    'welcome',
    caption,
    [
      [{ text: '🧠 Начать тест', callback_data: 'menu:tests' }],
      [{ text: '👤 Посмотреть профиль', callback_data: 'menu:profile' }],
      [{ text: '🎲 Случайный тест', callback_data: 'menu:random' }],
    ],
    false
  )
}

async function showTestList(chatId) {
  const rows = TESTS.map(test => [
    {
      text: `${getTestIcon(test.id)} ${test.title}`,
      callback_data: isProfessionalStyleTest(test) ? `test:start:${test.id}` : `test:open:${test.id}`,
    },
  ])
  const session = getSession(chatId)

  if (session?.active) {
    rows.push([{ text: `▶ Продолжить «${session.test.title}»`, callback_data: 'survey:resume' }])
  }

  await sendScreen(
    chatId,
    'reflection',
    '🧭 ВЫБЕРИТЕ ТЕСТ\n\nВыберите тест, который хотите пройти. Каждый тест занимает около 2 минут.',
    rows
  )
}

async function showTestDetails(chatId, test) {
  const session = getSession(chatId)
  const rows = []
  let caption = [
    `${getTestIcon(test.id)} ${test.title.toLocaleUpperCase('ru-RU')}`,
    '',
    test.description,
    '',
    `✦ ${test.questions.length} вопросов`,
    '✦ Около 2 минут',
  ].join('\n')

  if (session?.active && session.test.id === test.id) {
    rows.push([{ text: '▶ Продолжить тест', callback_data: 'survey:resume' }])
  } else if (session?.active) {
    caption += `\n\nСначала завершите или прервите тест «${session.test.title}».`
    rows.push([{ text: `▶ Продолжить «${session.test.title}»`, callback_data: 'survey:resume' }])
    rows.push([{ text: 'Прервать текущий тест', callback_data: 'survey:stop-confirm' }])
  } else {
    rows.push([{ text: '▶ Начать тест', callback_data: `test:start:${test.id}` }])
  }

  rows.push([{ text: '◀ К списку тестов', callback_data: 'menu:tests' }])
  await sendScreen(chatId, test.image, caption, rows)
}

async function showProfile(chatId, notice = '') {
  const history = profiles.get(chatId) || []
  const rows = history.map(result => [
    {
      text: `${getTestIcon(result.testId)} ${result.title} · ${new Date(result.completedAt).toLocaleDateString('ru-RU')}`,
      callback_data: `profile:result:${result.id}`,
    },
  ])

  if (history.length) {
    rows.push([{ text: '🗑 Сбросить статистику', callback_data: 'profile:reset-confirm' }])
  }

  const latestConclusion = history[0]?.conclusion
  const caption =
    history.length ?
      `👤 МОЙ ПРОФИЛЬ\n\nПройдено тестов: ${history.length}\n\nВыберите сохранённый результат, чтобы посмотреть выводы и свои ответы.\n\n🪞 Краткий ориентир:\n${latestConclusion}\n\n${notice}\n\nДанные хранятся только в памяти процесса бота.`
    : `👤 МОЙ ПРОФИЛЬ\n\nПока нет завершённых тестов.\nРезультаты и ответы появятся здесь после прохождения теста.\n\n${notice}\n\nДанные хранятся только в памяти процесса бота.`

  await sendScreen(chatId, 'reflection', caption, rows)
}

async function showProfileResult(chatId, resultId) {
  const result = (profiles.get(chatId) || []).find(entry => entry.id === resultId)
  const test = result && getTestById(result.testId)
  if (!result || !test) {
    await showProfile(chatId, 'Этот результат больше недоступен.')
    return
  }

  await sendScreen(
    chatId,
    result.image,
    `📚 ${result.title.toLocaleUpperCase('ru-RU')}\n\nЗавершён: ${new Date(result.completedAt).toLocaleString('ru-RU')}`,
    [[{ text: '◀ Назад к профилю', callback_data: 'menu:profile' }]]
  )

  const answers = test.questions
    .map(
      (question, index) =>
        `${index + 1}. ${currentQuestionText(question)}\n   Ответ: ${result.responses[question.id] || 'Не отвечено'}`
    )
    .join('\n\n')

  await bot.api.sendMessage({
    chat_id: chatId,
    text: `📋 ВАШИ ОТВЕТЫ\n\n${answers}\n\n${result.result}`,
    reply_markup: withHomeButton([[{ text: '◀ Назад к профилю', callback_data: 'menu:profile' }]]),
  })
}

async function showProfileResetConfirmation(chatId) {
  await sendScreen(
    chatId,
    'reflection',
    '🗑 Сбросить всю историю тестов и сохранённые ответы? Это действие нельзя отменить.',
    [
      [{ text: 'Да, сбросить', callback_data: 'profile:reset-yes' }],
      [{ text: 'Нет, оставить', callback_data: 'menu:profile' }],
    ]
  )
}

async function showHelp(chatId) {
  await sendScreen(
    chatId,
    'communication',
    [
      'ℹ️ ПОМОЩЬ',
      '',
      'Бот создан для коротких тестов самоанализа.',
      'Содержимое может изменяться в ходе разработки.',
      '',
      '✦ Результаты носят ознакомительный характер.',
      'Тесты не являются клиническими методиками и не ставят диагноз.',
      '',
      'Поддержка: @Backit007',
    ].join('\n')
  )
}

async function confirmCallback(ctx, text) {
  if (text) await ctx.answerCallbackQuery({ text })
  else await ctx.answerCallbackQuery()
}

bot.command('start', async ctx => {
  const chatId = ctx.chat.id
  if (!isAllowedChatId(chatId, allowedChatIds)) {
    await ctx.reply(ACCESS_DENIED)
    return
  }

  await showMainMenu(chatId)
})

bot.command('help', async ctx => {
  if (!isAllowedChatId(ctx.chat.id, allowedChatIds)) {
    await ctx.reply(ACCESS_DENIED)
    return
  }

  await showHelp(ctx.chat.id)
})

bot.command('reset', async ctx => {
  if (!isAllowedChatId(ctx.chat.id, allowedChatIds)) {
    await ctx.reply(ACCESS_DENIED)
    return
  }

  resetSession(ctx.chat.id)
  await showMainMenu(ctx.chat.id, 'Текущий тест сброшен. История профиля сохранена.')
})

bot.on('callback_query', async ctx => {
  const chatId = ctx.chat.id
  const data = ctx.callbackQuery?.data ?? ''

  if (!isAllowedChatId(chatId, allowedChatIds)) {
    await confirmCallback(ctx, ACCESS_DENIED)
    return
  }

  if (data.startsWith('answer:')) {
    const session = getSession(chatId)

    if (isProfessionalStyleTest(session?.test)) {
      const result = applyProfessionalStyleAnswer(data, session)

      if (!result.accepted) {
        await confirmCallback(ctx, 'Этот ответ уже неактуален.')
        return
      }

      await confirmCallback(ctx, 'Ответ принят.')
      await sendQuestion(chatId, session)
      return
    }

    const [, testId, questionId, optionIndexText] = data.split(':')
    const question = session?.test.questions[session.currentQuestionIndex]
    const option = question?.options[Number(optionIndexText)]

    if (!session?.active || session.test.id !== testId || question?.id !== questionId || !option) {
      await confirmCallback(ctx, 'Этот ответ уже неактуален.')
      return
    }

    await confirmCallback(ctx, 'Ответ принят.')
    session.answers[question.id] = option.value
    session.responses[question.id] = option.label
    session.currentQuestionIndex += 1
    session.lastUpdatedAt = Date.now()
    await sendQuestion(chatId, session)
    return
  }

  await confirmCallback(ctx)

  if (data === HOME_CALLBACK) {
    await showMainMenu(chatId)
  } else if (data === 'menu:tests') {
    await showTestList(chatId)
  } else if (data === 'menu:profile') {
    await showProfile(chatId)
  } else if (data === 'menu:random') {
    const test = TESTS[Math.floor(Math.random() * TESTS.length)]
    await showTestDetails(chatId, test)
  } else if (data === 'survey:resume') {
    const session = getSession(chatId)
    if (session?.active) await sendQuestion(chatId, session)
    else await showTestList(chatId)
  } else if (data === 'survey:stop-confirm') {
    await sendScreen(chatId, 'reflection', 'Прервать незавершённый тест? Ваши ответы не попадут в профиль.', [
      [{ text: 'Прервать тест', callback_data: 'survey:stop' }],
      [{ text: 'Продолжить тест', callback_data: 'survey:resume' }],
    ])
  } else if (data === 'survey:stop') {
    resetSession(chatId)
    await showTestList(chatId)
  } else if (data === 'profile:reset-confirm') {
    await showProfileResetConfirmation(chatId)
  } else if (data === 'profile:reset-yes') {
    profiles.delete(chatId)
    await showProfile(chatId, 'История и сохранённые ответы удалены.')
  } else if (data.startsWith('profile:result:')) {
    await showProfileResult(chatId, data.slice('profile:result:'.length))
  } else if (data.startsWith('test:open:')) {
    const test = getTestById(data.slice('test:open:'.length))
    if (test) await showTestDetails(chatId, test)
    else await showTestList(chatId)
  } else if (data.startsWith('test:start:')) {
    const test = getTestById(data.slice('test:start:'.length))
    if (test) await startTest(chatId, test)
    else await showTestList(chatId)
  }
})

bot.on('message', async ctx => {
  const chatId = ctx.chat.id
  const text = ctx.message?.text ?? ''
  if (!text.trim() || !isAllowedChatId(chatId, allowedChatIds)) {
    return
  }

  if (getSession(chatId)?.active) {
    await ctx.reply('Выберите один из вариантов ответа кнопками под вопросом.')
  }
})

// Keep unfinished answers in memory only and expire inactive sessions.
setInterval(() => {
  const ttlMs = Number(process.env.SESSION_TTL_MINUTES || 30) * 60 * 1000
  for (const [chatId, session] of sessions.entries()) {
    if (Date.now() - session.lastUpdatedAt > ttlMs) {
      sessions.delete(chatId)
    }
  }
}, 60 * 1000)

bot.catch((err, ctx) => {
  console.error('Telegram bot error:', err)
  if (ctx?.chat?.id) {
    return bot.api.sendMessage({ chat_id: ctx.chat.id, text: 'Произошла ошибка. Попробуйте ещё раз.' })
  }
})

bot.startPolling()
console.log('Bot started and polling...')

module.exports = {
  bot,
  sessions,
  profiles,
}
