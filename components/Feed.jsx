'use client';

import { useState, useEffect } from "react";
import PromptCard from "./PromptCard";
import { useRouter } from "@node_modules/next/navigation";
import { useSession } from "@node_modules/next-auth/react";

const PromptCardList = ({ data, handleTagClick, handleUsernameClick }) => {
  return (
    <div className="mt-16 prompt_layout ">
      {data.map((post) => {
        return <PromptCard key={post._id} post={post} handleTagClick={handleTagClick} handleUsernameClick={handleUsernameClick} />
      })}
    </div>
  )
}

const Feed = () => {

  const [searchText, setSearchText] = useState("");
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);

  useEffect(() => {  
      const fetchPosts = async () => {
        console.log("Feed Component fetch Posts called")
        const response = await fetch("/api/prompt");
        const data = await response.json();
        setPosts(data);
      }
      fetchPosts();
  }
    
  , [])

  useEffect(() => {
    console.log(posts);
  }, [posts])

  const router = useRouter();
  const {data: session} = useSession();
  console.log(session)

  const handleSearchChange = (e) => {
    e.preventDefault();
    // console.log("handleSearchChange e.target.value ==", e.target.value);
    setSearchText(e.target.value);
  }
  const handleTagClick = (postTag) => {
    setSearchText(postTag);
  }

  const handleUsernameClick = (creator) => {
    console.log(creator);
    console.log(session?.user.id);
    if (creator._id.toString() === session?.user.id) {
      router.push("/profile");
      return;
    }
    router.push(`/profile/${creator._id.toString()}`)
  }
  useEffect(() => {
    const filtered = posts.filter((post) => {
      return (
        post.creator.username.toLowerCase().includes(searchText.toLowerCase()) ||
        post.prompt.toLowerCase().includes(searchText.toLowerCase()) ||
        post.tag.toLowerCase().includes(searchText.toLowerCase())
      );
    });
    setFilteredPosts(filtered);
    // console.log("UseEffect on Search Text Change" , searchText);
  }, [searchText])


  return (
    <section className="feed">
      <form className="relative w-full flex-center">
        <input type="text" placeholder="Search for a tag or a username" value={searchText} onChange={handleSearchChange} required className="search_input peer"/>

      </form>
      <PromptCardList data={filteredPosts.length != 0 ? filteredPosts : posts} handleTagClick={handleTagClick} handleUsernameClick={ handleUsernameClick} />
    </section>
  )
}

export default Feed