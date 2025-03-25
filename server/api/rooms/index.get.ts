export default defineEventHandler(() => {
  const rooms = [
    { 
      id: 1,
      code: 'caracol',
      name: 'Problema del tablero de caracol',
      description: 'El tablero de caracol es un problema de matemáticas que consiste en determinar el número de casillas que recorre un caracol al subir una escalera de n peldaños.',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Snail_on_stairs.jpg/800px-Snail_on_stairs.jpg',
      difficulty: 'easy',
      tags: ['matemáticas', 'lógica'],
      public: true,
    },

  ]
  return rooms
})