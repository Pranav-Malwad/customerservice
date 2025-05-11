import React from 'react'
import FeedbackForm from '../Components/FeedbackForm'
import SnackPollModal from '../Components/SnackPollModal'

const FeedbackPage = () => {
  return (
    <div>
      <SnackPollModal></SnackPollModal>
      <FeedbackForm></FeedbackForm>
    </div>
  )
}

export default FeedbackPage
