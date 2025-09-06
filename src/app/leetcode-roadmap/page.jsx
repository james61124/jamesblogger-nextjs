import TopicRoadmap from "@/components/LeetcodeRoadmap";
import { Suspense } from "react";

export default function LeetcodeRoadmapPage({}) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TopicRoadmap />
    </Suspense>
  );
}

export async function generateStaticParams() {
  return [];
}
