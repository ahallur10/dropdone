import type { Metadata } from "next";
import { MockApp } from "./mock-app";

// Clickable mock of the Dropdone desktop app, for recording clips and grabbing stills.
// Not linked from the site. Keys: R restarts the queue, [ toggles the sidebar.
export const metadata: Metadata = {
  title: "Dropdone app (mock)",
  robots: { index: false, follow: false },
};

export default function MockPage() {
  return <MockApp />;
}
