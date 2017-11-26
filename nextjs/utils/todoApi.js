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


export async function apiTodolist(id) {
  const response = await fetch(`http://localhost:3000/api/todolist?id=${id}`)
  const json = await response.json()
  isResponseError(json)
  return json.results
}
export async function apiTodos(todolistId) {
  const response = await fetch(`http://localhost:3000/api/todos?todolist_id=${todolistId}`)
  const json = await response.json()
  isResponseError(json)
  return json.results
}

export async function apiAddTodo(todolistId, text, deadlineAt) {
  const obj = {
    todolist_id: todolistId,
    text,
    deadline_at: deadlineAt,
  }
  const method = 'POST'
  const body = JSON.stringify(obj)
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  }
  const response = await fetch('http://localhost:3000/api/add_todo', { method, headers, body })
  const json = await response.json()
  isResponseError(json)
  return json.results
}

export async function apiChangeCompleatTodo(id, complete) {
  const obj = {
    id,
    complete,
  }
  const method = 'PATCH'
  const body = JSON.stringify(obj)
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  }
  const response = await fetch('http://localhost:3000/api/change_todo', { method, headers, body })
  const json = await response.json()
  isResponseError(json)
  return json.results
}