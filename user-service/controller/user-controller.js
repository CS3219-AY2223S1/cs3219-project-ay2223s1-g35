import {
  ormCreateUser as _createUser,
  ormFindUserByUsername as _findUserByUsername,
  ormCheckIfUserExists as _checkIfUserExists,
  ormUpdateUserPassword as _updateUserPassword,
} from '../model/user-orm.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import 'dotenv/config'

export const createUser = async (req, res) => {
  try {
    const { username, password } = req.body
    if (!(username && password)) {
      return res
        .status(400)
        .json({ message: 'Username and/or Password are missing!' })
    }
    if (!(await _checkIfUserExists(username))) {
      return res.status(409).json({ message: 'Username already exists!' })
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    if (await _createUser(username, hashedPassword).err) {
      return res.status(400).json({ message: 'Could not create a new user!' })
    } else {
      console.log(`Created new user ${username} successfully!`)
      return res
        .status(201)
        .json({ message: `Created new user ${username} successfully!` })
    }
  } catch (err) {
    return res
      .status(500)
      .json({ message: 'Database failure when creating new user!' })
  }
}

export const loginUser = async (req, res) => {
  const { username, password } = req.body
  if (!(username && password)) {
    return res
      .status(400)
      .json({ message: 'Username and/or Password are missing!' })
  }
  const user = await _findUserByUsername(username)
  if (user?.err) {
    return res.status(500).json({ message: 'ERROR: Could not log user in' })
  }
  if (user && (await bcrypt.compare(password, user.password))) {
    const token = jwt.sign({ username, password }, process.env.TOKEN_SECRET, {
      expiresIn: '7 days',
    })
    return res.status(200).json({ userId: user._id, token })
  }
  return res.status(401).send('Invalid login credentials')
}

export const updateUserPassword = async (req, res) => {
  try {
    const { username, newPassword } = req.body
    if (!(username && newPassword)) {
      return res
        .status(400)
        .json({ message: 'Username and/or Password are missing!' })
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10)
    if (!(await _updateUserPassword(username, hashedPassword).err)) {
      return res
        .status(400)
        .json({ message: `Could not update password for ${username}` })
    } else {
      console.log(`Updated password for ${username} successfully!`)
      return res
        .status(201)
        .json({ message: `Updated password for ${username} successfully!` })
    }
  } catch (err) {
    return res
      .status(500)
      .json({ message: 'Database failure when changing password!' })
  }
}
