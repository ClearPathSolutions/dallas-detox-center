import Image from "next/image";
import Link from "next/link";
import { insurers } from "@/lib/site";
import { Container } from "@/components/ui/Container";
import { ShieldCheck } from "lucide-react";

export function InsuranceStrip() {
  return (
    <section className="bg-navy-800 py-16">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          {/*
            Reworded away from two claims we should not be making: network
            status ("Insurance Accepted", "We Work With Most Major Insurance")
            and cost outcome ("most of our clients pay little to nothing out of
            pocket"). What is offered instead is the thing we actually do —
            check a plan and report back on it.
          */}
          <p className="eyebrow text-brand-400">Insurance Verification</p>
          <h2 className="mt-3 text-3xl text-white sm:text-4xl">
            We&apos;ll Check What Your Plan Covers
          </h2>
          <p className="mt-4 text-navy-200">
            Send us your details and our admissions team will confirm your
            benefits with your provider and walk you through what they mean —
            confidentially, at no cost, with no obligation.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-2 items-center gap-x-8 gap-y-8 sm:grid-cols-3 lg:grid-cols-5">
          {insurers.map((ins) => (
            <div key={ins.name} className="flex items-center justify-center">
              <Image
                src={`/images/insurance/${ins.file}`}
                alt={ins.name}
                width={220}
                height={80}
                className="h-9 w-auto object-contain opacity-85 transition hover:opacity-100"
              />
            </div>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <Link
            href="/verify-insurance"
            className="inline-flex items-center gap-2 rounded-full bg-accent-700 px-7 py-4 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-accent-800"
          >
            <ShieldCheck className="h-5 w-5" /> Verify Your Benefits
          </Link>
        </div>
      </Container>
    </section>
  );
}
