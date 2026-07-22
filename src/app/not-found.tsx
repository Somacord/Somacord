import Link from "next/link";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";

export default function NotFound() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <Eyebrow>404</Eyebrow>
      <h1 className="mb-3 text-4xl">This gathering doesn&apos;t exist yet.</h1>
      <p className="text-ink-muted mb-8 max-w-md">
        The page you&apos;re looking for may have moved, or hasn&apos;t been built yet. Let&apos;s
        get you back to somewhere real.
      </p>
      <Button asChild variant="primary">
        <Link href="/">Back to home</Link>
      </Button>
    </Container>
  );
}
