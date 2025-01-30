'use client'
import { useState, useEffect } from 'react';
import { useSession } from '@node_modules/next-auth/react';
import { useRouter, useParams } from '@node_modules/next/navigation';
import Profile from '@components/Profile.jsx';


const UserProfile = () => {
    const [posts, setPosts] = useState([]);
    // const [user, setUser] = useState({});
    const { id } = useParams();
    useEffect(() => {
        const fetchPosts = async (id) => {
            const response = await fetch(`/api/users/${id}/posts`);
            const data = await response.json()
            setPosts(data);
        }
        fetchPosts(id);
    },[])
    return (
    <Profile 
    name="User" 
    desc="" 
    data={posts} />
  )
}

export default UserProfile