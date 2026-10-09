import { useState } from 'react'
import api from '../services/api'

export const useCodeReview = () => {
  const [isReviewing, setIsReviewing] = useState(false)
  const [review, setReview] = useState(null)
  const [error, setError] = useState(null)

  const reviewCode = async (code, language = 'javascript') => {
    if (!code || code.trim().length === 0) {
      setError('Code is required and must not be empty')
      return
    }

    setIsReviewing(true)
    setError(null)
    setReview(null)

    try {
      const response = await api.post('/ai/get-review', { code, language })
      setReview(response.data)
    } catch (error) {
      console.error('Review error:', error)
      if (error.userMessage) {
        setError(error.userMessage)
      } else if (error.response) {
        setError(`Review failed: ${error.response.data?.error?.message || 'Unknown error'}`)
      } else {
        setError('Unable to generate the review. Please check that the backend server and Gemini API configuration are available.')
      }
    } finally {
      setIsReviewing(false)
    }
  }

  return {
    reviewCode,
    isReviewing,
    review,
    error
  }
}