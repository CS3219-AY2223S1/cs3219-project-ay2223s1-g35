import { useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { Button } from '@mui/material'
import UserAuth from '../components/UserAuth'
import { STATUS_CODE_CONFLICT, STATUS_CODE_CREATED } from '../utils/constants'
import { URL_USER_SVC } from '../utils/configs'
import { checkFormFields } from '../utils/main'

const SignupPage = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [dialogTitle, setDialogTitle] = useState('')
  const [dialogMsg, setDialogMsg] = useState('')
  const [isSignupSuccess, setIsSignupSuccess] = useState(false)

  const handleSignup = async (username, password) => {
    setIsSignupSuccess(false)
    checkFormFields(username, password, setErrorDialog)
    const res = await axios
      .post(URL_USER_SVC, { username, password })
      .catch((err) => {
        if (err.response.status === STATUS_CODE_CONFLICT) {
          setErrorDialog('This username already exists')
        } else {
          setErrorDialog('Please try again later')
        }
      })
    if (res && res.status === STATUS_CODE_CREATED) {
      setSuccessDialog('Account successfully created')
      setIsSignupSuccess(true)
    }
  }

  const closeDialog = () => setIsDialogOpen(false)

  const setSuccessDialog = (msg) => {
    setIsDialogOpen(true)
    setDialogTitle('Success')
    setDialogMsg(msg)
  }

  const setErrorDialog = (msg) => {
    setIsDialogOpen(true)
    setDialogTitle('Error')
    setDialogMsg(msg)
  }

  const redirectButton = (
    <Button component={Link} to="/login">
      Log in
    </Button>
  )

  return (
    <UserAuth
      pageTitle="Sign up"
      ctaText="Sign up"
      toggleText="Log in instead!"
      toggleDestination="/login"
      handleAuth={handleSignup}
      isDialogOpen={isDialogOpen}
      closeDialog={closeDialog}
      dialogTitle={dialogTitle}
      dialogMsg={dialogMsg}
      isAuthSuccess={isSignupSuccess}
      redirectButton={redirectButton}
    />
  )
}

export default SignupPage