import React, { useEffect, useState } from 'react'
import axios from 'axios'

const API = '/api'

export default function App() {
  const [todos, setTodos]               = useState([])
  const [title, setTitle]               = useState('')
  const [loading, setLoading]           = useState(false)
  const [editingId, setEditingId]       = useState(null)
  const [editingTitle, setEditingTitle] = useState('')

  const fetchTodos = async () => {
    const res = await axios.get(`${API}/todos`)
    setTodos(res.data)
  }

  useEffect(() => { fetchTodos() }, [])

  const addTodo = async () => {
    if (!title.trim()) return
    setLoading(true)
    await axios.post(`${API}/todos`, { title })
    setTitle('')
    await fetchTodos()
    setLoading(false)
  }

  const toggleTodo = async (todo) => {
    await axios.put(`${API}/todos/${todo.id}`, { completed: !todo.completed })
    await fetchTodos()
  }

  const deleteTodo = async (id) => {
    await axios.delete(`${API}/todos/${id}`)
    await fetchTodos()
  }

  const startEdit = (todo) => {
    setEditingId(todo.id)
    setEditingTitle(todo.title)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditingTitle('')
  }

  const saveEdit = async (id) => {
    if (!editingTitle.trim()) return
    await axios.put(`${API}/todos/${id}`, { title: editingTitle })
    setEditingId(null)
    setEditingTitle('')
    await fetchTodos()
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Todo App</h1>

      <div style={styles.inputRow}>
        <input
          style={styles.input}
          value={title}
          onChange={e => setTitle(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addTodo()}
          placeholder="Nhap cong viec..."
        />
        <button style={styles.addBtn} onClick={addTodo} disabled={loading}>
          {loading ? '...' : 'Them'}
        </button>
      </div>

      {todos.length === 0 && (
        <p style={styles.empty}>Chua co cong viec nao!</p>
      )}

      {todos.map(todo => (
        <div key={todo.id} style={styles.item}>

          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => toggleTodo(todo)}
            style={styles.checkbox}
          />

          {editingId === todo.id ? (
            <input
              style={styles.editInput}
              value={editingTitle}
              onChange={e => setEditingTitle(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') saveEdit(todo.id)
                if (e.key === 'Escape') cancelEdit()
              }}
              autoFocus
            />
          ) : (
            <span style={{
              ...styles.text,
              textDecoration: todo.completed ? 'line-through' : 'none',
              color: todo.completed ? '#aaa' : '#222'
            }}>
              {todo.title}
            </span>
          )}

          {editingId === todo.id ? (
            <>
              <button style={styles.saveBtn} onClick={() => saveEdit(todo.id)}>Luu</button>
              <button style={styles.cancelBtn} onClick={cancelEdit}>Huy</button>
            </>
          ) : (
            <>
              <button style={styles.editBtn} onClick={() => startEdit(todo)}>Sua</button>
              <button style={styles.deleteBtn} onClick={() => deleteTodo(todo.id)}>Xoa</button>
            </>
          )}

        </div>
      ))}
    </div>
  )
}

const styles = {
  container:  { maxWidth: 500, margin: '60px auto', fontFamily: 'Arial, sans-serif', padding: '0 16px' },
  title:      { textAlign: 'center', marginBottom: 24, color: '#333', fontSize: 28, fontWeight: 'bold' },
  inputRow:   { display: 'flex', gap: 8, marginBottom: 20 },
  input:      { flex: 1, padding: '10px 14px', fontSize: 15, border: '1px solid #ddd', borderRadius: 8, outline: 'none' },
  addBtn:     { padding: '10px 20px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 15, fontWeight: 'bold' },
  item:       { display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: '#f9f9f9', borderRadius: 8, marginBottom: 8, border: '1px solid #eee' },
  checkbox:   { width: 18, height: 18, cursor: 'pointer', flexShrink: 0 },
  text:       { flex: 1, fontSize: 15 },
  editInput:  { flex: 1, padding: '4px 10px', fontSize: 15, border: '1px solid #4f46e5', borderRadius: 6, outline: 'none' },
  editBtn:    { background: '#f59e0b', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 12px', cursor: 'pointer', fontSize: 13, fontWeight: 'bold' },
  deleteBtn:  { background: '#ef4444', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 12px', cursor: 'pointer', fontSize: 13, fontWeight: 'bold' },
  saveBtn:    { background: '#22c55e', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 12px', cursor: 'pointer', fontSize: 13, fontWeight: 'bold' },
  cancelBtn:  { background: '#6b7280', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 12px', cursor: 'pointer', fontSize: 13, fontWeight: 'bold' },
  empty:      { textAlign: 'center', color: '#aaa', marginTop: 40, fontSize: 15 },
}
