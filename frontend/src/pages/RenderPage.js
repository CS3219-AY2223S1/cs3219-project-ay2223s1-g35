import { Button } from '@mui/material'
import axios from 'axios'

const RenderPage = () => {
  const getQuestion = async () => {
    try {
      const res = await axios.get('http://localhost:8100/api/question', {
        difficulty: 'easy',
      })
      console.log(res)
      console.log(res.data)
    } catch (err) {
      console.log('ERROR', err)
    }
  }

  const html =
    '<p>Given an array of integers <code>nums</code> and an integer <code>target</code>, return <em>indices of the two numbers such that they add up to <code>target</code></em>.</p><p>You may assume that each input would have <strong><em>exactly</em> one solution</strong>, and you may not use the <em>same</em> element twice.</p><p>You can return the answer in any order.</p>'

  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: html }}></div>
      <Button onClick={getQuestion}>Question Test</Button>
    </>
  )
}

export default RenderPage
