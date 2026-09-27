import { Container } from "@/components/ui/container";

export default function PublicLoading() {
  return (
    <Container className="py-16 sm:py-24">
      <div className="h-3 w-28 bg-peach motion-safe:animate-pulse" />
      <div className="mt-6 h-16 max-w-2xl bg-peach motion-safe:animate-pulse sm:h-24" />
      <div className="mt-6 h-6 max-w-xl bg-peach motion-safe:animate-pulse" />
      <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="aspect-[4/5] bg-peach motion-safe:animate-pulse" />
        <div className="aspect-[5/4] bg-peach motion-safe:animate-pulse" />
        <div className="aspect-square bg-peach motion-safe:animate-pulse" />
      </div>
    </Container>
  );
}
