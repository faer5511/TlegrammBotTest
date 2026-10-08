function isAllowedChatId(chatId, allowedChatIds) {
  if (!Array.isArray(allowedChatIds) || allowedChatIds.length === 0) {
    return true
  }

  return allowedChatIds.includes(String(chatId))
}

module.exports = {
  isAllowedChatId,
}
