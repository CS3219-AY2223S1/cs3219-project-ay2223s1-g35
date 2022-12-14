import {
  findMatchInCache,
  deleteMatchInCache,
  isUserInCache,
} from '../model/redis-repository.js'

import {
  ormFindAllRooms as _findAllRooms,
  ormFindOneRoom as _findOneRoom,
  ormCreateRoom as _createRoom,
  ormDeleteRoom as _deleteRoom,
  ormUpdateRoom as _updateRoom,
  ormDeleteRoomByUsername as _deleteRoomByUsername,
} from '../model/socket-room-orm.js'

export const findMatch = async (req, res) => {
  try {
    const { uuid, socketID, difficulty } = req.body
    if (!(uuid && socketID && difficulty)) {
      return res
        .status(400)
        .json({ message: 'One or more fields are missing!' })
    }

    if (await isUserInCache(uuid)) {
      return res
        .status(409)
        .json({ message: 'User is already in a matching queue.' })
    }

    const cacheUser = await findMatchInCache(difficulty, uuid, socketID)

    if (!cacheUser) {
      return res.status(204)
    }

    return res
      .status(200)
      .json({ uuid: cacheUser.uuid, socketID: cacheUser.socketID })
  } catch (err) {
    return res.status(500).json({ message: 'Error with Redis!' })
  }
}

export const deleteMatch = async (req, res) => {
  try {
    const { uuid, socketID, difficulty } = req.body
    if (!(uuid && socketID && difficulty)) {
      return res
        .status(400)
        .json({ message: 'One or more fields are missing!' })
    }

    const deleteUser = await deleteMatchInCache(difficulty, uuid, socketID)

    return deleteUser
      ? res.status(200).json({ message: 'Deleted entry from cache!' })
      : res.status(404).json({ message: 'Could not delete' })
  } catch (err) {
    return res.status(500).json({ message: 'Error with Redis!' })
  }
}

export const findAllRooms = async (req, res) => {
  console.log('GET /api/rooms ' + JSON.stringify(req.query))
  try {
    const rooms = await _findAllRooms(req.query)
    return res.status(200).json(rooms)
  } catch (err) {
    return res.status(500).json({ message: 'Error with finding all room!' })
  }
}

export const findOneRoom = async (req, res) => {
  console.log('GET /api/room ' + JSON.stringify(req.query))

  try {
    const rooms = await _findOneRoom(req.query)
    return res.status(200).json(rooms)
  } catch (err) {
    return res.status(500).json({ message: 'Error with finding all room!' })
  }
}

export const createRoom = async (req, res) => {
  console.log('POST /api/room ' + JSON.stringify(req.body))

  try {
    const err = await _createRoom(req.body)

    if (err) {
      // console.log(err)
      if (err.name === 'MongoServerError' && err.code === 11000) {
        // Duplicate room_id
        return res
          .status(409)
          .send({ success: false, message: 'Room already exist!' })
      } else {
        // Some other error
        return res.status(422).send({ success: false, message: err })
      }
    } else {
      return res
        .status(201)
        .send({ success: true, message: 'Room created successfully!' })
    }
  } catch (err) {
    return res.status(500).json({ message: 'Error with creating room!' })
  }
}

export const updateRoom = async (req, res) => {
  console.log('PATCH /api/room ' + JSON.stringify(req.body))
  try {
    const room = await _updateRoom(req.params.room_id, req.body)
    return res
      .status(200)
      .json({ message: 'Room updated successfully!', data: room })
  } catch (err) {
    return res.status(400).json({ message: 'Error with updating room!' })
  }
}

export const deleteRoom = async (req, res) => {
  console.log('DELETE /api/room ' + JSON.stringify(req.params.room_id))

  try {
    const room_id = await _deleteRoom(req.params.room_id)
    return res
      .status(200)
      .json({ message: 'Room ' + room_id + ' deleted successfully!' })
  } catch (err) {
    return res.status(500).json({ message: 'Error with deleting room!' })
  }
}

export const deleteRoomByUsername = (io) => async (req, res) => {
  const { username } = req.params
  if (!username) {
    return res.status(400).json({ message: 'Username not provided.' })
  }

  try {
    const deletedRoom = await _deleteRoomByUsername(username)
    if (!deletedRoom) {
      return res
        .status(404)
        .json({ message: `No room for user ${username} exists.` })
    }

    // inform partner that the room is now deleted
    io.to(deletedRoom.room_id).emit('partner-left', 'partner left')
    return res.status(200).json({
      message: `Room for user ${username} deleted successfully!`,
      room: deletedRoom,
    })
  } catch (err) {
    return res.status(500).json({ message: 'Error with deleting room!' })
  }
}
