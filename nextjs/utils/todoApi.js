function isResponseError(response) {
  // console.log(response)
  if (response.success) return
  if (response.errorMessage) throw new Error(response.errorMessage)
  throw new Error('不明な通信エラー')
}

export async function apiTodolists() {
  const response = await fetch('http://localhost:3000/api/todolists')
  const json = await response.json()
  isResponseError(json)
  return json.results
}
export async function apiAddTodoList(title) {
  const obj = { title }
  const method = 'POST'
  const body = JSON.stringify(obj)
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  }
  const response = await fetch('http://localhost:3000/api/add_todolist', { method, headers, body })
  const json = await response.json()
  isResponseError(json)
  return json.results
}
