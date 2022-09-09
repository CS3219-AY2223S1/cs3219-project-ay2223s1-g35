import {
  ormCreateUser as _createUser,
  ormFindUserByUsername as _findUserByUsername,
  ormCheckIfUserExists as _checkIfUserExists,
  ormInvalidateJWT as _invalidateJWT,
} from '../model/user-orm.js'
import { JWT_EXPIRY } from '../constants.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import 'dotenv/config'

export async function createUser(req, res) {
  try {
    const { username, password } = req.body
    if (username && password) {
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
    } else {
      return res
        .status(400)
        .json({ message: 'Username and/or Password are missing!' })
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
      expiresIn: JWT_EXPIRY,
    })
    return res.status(200).json({ userId: user._id, token })
  }

  return res.status(401).send('Invalid login credentials')
}

export const logoutUser = async (req, res) => {
  const { token } = req.body

  const invalidationResult = await _invalidateJWT(token)
  if (invalidationResult) {
    return res
      .status(200)
      .json({ messsage: 'User logged out - token invalidated.' })
  } else {
    return res.status(500).json({ message: 'Failed to invalidate user token' })
  }
}
