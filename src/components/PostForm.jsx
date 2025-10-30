import React, { useState } from 'react'

export default function PostForm({ onCreate }) {
  const [author, setAuthor] = useState('')
  const [content, setContent] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const reset = () => {
    setAuthor('')
    setContent('')
    setImageUrl('')
    setError(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      await onCreate({ author, content, imageUrl })
      reset()
    } catch (err) {
      setError(err.message || 'Failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{marginBottom:8}}>
        <strong>Create a new post</strong>
      </div>
      <div className="form-row">
        <input className="input small" placeholder="Author" value={author} onChange={e => setAuthor(e.target.value)} />
        <input className="input small" placeholder="Image URL (optional)" value={imageUrl} onChange={e => setImageUrl(e.target.value)} />
      </div>
      <div style={{marginBottom:8}}>
        <textarea className="input" rows="3" placeholder="What's on your mind?" value={content} onChange={e => setContent(e.target.value)} />
      </div>
      <div className="controls">
        <button className="btn btn-primary" type="submit" disabled={saving}>{saving ? 'Posting...' : 'Post'}</button>
        <button type="button" className="btn" onClick={reset}>Reset</button>
      </div>
      {error && <div style={{color:'red', marginTop:8}}>{error}</div>}
    </form>
  )
}