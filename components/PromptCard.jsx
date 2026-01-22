'use client'

import { useState } from 'react'
import Image from 'next/image'

const PromptCard = ({
  post,
  canEdit,
  handleEdit,
  handleDelete,
  handleTagClick,
  handleUsernameClick,
}) => {
  const [copied, setCopied] = useState("")

  const handleCopy = () => {
    setCopied(post.prompt)
    navigator.clipboard.writeText(post.prompt)
    setTimeout(() => setCopied(""), 3000)
  }

  return (
    <div className="prompt_card">
      <div className="flex justify-between items-start gap-5">
        <div className="flex-1 flex gap-3 cursor-pointer">
          <Image
            src={post.creator.image}
            alt="user_image"
            width={40}
            height={40}
            className="rounded-full"
          />
          <div>
            <h3
              onClick={() =>
                handleUsernameClick && handleUsernameClick(post.creator)
              }
              className="font-satoshi font-semibold hover:text-sky-500"
            >
              {post.creator.username}
            </h3>
            <p className="font-inter text-sm text-gray-500">
              {post.creator.email}
            </p>
          </div>
        </div>

        <div className="copy_btn" onClick={handleCopy}>
          <Image
            alt="copy"
            src={
              copied === post.prompt
                ? '/assets/icons/tick.svg'
                : '/assets/icons/copy.svg'
            }
            width={12}
            height={12}
          />
        </div>
      </div>

      <p className="my-4 text-sm text-gray-700">{post.prompt}</p>

      <p
        className="text-sm blue_gradient cursor-pointer"
        onClick={() => handleTagClick && handleTagClick(post.tag)}
      >
        {post.tag}
      </p>

      {canEdit && (
        <div className="mt-5 flex gap-4 border-t pt-3">
          <p className="green_gradient cursor-pointer" onClick={handleEdit}>
            Edit
          </p>
          <p className="orange_gradient cursor-pointer" onClick={handleDelete}>
            Delete
          </p>
        </div>
      )}
    </div>
  )
}

export default PromptCard
