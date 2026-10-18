import type { Metadata } from "next";
import { ComingSoon } from "@/components/layout/ComingSoon";

export const metadata: Metadata = { title: "Gallery" };

export default function GalleryPage() {
  return <ComingSoon title="Gallery" />;
}
