import type { Socket } from 'socket.io'

export const handler = async (socket: Socket) => {
    socket.emit('connection', { message: 'New client connected' })
}

export const info = {
    name: 'connection',
}