export const toErrorMap = ({ field, message }) => {
  let error: Record<string, string> = {}
  error[field] = message
  console.log(error)
  return error
}
