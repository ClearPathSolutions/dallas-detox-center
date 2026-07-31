import Image from "next/image";
import Link from "next/link";
import {
  Phone,
  ShieldCheck,
  ArrowRight,
  Stethoscope,
  Home as HomeIcon,
  Brain,
  LifeBuoy,
  Activity,
  UserCog,
  Smartphone,
  HeartPulse,
  Check,
  Award,
  Clock,
  MapPin,
} from "lucide-react";
import { site } from "@/lib/site";
import { facility, heroImage } from "@/lib/media";
import { getRecentPosts, getPost } from "@/lib/content";
import { Container } from "@/components/ui/Container";
import { SmartImage } from "@/components/ui/SmartImage";
import { InsuranceStrip } from "@/components/sections/InsuranceStrip";
import { CtaBand } from "@/components/sections/CtaBand";
import { GoogleReviews } from "@/components/sections/GoogleReviews";
import { PostCard } from "@/components/content/PostCard";
import { Faq, FaqSchema } from "@/components/ui/Faq";
import faqs from "@/content/faqs.json";
import { JsonLd, organisationSchema } from "@/lib/schema";

const services = [
  { title: "Medical Detox", href: "/treatment-services/detox", icon: Stethoscope, img: facility.gallery[4], desc: "24/7 physician-supervised withdrawal management for a safe, comfortable start." },
  { title: "Residential Inpatient", href: "/treatment-services/residential-inpatient", icon: HomeIcon, img: facility.gallery[1], desc: "Immersive, structured care in a private residential setting." },
  { title: "Mental Health Residential", href: "/treatment-services/mental-health-residential", icon: Brain, img: facility.gallery[3], desc: "Integrated treatment for depression, anxiety, trauma, and more." },
  { title: "Aftercare Planning", href: "/treatment-services/aftercare-planning", icon: LifeBuoy, img: facility.gallery[6], desc: "A lasting plan and support network to protect your recovery." },
  { title: "Dual-Diagnosis Program", href: "/treatment-services/dual-diagnosis", icon: Activity, img: facility.gallery[5], desc: "Treating addiction and co-occurring mental health together." },
];

const features = [
  { title: "Individualized Care", icon: UserCog, text: "At our Dallas drug and alcohol rehab, we treat each client as a unique individual, with customized treatment plans according to each client's needs." },
  { title: "Devices Allowed", icon: Smartphone, text: "We understand that life doesn't stop just because you are ready to get help. Clients are allowed access to their devices per clinical recommendations." },
  { title: "Dual-Diagnosis Focus", icon: HeartPulse, text: "We understand that many clients also need treatment for co-occurring mental health issues, this is why we focus on dual-diagnosis treatment programs in Dallas." },
];

const substances = ["Alcohol Addiction", "Benzo Addiction", "Opioid Addiction", "Prescription Drug Addiction", "And More..."];
const mental = ["Anxiety", "Bipolar Disorder", "Depression", "PTSD/Trauma", "And More..."];
const therapies = ["Individual Therapy", "Process Group Therapy", "Cognitive Behavioral Therapy", "Equine Therapy", "Dual-Diagnosis Program", "Family Therapy", "Medication-Assisted Therapy", "Rational Emotive Therapy", "Art & Music Therapy", "Recreational Activities"];
const callbackBenefits = ["No Obligation When You Contact Us", "All Contact is Completely Confidential", "Highly-Experienced & Caring Staff", "Hand-Crafted, Individualized Treatment Plans", "True Dual-Diagnosis with On-Staff Psychiatrist"];


