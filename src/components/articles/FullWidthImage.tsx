import EditorialImage from "./EditorialImage";
import type { ArticleImage } from "./types";

export default function FullWidthImage(props: ArticleImage) {
  return <EditorialImage {...props} fullBleed />;
}
