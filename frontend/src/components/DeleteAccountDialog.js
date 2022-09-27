import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material'
import { deleteUser } from '../api/userService'
import { UserContext } from '../contexts/UserContext'
import { baseUrl } from '../utils/routeConstants'
import SnackbarAlert from './SnackbarAlert'

const DeleteAccountDialog = ({ dialogOpen, handleNo }) => {
  const user = useContext(UserContext)
  const navigate = useNavigate()

  // Delete Account Successful Alert
  const [
    deleteAccountSuccessfulAlertOpen,
    setDeleteAccountSuccessfulAlertOpen,
  ] = useState(false)
  const handleDeleteAccountSuccessfulOpenAlert = () =>
    setDeleteAccountSuccessfulAlertOpen(true)

  const handleDeleteAccount = async () => {
    try {
      await deleteUser(user.username)
      navigate(baseUrl)

      // The alert will not show as the parent component (ProfilePage)
      // is killed after navigating to baseUrl. Need to think and discuss
      // a workaround for this.
      handleDeleteAccountSuccessfulOpenAlert()
    } catch (err) {
      console.log(`Failed to delete user account: ${err}`)
    }
  }

  return (
    <>
      <div>
        <Dialog open={dialogOpen}>
          <DialogTitle>Delete Account</DialogTitle>
          <DialogContent dividers>
            <DialogContentText>
              Are you sure you want to delete your account?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleNo}>No</Button>
            <Button onClick={handleDeleteAccount}>Yes</Button>
          </DialogActions>
        </Dialog>
      </div>

      <SnackbarAlert
        alertOpen={deleteAccountSuccessfulAlertOpen}
        setAlertOpen={setDeleteAccountSuccessfulAlertOpen}
        severity="success"
        alertMsg="Your account has been deleted successfully!"
      />
    </>
  )
}

export default DeleteAccountDialog
