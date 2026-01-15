import { Suspense } from "react";
import EditPromptClient from "@components/EditPromptClient";

export default function UpdatePromptPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EditPromptClient />
    </Suspense>
  );
}