import { useEffect, useState } from 'react'
import { Box, Button } from '@mui/material'
import { useNavigate, useLocation } from 'react-router-dom'
import { isUserLoggedIn } from '../api/userService'
import { baseUrl, homeUrl } from '../utils/routeConstants'
import SnackbarAlert from '../components/SnackbarAlert'
import importantImage from '../imgs/tweet.png'
import ReactIcon from '../components/icons/ReactIcon'
import MaterialIcon from '../components/icons/MaterialIcon'
import TailwindIcon from '../components/icons/TailwindIcon'
import NodeIcon from '../components/icons/NodeIcon'
import MongoIcon from '../components/icons/MongoIcon'
import RedisIcon from '../components/icons/RedisIcon'
import SocketIcon from '../components/icons/SocketIcon'
import DockerIcon from '../components/icons/DockerIcon'
import DigitalOceanIcon from '../components/icons/DigitalOceanIcon'

const LandingPage = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const [deletedAccountUsername, setDeletedAccountUsername] = useState('')

  // Delete Account Success Alert
  const [deleteAccountSuccessAlertOpen, setDeleteAccountSuccessAlertOpen] =
    useState(false)
  const handleDeleteAccountSuccessOpenAlert = () =>
    setDeleteAccountSuccessAlertOpen(true)

  // Check if location state is null
  // If null, means no account was deleted before loading this page
  // Set location state to indicate that no account was deleted
  if (location.state === null) {
    location.state = {
      deleteAccountSuccess: false,
      deletedAccountUsername: '',
    }
  }

  useEffect(() => {
    if (isUserLoggedIn()) {
      navigate(homeUrl, { replace: true })
    } else {
      // Check if location state indicates that an account was deleted successfully
      // If true, display success alert (with the deleted account username)
      // Reset the page with navigate(baseUrl, { replace: true })
      // The navigation will replace the current entry in the history stack
      if (location.state.deleteAccountSuccess) {
        setDeletedAccountUsername(location.state.deletedAccountUsername)
        handleDeleteAccountSuccessOpenAlert()
        navigate(baseUrl, { replace: true })
      }
    }
  }, [navigate, location, deleteAccountSuccessAlertOpen])

  const renderDeleteAccountSuccessAlert = () => {
    if (!deleteAccountSuccessAlertOpen) {
      return null
    }

    return (
      <SnackbarAlert
        alertOpen={deleteAccountSuccessAlertOpen}
        setAlertOpen={setDeleteAccountSuccessAlertOpen}
        severity="success"
        alertMsg={`Your account ${deletedAccountUsername} has been deleted successfully!`}
      />
    )
  }

  return (
    <>
      <Box
        className="landing-page-container"
        sx={{
          // content height = 100vh - nav bar height
          height: 'calc(100vh - 64px)',
        }}
      >
        <div className="landing-page-left-container">
          <div className="landing-page-text-and-button-container">
            <div className="landing-page-text-container">
              <p className="landing-page-title">{'PeerPrep'}</p>
              <p className="landing-page-subtitle">
                {'Studying for interviews has never been easier.'}
              </p>
              <p className="landing-page-description">
                {
                  'PeerPrep is an online collaborative tool to discuss algorithmic questions.'
                }
              </p>
              <p className="landing-page-description">
                {
                  'It simulates technical interviews and lets you and your partner simulate the different roles!'
                }
              </p>
              <div className="landing-page-button-container">
                <Button
                  className="font-inter bg-sky-500 hover:bg-sky-700 text-white font-semibold rounded-md w-40 px-6"
                  onClick={() => navigate('/login')}
                >
                  {'Log In'}
                </Button>
                <Button
                  className="font-inter bg-sky-500 hover:bg-sky-700 text-white font-semibold rounded-md w-40 px-6"
                  onClick={() => navigate('/signup')}
                >
                  {'Sign Up'}
                </Button>
              </div>
              <p className="landing-page-icon-title">Built with ?????? in:</p>
              <div className="landing-page-icon-container">
                <ReactIcon />
                <MaterialIcon />
                <TailwindIcon />
                <NodeIcon />
                <MongoIcon />
                <RedisIcon />
                <SocketIcon />
                <DockerIcon />
                <DigitalOceanIcon />
              </div>
            </div>
          </div>
        </div>
        <div className="landing-page-right-container">
          <div>
            <img src={importantImage} className="landing-image" alt="tweet" />
          </div>
        </div>
      </Box>
      {renderDeleteAccountSuccessAlert()}
    </>
  )
}

export default LandingPage
