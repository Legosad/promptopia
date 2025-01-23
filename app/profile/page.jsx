'use client'
import { useState, useEffect } from 'react';
import { useSession } from '@node_modules/next-auth/react';
import { useRouter } from '@node_modules/next/navigation';
import Profile from '@components/Profile.jsx';

const MyProfile = () => {
    const { data: session } = useSession();
    const [posts, setPosts] = useState([])
    useEffect(() => {
        const fetchPosts = async () => {
          const response = await fetch(`/api/users/${session?.user.id}/posts`);
          const data = await response.json();
          setPosts(data);
        }
        if (session?.user.id) {
            fetchPosts();
        }  
      }, [])

    const handleEdit = () => {

    }
    const handleDelete = () => {

    }
  return (
    <Profile 
    name="My" 
    desc="Welcome to your personalized profile page" 
    data={[]} 
    handleEdit={handleEdit} 
    handleDelete={handleDelete} />
  )
}

export default MyProfile