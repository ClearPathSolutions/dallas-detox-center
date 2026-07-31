import { Container } from "@/components/ui/Container";

/**
 * Layout for legal documents.
 *
 * Deliberately plainer than PageTemplate: no gallery, no insurance strip, no
 * conversion bands. A notice about how health information is handled should not
 * be interrupted by "Verify Your Insurance".
 */
export function LegalTemplate({
  title,
  intro,
  updated,
  children,
}: {
  title: string;
  intro?: string;
  updated?: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <section className="bg-navy-900 py-14 lg:py-16">
        <Container>
          <h1 className="max-w-3xl text-3xl text-white sm:text-4xl">{title}</h1>
          {intro && <p className="mt-4 max-w-2xl text-navy-200">{intro}</p>}
          {updated && (
            <p className="mt-5 text-sm text-navy-300">Last updated: {updated}</p>
          )}
        </Container>
      </section>

      <section className="bg-white py-14 lg:py-16">
        <Container>
          <div className="prose-ddc mx-auto max-w-3xl">{children}</div>
        </Container>
      </section>
    </>
  );
}
