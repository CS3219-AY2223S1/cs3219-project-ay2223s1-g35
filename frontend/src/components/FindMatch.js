import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { matchingSocket } from '../utils/socket'
import { findMatch, deleteMatch } from '../api/matchingService'
import { UserContext } from '../contexts/UserContext'
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material'
import AlertDialog from './AlertDialog'
import FindingMatchDialog from './FindingMatchDialog'

const FindMatch = () => {
  matchingSocket.on('found-connection', (roomID) => {
    navigate('/test', {
      state: {
        room: roomID,
      },
    })
  })

  const navigate = useNavigate()

  const user = useContext(UserContext)

  const [difficulty, setDifficulty] = useState('')

  // Set timer as 'NA' upon initialisation so that the
  // effect hook in FindingMatchDialog does not run
  const [timer, setTimer] = useState('NA')

  // Define finding match time out seconds
  const findingMatchTimeOutSeconds = 30

  // Select Difficulty Error Dialog
  const [selectDifficultyErrorDialogOpen, setSelectDifficultyErrorDialogOpen] =
    useState(false)
  const handleSelectDifficultyErrorCloseDialog = () =>
    setSelectDifficultyErrorDialogOpen(false)
  const handleSelectDifficultyErrorOpenDialog = () =>
    setSelectDifficultyErrorDialogOpen(true)

  // Finding Match Dialog
  const [findingMatchDialogOpen, setFindingMatchDialogOpen] = useState(false)
  const handleFindingMatchCloseDialog = () => setFindingMatchDialogOpen(false)
  const handleFindingMatchOpenDialog = () => setFindingMatchDialogOpen(true)

  const handleFindMatch = (difficulty) => {
    if (
      difficulty === 'Easy' ||
      difficulty === 'Medium' ||
      difficulty === 'Hard'
    ) {
      console.log('==> Difficulty Selected: ' + difficulty)
      handleFindingMatchOpenDialog()
      setTimer(findingMatchTimeOutSeconds)
      startMatchingService()
    } else {
      handleSelectDifficultyErrorOpenDialog()
    }
  }

  const startMatchingService = async () => {
    console.log('=== Start Matching Service ===')
    console.log('Difficulty: ' + difficulty)
    const res = await findMatch(user._id, matchingSocket.id, difficulty)

    // gets a response
    if (res) {
      const data = res.data
      const room = data.socketID
      const roomID = 'room:' + room + matchingSocket.id
      matchingSocket.emit('notify-partner', room, roomID)
      navigate('/test', {
        state: {
          room: roomID,
        },
      })
    }
  }

  const stopMatchingService = () => {
    console.log('=== Stop Matching Service ===')
    deleteMatch(user._id, matchingSocket.id, difficulty)
  }

  const restartMatchingService = () => {
    console.log('=== Restart Matching Service ===')
    startMatchingService(difficulty)
  }

  return (
    <Box sx={{ my: 3 }}>
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Select Difficulty</InputLabel>
        <Select
          value={difficulty}
          label="Select Difficulty"
          onChange={(e) => {
            setDifficulty(e.target.value)
            setTimer('NA') // set timer as 'NA' so that the effect hook in FindingMatchDialog does not run
          }}
        >
          <MenuItem value="Easy">Easy</MenuItem>
          <MenuItem value="Medium">Medium</MenuItem>
          <MenuItem value="Hard">Hard</MenuItem>
        </Select>
      </FormControl>

      <Button variant={'outlined'} onClick={() => handleFindMatch(difficulty)}>
        Find Match
      </Button>

      <AlertDialog
        dialogOpen={selectDifficultyErrorDialogOpen}
        handleCloseDialog={handleSelectDifficultyErrorCloseDialog}
        dialogTitle="Unable to Find Match"
        dialogMsg="Please select the difficulty level (Easy, Medium or Hard) of the questions you wish to attempt so that the system can find a match for you."
        dialogButtonText="OK"
      />

      <FindingMatchDialog
        dialogOpen={findingMatchDialogOpen}
        handleCloseDialog={handleFindingMatchCloseDialog}
        timer={timer}
        setTimer={setTimer}
        findingMatchTimeOutSeconds={findingMatchTimeOutSeconds}
        stopMatchingService={stopMatchingService}
        restartMatchingService={restartMatchingService}
      />
    </Box>
  )
}

export default FindMatch
