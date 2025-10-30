import React, { useEffect, useState } from 'react'
import PostList from './components/PostList'
import PostForm from './components/PostForm'

export default function App() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // fetch all posts (backend /api/posts returns an array)
  const fetchPosts = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/posts')
      if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`)
      const data = await res.json()
      // Expecting an array (the backend returns [] when no posts)
      setPosts(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  const createPost = async ({ author, content, imageUrl }) => {
    const body = { author, content, imageUrl }
    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
    if (!res.ok) {
      throw new Error('Failed to create post')
    }
    const saved = await res.json()
    // Append to list
    setPosts(prev => [saved, ...prev])
    return saved
  }

  const deletePost = async (id) => {
    const res = await fetch(`/api/posts/${id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error('Failed to delete')
    setPosts(prev => prev.filter(p => p.id !== id))
  }

  const updatePost = async (id, { author, content, imageUrl }) => {
    const res = await fetch(`/api/posts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ author, content, imageUrl })
    })
    if (!res.ok) throw new Error('Failed to update')
    const updated = await res.json()
    setPosts(prev => prev.map(p => (p.id === updated.id ? updated : p)))
    return updated
  }

  return (
    <div className="container">
      <div className="header">
        <h1>Posts</h1>
      </div>

      <div className="card">
        <PostForm onCreate={createPost} />
      </div>

      {loading ? (
        <div className="card">
          <div className="empty">Loading...</div>
        </div>
      ) : error ? (
        <div className="card">
          <div className="empty">Error: {error}</div>
        </div>
      ) : posts.length === 0 ? null : (
        <div className="card">
          <PostList posts={posts} onDelete={deletePost} onUpdate={updatePost} />
        </div>
      )}
    </div>
  )
}