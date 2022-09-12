import { Box, Button, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'

const LandingPage = () => {
  const navigate = useNavigate()

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '30%',
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
      }}
    >
      {' '}
      <Typography sx={{ marginBottom: '2rem' }} variant={'h3'}>
        {'Welcome!'}
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <Button
          sx={{ marginRight: '2px' }}
          variant={'outlined'}
          onClick={() => navigate('/login')}
        >
          {'Log In!'}
        </Button>
        <Button
          sx={{ marginLeft: '2px' }}
          variant={'outlined'}
          onClick={() => navigate('/signup')}
        >
          {'Sign Up!'}
        </Button>
      </Box>
    </Box>
  )
}

export default LandingPage