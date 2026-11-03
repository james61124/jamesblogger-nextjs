import UnusedFiles from "@/components/editor/UnusedFiles";
import { guardEditorPage } from "../guard";

export const dynamic = "force-dynamic";
export const metadata = { title: "Unused files · Editor", robots: { index: false } };

export default async function UnusedFilesPage({ searchParams }) {
  await guardEditorPage(searchParams);
  return <UnusedFiles />;
}
