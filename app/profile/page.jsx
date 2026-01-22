'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Profile from '@components/Profile.jsx'

const MyProfile = () => {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [posts, setPosts] = useState([])

  useEffect(() => {
    if (!session?.user?.id) return

    const fetchPosts = async () => {
      const response = await fetch(`/api/users/${session.user.id}/posts`)
      const data = await response.json()
      setPosts(data)
    }

    fetchPosts()
  }, [session?.user?.id])

  if (status === 'loading') {
    return <p>Loading...</p>
  }

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
      name="My"
      desc="Welcome to your personalized profile page"
      data={posts}
      canEdit={true}
      handleEdit={handleEdit}
      handleDelete={handleDelete}
    />
  )
}

export default MyProfile
