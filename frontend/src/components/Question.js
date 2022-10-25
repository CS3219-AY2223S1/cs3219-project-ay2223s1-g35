import { Box, Button, Divider, Paper } from '@mui/material'

const Question = ({ question, getNewQuestion }) => {
  return (
    <Paper sx={{ height: '100%', width: '100%' }} elevation={5}>
      <Box className="question-div">
        <Box className="question-title-and-next-question-button-wrapper">
          <Box className="question-title-wrapper">
            <p className="question-title">Question</p>
          </Box>
          <Box className="question-next-question-button-wrapper">
            <Button
              className="font-inter bg-sky-500 hover:bg-sky-700 text-white font-semibold rounded-md pl-6 pr-6"
              onClick={() => getNewQuestion()}
            >
              Change Question
            </Button>
          </Box>
        </Box>
        <Divider />
        <Box className="question-details-wrapper-outer">
          <Box className="question-details-wrapper-inner">
            <p
              className="question-details-title"
              dangerouslySetInnerHTML={{ __html: question['title'] }}
            ></p>
            <p
              dangerouslySetInnerHTML={{ __html: question['description'] }}
            ></p>
            <br />
            <p className="question-details-example-title">Examples:</p>
            <p
              dangerouslySetInnerHTML={{
                __html: 'Input: ' + question['ex_1_input'],
              }}
            ></p>
            <p
              dangerouslySetInnerHTML={{
                __html: 'Output: ' + question['ex_1_output'],
              }}
            ></p>
            <p
              dangerouslySetInnerHTML={{ __html: question['ex_1_explanation'] }}
            ></p>
            <br />
            <p
              dangerouslySetInnerHTML={{
                __html: 'Input: ' + question['ex_2_input'],
              }}
            ></p>
            <p
              dangerouslySetInnerHTML={{
                __html: 'Output: ' + question['ex_2_output'],
              }}
            ></p>
            <p
              dangerouslySetInnerHTML={{ __html: question['ex_2_explanation'] }}
            ></p>
            <br />
            {question['ex_3_input'] && (
              <p
                dangerouslySetInnerHTML={{
                  __html: 'Input: ' + question['ex_3_input'],
                }}
              ></p>
            )}
            {question['ex_3_output'] && (
              <p
                dangerouslySetInnerHTML={{
                  __html: 'Output: ' + question['ex_3_output'],
                }}
              ></p>
            )}
            <p
              dangerouslySetInnerHTML={{ __html: question['ex_3_explanation'] }}
            ></p>
          </Box>
        </Box>
      </Box>
    </Paper>
  )
}

export default Question
