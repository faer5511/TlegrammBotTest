require('dotenv').config()
const TelegramBot = require('node-telegram-bot-api')
const { QUESTIONS } = require('./questions')
const { sanitizeText, isAllowedChatId } = require('./privacy')
const { scoreAnswers, formatScoreResult } = require('./scoring')

const token = process.env.BOT_TOKEN
const allowedChatIds = (process.env.ALLOWED_CHAT_IDS || '')
  .split(',')
  .map(id => id.trim())
  .filter(Boolean)

if (!token) {
  throw new Error('BOT_TOKEN is missing. Add it to your .env file.')
}

const bot = new TelegramBot(token, { polling: true })
const sessions = new Map()

function resetSession(chatId) {
  sessions.delete(chatId)
}

function createSession(chatId) {
  sessions.set(chatId, {
    active: true,
    currentQuestionIndex: 0,
    answers: {},
    startedAt: Date.now(),
    lastUpdatedAt: Date.now(),
  })

  return sessions.get(chatId)
}

function getSession(chatId) {
  return sessions.get(chatId) || null
}

function currentQuestionText(question) {
  return `${question.text}\n\n${question.options.map((option, index) => `${index + 1}. ${option.label}`).join('\n')}`
}

function showFinalResult(chatId, session) {
  const scores = scoreAnswers(session.answers)
  const resultText = formatScoreResult(scores)

  bot.sendMessage(chatId, resultText)
  bot.sendMessage(chatId, 'Вы можете начать заново через команду /start или завершить анкетирование командой /reset.')
  resetSession(chatId)
}

function sendQuestion(chatId, session) {
  const question = QUESTIONS[session.currentQuestionIndex]

  if (!question) {
    showFinalResult(chatId, session)
    return
  }

  const text = currentQuestionText(question)
  bot.sendMessage(chatId, text)
}

bot.onText(/\/start/i, msg => {
  const chatId = msg.chat.id

  if (!isAllowedChatId(chatId, allowedChatIds)) {
    bot.sendMessage(chatId, 'Доступ к боту ограничен.')
    return
  }

  const session = createSession(chatId)
  bot.sendMessage(
    chatId,
    'Здравствуйте. Это анонимная анкета для самоанализа и оценки личностных тенденций.\n\nОтвечайте честно, выбирая номер варианта.\nВажно: это не диагноз, а ориентир для размышления.'
  )
  sendQuestion(chatId, session)
})

bot.onText(/\/help/i, msg => {
  const chatId = msg.chat.id
  bot.sendMessage(chatId, 'Команды:\n/start — начать анкетирование\n/reset — сбросить текущую сессию\n/help — помощь')
})

bot.onText(/\/reset/i, msg => {
  const chatId = msg.chat.id
  if (getSession(chatId)) {
    resetSession(chatId)
  }

  bot.sendMessage(chatId, 'Текущая сессия сброшена. Для начала нажмите /start.')
})

bot.on('message', msg => {
  const chatId = msg.chat.id

  if (!msg.text || !msg.text.trim()) {
    return
  }

  if (!isAllowedChatId(chatId, allowedChatIds)) {
    return
  }

  const session = getSession(chatId)

  if (!session || !session.active) {
    return
  }

  const answerValue = sanitizeText(msg.text)
  const question = QUESTIONS[session.currentQuestionIndex]

  if (!question) {
    return
  }

  const optionIndex = Number(answerValue)
  const validOption = question.options[optionIndex - 1]

  if (!validOption) {
    bot.sendMessage(
      chatId,
      `Выберите вариант ответа от 1 до ${question.options.length} для вопроса ${session.currentQuestionIndex + 1}.`
    )
    return
  }

  session.answers[question.id] = validOption.value
  session.currentQuestionIndex += 1
  session.lastUpdatedAt = Date.now()

  sendQuestion(chatId, session)
})

setInterval(() => {
  const ttlMs = Number(process.env.SESSION_TTL_MINUTES || 30) * 60 * 1000

  for (const [chatId, session] of sessions.entries()) {
    if (Date.now() - session.lastUpdatedAt > ttlMs) {
      sessions.delete(chatId)
    }
  }
}, 60 * 1000)

bot.on('polling_error', error => {
  console.error('Telegram polling error:', error.message)
})

module.exports = {
  bot,
  sessions,
}
