import { use } from "react";
import LeetcodeList from "@/components/LeetcodeList";

export default function LeetcodePage2({ searchParams: searchParamsPromise }) {
  return <LeetcodeList json_path="/metadata/leetcode_metadata.json" category="leetcode" />;
}