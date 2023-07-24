export function ErrorRoutine(type: string, message: string) {
  const error = new Error()

  error.cause = type
  error.message = message

  return error
}