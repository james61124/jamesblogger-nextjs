import { use } from "react";
import LeetcodeList from "@/components/LeetcodeList";
import { Suspense } from "react";

export default function LeetcodePage2({}) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LeetcodeList json_path="/metadata/leetcode_metadata.json" category="leetcode" />;
    </Suspense>
  );
  
}