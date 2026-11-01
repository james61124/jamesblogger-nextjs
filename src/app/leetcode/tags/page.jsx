import { Suspense } from "react";
import LeetcodeList from "@/components/LeetcodeList";
import { LEETCODE_JSON_PATH } from "@/lib/categories";

export default function LeetcodeTagsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LeetcodeList json_path={LEETCODE_JSON_PATH} category="leetcode" />
    </Suspense>
  );
}
