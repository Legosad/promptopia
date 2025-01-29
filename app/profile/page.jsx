'use client'
import { useState, useEffect } from 'react';
import { useSession } from '@node_modules/next-auth/react';
import { useRouter } from '@node_modules/next/navigation';
import Profile from '@components/Profile.jsx';

const MyProfile = () => {
  const router = useRouter();
    const { data: session } = useSession();
    const [posts, setPosts] = useState([])
  useEffect(() => {
    if (!session?.user?.id) {
      console.log("Session ID not found, skipping fetch.");
      return;
    } else {
      const fetchPosts = async () => {
        console.log("Fetch Posts called in My Profile")
        console.log(session?.user.id)
        const response = await fetch(`/api/users/${session?.user.id}/posts`);
        const data = await response.json();
        console.log("Data from fetch posts in My Profile", data)
        setPosts(data);
      }
      if (session?.user.id) {
        fetchPosts();
      }
    }
  }, [session])
  
  useEffect(() => {
      console.log("Posts in My Profile =",posts)
    },[posts])

    const handleEdit = (post) => {
      router.push(`/update-prompt?id=${post._id}`);
    }
    const handleDelete = async (post) => {
      const hasConfirmed = confirm("Are you sure you want to delete this prompt?");

      if (hasConfirmed) {
        try {
          await fetch(`/api/prompt/${post._id.toString()}`, {
            method: 'DELETE'
          })
          const filteredPosts = posts.filter((p) => p._id !== post._id);
          setPosts(filteredPosts);

        } catch (error) {
          console.log(error);
        }
      }
    }
  return (
    <Profile 
    name="My" 
    desc="Welcome to your personalized profile page" 
    data={posts} 
    handleEdit={handleEdit} 
    handleDelete={handleDelete} />
  )
}

export default MyProfile