import { ErrorTypesRoutine } from "@/types/Events"

export function ErrorRoutine(type: ErrorTypesRoutine, message: string) {
  const error = new Error()

  error.cause = type
  error.message = message

  return error
}