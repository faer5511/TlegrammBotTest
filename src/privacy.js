function sanitizeText(value) {
  if (typeof value !== 'string') {
    return ''
  }

  return value.trim().replace(/\s+/g, ' ').slice(0, 200)
}

function isAllowedChatId(chatId, allowedChatIds) {
  if (!Array.isArray(allowedChatIds) || allowedChatIds.length === 0) {
    return true
  }

  return allowedChatIds.includes(String(chatId))
}

function getMinimalSession(session) {
  if (!session) {
    return {}
  }

  return {
    active: Boolean(session.active),
    currentQuestionIndex: Number(session.currentQuestionIndex) || 0,
    answers: session.answers || {},
  }
}

module.exports = {
  sanitizeText,
  isAllowedChatId,
  getMinimalSession,
}
