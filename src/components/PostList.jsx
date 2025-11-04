import React, { useState } from 'react'

export default function PostList({ posts, onDelete, onUpdate }) {
  return (
    <div>
      {posts.map(post => (
        <PostItem key={post.id} post={post} onDelete={onDelete} onUpdate={onUpdate} />
      ))}
    </div>
  )
}

function PostItem({ post, onDelete, onUpdate }) {
  const [editing, setEditing] = useState(false)
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false) // New state for confirmation
  const [author, setAuthor] = useState(post.author || '')
  const [content, setContent] = useState(post.content || '')
  const [imageUrl, setImageUrl] = useState(post.imageUrl || '')
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState(null)

  // Function to request delete confirmation
  const handleDeleteRequest = () => {
    setIsConfirmingDelete(true)
  }

  // Function to execute deletion
  const handleConfirmDelete = async () => {
    setIsConfirmingDelete(false)
    try {
      await onDelete(post.id)
    } catch (e) {
      setErr('Failed to delete')
    }
  }

  // Function to cancel deletion
  const handleCancelDelete = () => {
    setIsConfirmingDelete(false)
    setErr(null) // Clear any previous error when cancelling
  }

  const handleSave = async () => {
    setSaving(true)
    setErr(null)
    try {
      await onUpdate(post.id, { author, content, imageUrl })
      setEditing(false)
    } catch (e) {
      setErr('Failed to update')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="post">
      {!editing ? (
        <>
          <div className="post-meta">
            <strong>{post.author}</strong> · <span>{new Date(post.createdDate || post.createdAt || '').toLocaleString() || '—'}</span>
          </div>
          <div>{post.content}</div>
          {post.imageUrl && (
            <div style={{ marginTop: 8 }}>
              <img src={post.imageUrl} alt="" style={{ maxWidth: '100%', borderRadius: 6 }} />
            </div>
          )}

          {!isConfirmingDelete ? (
            <div className="controls" style={{ marginTop: 8 }}>
              <button className="btn" onClick={() => setEditing(true)}>Edit</button>
              <button className="btn btn-danger" onClick={handleDeleteRequest}>Delete</button>
            </div>
          ) : (
            <div className="controls" style={{ marginTop: 8, display: 'flex', alignItems: 'center' }}>
              <span style={{ marginRight: 10, fontWeight: 500 }}>Are you sure?</span>
              <button className="btn btn-danger small" onClick={handleConfirmDelete}>Confirm Delete</button>
              <button className="btn small" onClick={handleCancelDelete}>Cancel</button>
            </div>
          )}

          {err && <div style={{ color: 'red', marginTop: 8 }}>{err}</div>}
        </>
      ) : (
        <>
          <div className="form-row">
            <input className="input small" value={author} onChange={e => setAuthor(e.target.value)} />
            <input className="input small" value={imageUrl} onChange={e => setImageUrl(e.target.value)} />
          </div>
          <div>
            <textarea className="input" rows="3" value={content} onChange={e => setContent(e.target.value)} />
          </div>
          <div className="controls" style={{ marginTop: 8 }}>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
            <button className="btn" onClick={() => setEditing(false)}>Cancel</button>
          </div>
          {err && <div style={{ color: 'red', marginTop: 8 }}>{err}</div>}
        </>
      )}
    </div>
  )
}
