import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import AccountCircle from '@mui/icons-material/AccountCircle'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { isUserLoggedIn, logoutUser } from '../api/userService'
import {
  baseUrl,
  signupUrl,
  loginUrl,
  profileUrl,
} from '../utils/routeConstants'

const NavBar = () => {
  const [anchorEl, setAnchorEl] = useState(null)

  const location = useLocation()
  const navigate = useNavigate()

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleProfile = () => {
    handleClose()
    navigate(profileUrl)
  }

  const handleLogout = async () => {
    try {
      await logoutUser()
      handleClose()
      navigate(loginUrl, { replace: true })
    } catch (err) {
      console.error(`Failed to log user out: ${err}`)
    }
  }

  const _renderAccountIcon = () => {
    if (
      !isUserLoggedIn() &&
      (location.pathname === baseUrl ||
        location.pathname === signupUrl ||
        location.pathname === loginUrl)
    ) {
      return null
    }

    return (
      <>
        <IconButton size="large" onClick={handleMenu} color="inherit">
          <AccountCircle color="primary" />
        </IconButton>
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={!!anchorEl}
          onClose={handleClose}
        >
          <MenuItem onClick={handleProfile}>Profile</MenuItem>
          <MenuItem onClick={handleLogout}>Log out</MenuItem>
        </Menu>
      </>
    )
  }

  return (
    <AppBar className="bg-neutral-100" position="static" elevation={0}>
      <Toolbar>
        <p className="navbar-title">PeerPrep 📖</p>
        {_renderAccountIcon()}
      </Toolbar>
    </AppBar>
  )
}

export default NavBar
