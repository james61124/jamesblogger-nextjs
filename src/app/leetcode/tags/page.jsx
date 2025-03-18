import { use } from "react";
import LeetcodeList from "@/components/LeetcodeList";

export default function LeetcodePage2({ searchParams: searchParamsPromise }) {
  const searchParams = use(searchParamsPromise); // 🔥 這裡用 `use()` 來解開 Promise

  const json_path = searchParams?.json_path || "";
  const category = searchParams?.category || "";

  return <LeetcodeList json_path={json_path} category={category} />;
}