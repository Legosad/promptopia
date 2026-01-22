'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import Profile from '@components/Profile.jsx'

const UserProfile = () => {
  const [posts, setPosts] = useState([])
  const { data: session, status } = useSession()
  const { id } = useParams()
  const router = useRouter()

  useEffect(() => {
    if (!id) return

    const fetchPosts = async () => {
      const response = await fetch(`/api/users/${id}/posts`)
      const data = await response.json()
      setPosts(data)
    }

    fetchPosts()
  }, [id])

  if (status === 'loading') {
    return <p>Loading...</p>
  }

  const canEdit =
    session?.user?.isAdmin === true ||
    session?.user?.id === id

  const handleEdit = (post) => {
    router.push(`/update-prompt?id=${post._id}`)
  }

  const handleDelete = async (post) => {
    const confirmed = confirm('Are you sure you want to delete this prompt?')
    if (!confirmed) return

    await fetch(`/api/prompt/${post._id}`, { method: 'DELETE' })
    setPosts((prev) => prev.filter((p) => p._id !== post._id))
  }

  return (
    <Profile
      name="User"
      desc=""
      data={posts}
      canEdit={canEdit}
      handleEdit={handleEdit}
      handleDelete={handleDelete}
    />
  )
}

export default UserProfile