export default function Home() {
  const recent = getRecentPosts(3).map((p) => {
    const full = getPost(p.slug)!;
    return { slug: full.slug, path: full.path, title: full.title, date: full.date, category: full.category, excerpt: full.excerpt, image: full.featured?.src ?? null };
  });

  return (
    <>
      <JsonLd data={organisationSchema()} />

      {/* HERO */}
      <section className="relative overflow-hidden bg-navy-950">
        <Image src={heroImage} alt="" fill priority sizes="100vw" className="object-cover" />
        {/* Light left-weighted scrim: keeps the headline legible while the photo stays bright. */}
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950/80 via-navy-950/35 to-transparent" />
        <Container className="relative py-20 lg:py-28">
          <div className="max-w-2xl animate-fade-up">
            <p className="eyebrow text-brand-300">A Private Sanctuary for Healing in Texas</p>
            <h1 className="mt-4 text-4xl leading-[1.08] text-white sm:text-5xl lg:text-6xl">
              Premier Mental Health &amp; Addiction Recovery in Dallas, TX
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-navy-100">
              Receive expert support at our drug and alcohol addiction treatment center, where we
              combine medical detox with private residential care and dual diagnosis support to help
              you achieve lasting sobriety.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a href={site.phone.href} className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-700 px-8 py-4 text-base font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-brand-800">
                <Phone className="h-5 w-5" /> {site.phone.display}
              </a>
              <Link href="/verify-insurance" className="inline-flex items-center justify-center gap-2 rounded-full bg-accent-700 px-8 py-4 text-base font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-accent-800">
                <ShieldCheck className="h-5 w-5" /> Verify Insurance
              </Link>
            </div>
            <ul className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm text-navy-100">
              <li className="inline-flex items-center gap-2"><Clock className="h-4 w-4 text-brand-300" /> 24/7 Confidential Admissions</li>
              <li className="inline-flex items-center gap-2"><Award className="h-4 w-4 text-brand-300" /> Joint Commission Accredited</li>
              <li className="inline-flex items-center gap-2"><MapPin className="h-4 w-4 text-brand-300" /> Weatherford, TX</li>
            </ul>
          </div>
        </Container>
      </section>

      {/* WHO WE ARE */}
      <section className="bg-white py-16 lg:py-24">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="relative">
              <div className="overflow-hidden rounded-3xl shadow-xl ring-1 ring-navy-900/5">
                <SmartImage src={facility.gallery[7].src} alt="Dallas Detox Center facility" sizes="(min-width:1024px) 36rem, 100vw" />
              </div>
              <div className="absolute -bottom-6 -right-4 hidden rounded-2xl bg-navy-800 px-6 py-5 text-white shadow-xl sm:block">
                <p className="font-display text-3xl">10+ Years</p>
                <p className="text-xs text-navy-200">Backed by Quadrant Health Group</p>
              </div>
            </div>
            <div>
              <p className="eyebrow text-brand-600">More About Us</p>
              <h2 className="mt-3 font-display text-3xl text-navy-800 sm:text-4xl">Who We Are</h2>
              <p className="mt-5 leading-relaxed text-navy-600">
                Welcome to our luxury drug rehab in Dallas, a state-of-the-art drug &amp; alcohol
                treatment center, located on a residential campus in Texas. Our Dallas drug rehab
                center provides evidence-based, supportive clinical care for those seeking recovery
                from addiction. If you or a loved one is struggling with substance abuse, Dallas
                Detox Center is your top-choice for treatment.
              </p>
              <p className="mt-4 leading-relaxed text-navy-600">
                DDC was started with a simple mission: to help those suffering from drug &amp; alcohol
                addiction in finding personalized solutions to achieve long-term recovery. We believe
                in treating each client as the unique individual you are, combining traditional,
                holistic and evidence-based practices to provide you with the healing you deserve.
              </p>
              <Link href="/about-us" className="mt-7 inline-flex items-center gap-2 rounded-full border border-navy-200 px-6 py-3 text-sm font-semibold text-navy-800 transition hover:border-brand-400 hover:text-brand-700">
                Learn More About Us <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* SERVICES */}
      <section className="bg-sand-50 py-16 lg:py-24">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow text-brand-600">Our Programs</p>
            <h2 className="mt-3 font-display text-3xl text-navy-800 sm:text-4xl">A Full Continuum of Care</h2>
            <p className="mt-4 text-navy-600">
              From detoxification to inpatient and lifetime aftercare, we offer our clients the full
              spectrum of addiction and mental health treatment.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <Link key={s.title} href={s.href} className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-navy-900/5 transition hover:-translate-y-1 hover:shadow-lg">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <SmartImage src={s.img.src} alt={s.title} sizes="(min-width:1024px) 24rem, 100vw" className="h-full object-cover transition duration-500 group-hover:scale-105" />
                  <div className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white/95 text-brand-600 shadow"><s.icon className="h-5 w-5" /></div>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-display text-xl text-navy-800 group-hover:text-brand-700">{s.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-navy-500">{s.desc}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 group-hover:gap-2.5">Learn more <ArrowRight className="h-4 w-4 transition-all" /></span>
                </div>
              </Link>
            ))}
            <div className="flex flex-col justify-center rounded-2xl bg-navy-800 p-7 text-white">
              <h3 className="font-display text-2xl">Not sure where to start?</h3>
              <p className="mt-2 text-sm text-navy-200">Our admissions team will help you find the right level of care — confidentially and at no cost.</p>
              <a href={site.phone.href} className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-brand-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-800"><Phone className="h-4 w-4" /> {site.phone.display}</a>
            </div>
          </div>
        </Container>
      </section>

      <InsuranceStrip />

      {/* HOW WE TREAT / WHO WE HELP */}
      <section className="bg-white py-16 lg:py-24">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2">
            <div className="rounded-3xl bg-sand-50 p-8 lg:p-10">
              <h2 className="font-display text-3xl text-navy-800">How We Treat</h2>
              <p className="mt-4 leading-relaxed text-navy-600">
                Our drug &amp; alcohol rehab combine high-level medical expertise with compassionate,
                individualized support. Whether you require 24/7 clinical supervision during detox or
                specialized dual-diagnosis care in a residential setting, we provide the tools and
                environment necessary for true stabilization.
              </p>
              <Link href="/treatment-services" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-700 hover:gap-3">Explore treatment <ArrowRight className="h-4 w-4" /></Link>
            </div>
            <div className="rounded-3xl bg-sand-50 p-8 lg:p-10">
              <h2 className="font-display text-3xl text-navy-800">Who We Help</h2>
              <p className="mt-4 leading-relaxed text-navy-600">
                At Dallas Detox Center, we understand that every journey to recovery is deeply
                personal. We provide specialized treatment tracks tailored to the unique life
                experiences of professionals, veterans, first responders, and students to ensure a
                path to wellness that truly fits who you are.
              </p>
              <Link href="/who-we-help" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-700 hover:gap-3">See who we help <ArrowRight className="h-4 w-4" /></Link>
            </div>
          </div>

          <div className="mt-16 text-center">
            <p className="eyebrow text-brand-600">Your Recovery, Your Path</p>
            <h2 className="mt-3 font-display text-3xl text-navy-800 sm:text-4xl">Treatment Designed Around Your Needs</h2>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="rounded-2xl border border-sand-200 bg-white p-7 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600"><f.icon className="h-6 w-6" /></div>
                <h3 className="mt-5 font-display text-xl text-navy-800">{f.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-navy-600">{f.text}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* FACILITY GALLERY */}
      <section className="bg-navy-900 py-16 lg:py-24">
        <Container>
          <div className="grid items-end gap-6 lg:grid-cols-2">
            <div>
              <p className="eyebrow text-brand-400">A Modern, Luxury Facility</p>
              <h2 className="mt-3 font-display text-3xl text-white sm:text-4xl">Explore Our Environment</h2>
              <p className="mt-5 max-w-xl text-navy-200">
                Our newly-renovated treatment facility provides our clients with a secluded and safe
                space where recovery thrives. From semi-private rooms with flat screens to a gorgeous
                property surrounded by acres of luscious greenery, our luxury rehab in Texas provides
                the tools and space needed to recover from addiction.
              </p>
            </div>
            <div className="lg:text-right">
              <Link href="/tour" className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-navy-800 transition hover:bg-sand-100">Take a Full Tour <ArrowRight className="h-4 w-4" /></Link>
            </div>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
            {facility.gallery.map((g) => (
              <figure key={g.src} className="relative aspect-[4/3] overflow-hidden rounded-2xl ring-1 ring-white/10">
                <Image src={g.src} alt={g.alt} fill sizes="(min-width:768px) 22rem, 50vw" className="object-cover transition duration-500 hover:scale-105" />
              </figure>
            ))}
          </div>
        </Container>
      </section>

      {/* CONDITIONS + THERAPIES */}
      <section className="bg-white py-16 lg:py-24">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl text-navy-800 sm:text-4xl">Substances &amp; Mental Conditions We Treat</h2>
            <p className="mt-4 text-navy-600">
              We provide medically supervised detox and integrated care for a wide range of substance
              use disorders and co-occurring mental health conditions — treating both the addiction
              and the underlying emotional challenges at the same time.
            </p>
          </div>
          <div className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-2">
            <ConditionCard title="Substance Abuse" items={substances} />
            <ConditionCard title="Mental Health Disorders" items={mental} />
          </div>

          <div className="mt-14 rounded-3xl bg-sand-50 p-8 lg:p-10">
            <h3 className="text-center font-display text-2xl text-navy-800">Our Unique Therapies</h3>
            <ul className="mx-auto mt-8 grid max-w-4xl gap-x-8 gap-y-3 sm:grid-cols-2">
              {therapies.map((t) => (
                <li key={t} className="flex items-center gap-3 text-navy-700">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-100 text-accent-600"><Check className="h-3.5 w-3.5" strokeWidth={3} /></span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* CALLBACK CTA */}
      <section className="bg-navy-800 py-16 lg:py-20">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <p className="eyebrow text-brand-400">Request a Callback</p>
              <h2 className="mt-3 font-display text-3xl text-white sm:text-4xl">Let Us Help You Begin Your Journey to Recovery</h2>
              <p className="mt-5 text-navy-200">
                Whether you come to our program or not, we will help you find the best treatment
                options that meet your personal needs. Reach out — there is never any obligation.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a href={site.phone.href} className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-700 px-7 py-4 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-brand-800"><Phone className="h-5 w-5" /> {site.phone.display}</a>
                <Link href="/verify-insurance" className="inline-flex items-center justify-center gap-2 rounded-full bg-accent-700 px-7 py-4 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-accent-800">Verify Insurance</Link>
              </div>
            </div>
            <ul className="space-y-3">
              {callbackBenefits.map((b) => (
                <li key={b} className="flex items-center gap-3 rounded-xl bg-white/5 px-5 py-4 text-white ring-1 ring-white/10">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-700"><Check className="h-3.5 w-3.5" strokeWidth={3} /></span>
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* SEO CONTENT */}
      <section className="bg-white py-16">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="font-display text-3xl text-navy-800">Get the Help You Need at Our Drug &amp; Alcohol Detox Center in Dallas</h2>
            <div className="mt-6 space-y-4 leading-relaxed text-navy-600">
              <p>Dallas Detox Center provides drug and alcohol detox in Dallas TX with direct access to residential treatment, dual diagnosis care and mental health services. Our program is designed for individuals who need withdrawal management, clinical stabilization and structured inpatient care to begin recovery.</p>
              <p>We treat alcohol, opioids, benzodiazepines, cocaine and other substances using medically supervised detox protocols and evidence-based therapy. All care follows ASAM criteria to ensure the appropriate level of treatment based on medical and psychiatric needs. As part of Quadrant Health Group, our programs are backed by over 10 years of experience in addiction treatment. Located in Dallas TX, our facility is accessible from I-35E, I-30 and Dallas North Tollway, and close to Dallas Fort Worth International Airport and Love Field.</p>
              <p>Need detox or residential treatment in Dallas TX? Call now to speak with admissions or verify your insurance and get started today.</p>
            </div>
          </div>
        </Container>
      </section>

      {/* LATEST ARTICLES */}
      <section className="bg-sand-50 py-16 lg:py-24">
        <Container>
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div>
              <p className="eyebrow text-brand-600">From Our Team</p>
              <h2 className="mt-2 font-display text-3xl text-navy-800 sm:text-4xl">Our Latest Articles</h2>
            </div>
            <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700 hover:gap-3">View all articles <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {recent.map((p) => <PostCard key={p.slug} post={p} />)}
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section className="bg-white py-16 lg:py-24">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow text-brand-600">Answers</p>
            <h2 className="mt-3 font-display text-3xl text-navy-800 sm:text-4xl">Frequently Asked Questions</h2>
          </div>
          <div className="mt-10">
            <Faq items={faqs.home} />
          </div>
        </Container>
      </section>
      <FaqSchema items={faqs.home} />

      {/* GOOGLE REVIEWS — renders only when GOOGLE_PLACES_API_KEY is configured */}
      <GoogleReviews />

      <CtaBand />
    </>
  );
}

function ConditionCard({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-2xl border border-sand-200 bg-white p-7 shadow-sm">
      <h3 className="font-display text-xl text-navy-800">{title}</h3>
      <ul className="mt-5 space-y-3">
        {items.map((i) => (
          <li key={i} className="flex items-center gap-3 text-navy-700">
            <span className="h-2 w-2 rounded-full bg-brand-400" /> {i}
          </li>
        ))}
      </ul>
    </div>
  );
}
