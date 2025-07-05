import { v4 as uuidv4 } from 'uuid'

export const generateOrderNumber = (): string => {
  const uniquePart = uuidv4().split('-')[0].toUpperCase() // Shorten for readability
  return `ORD-${uniquePart}`
}

export const generateTransactionId = (): string => {
  const uniquePart = uuidv4().split('-')[0].toUpperCase()
  return `TX-${uniquePart}`
}
