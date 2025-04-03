export interface Challenge {
  id: string
  slug: string
  name: string
  description: string
  content: string
  scaffold: string
  funcName: string
  level: number
  created_at: Date
  userId: string
  tests?: Test[]
  user?: User
}

export interface Test {
  id: string
  challengeId: string
  inputs: string
  output: string
  challenge?: Challenge
}

export interface TestResult {
  test: string,
  esperado: string,
  obtenido: string,
  check: boolean
}

export interface Submission {
  id: string
  code: string
  complete: boolean
  complete_time: string
  votes: number
  rank: string
  created_at: string
  userId: string
  challengeId: string
  user?: User
}