import { createUser, findUser, checkIfUserExists } from './repository.js'
import {
  addJWT as addJWTToRedis,
  checkJWTExists as checkJWTExistsRedis,
} from './redis_repository.js'

// need to separate orm functions from repository to decouple business logic from persistence
export async function ormCreateUser(username, password) {
  try {
    const newUser = await createUser({ username, password })
    newUser.save()
    return true
  } catch (err) {
    console.log('ERROR: Could not create new user')
    return { err }
  }
}

export const ormFindUserByUsername = async (username) => {
  try {
    return await findUser({ username })
  } catch (err) {
    console.log('ERROR: Could not query for user')
    return { err }
  }
}

export const ormCheckIfUserExists = async (username) => {
  try {
    const userIsFound = await checkIfUserExists({ username })
    return userIsFound ? false : true
  } catch (err) {
    console.log('ERROR: Could not check if user exists')
    return { err }
  }
}

export const ormInvalidateJWT = async (token) => {
  try {
    return addJWTToRedis(token)
  } catch (err) {
    console.log('ERROR: Could not save JWT to redis blacklist')
    return { err }
  }
}

export const ormIsJWTValid = async (token) => {
  try {
    return !checkJWTExistsRedis(token)
  } catch (err) {
    console.log('ERROR: Could not query redis JWT blacklist')
    return { err }
  }
}
