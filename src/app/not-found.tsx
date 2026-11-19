import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="grid min-h-[80svh] place-items-center bg-navy-950 px-6 pt-24 text-center text-ivory">
      <div>
        <p className="eyebrow text-champagne">404</p>
        <h1 className="display mt-6 text-6xl sm:text-8xl">This address isn’t ours — yet.</h1>
        <p className="mx-auto mt-6 max-w-lg text-mist">The page you were looking for has moved or doesn’t exist.</p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link href="/" className="inline-flex h-12 items-center bg-gold-500 px-7 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-navy-950">
            Home
          </Link>
          <Link href="/projects" className="inline-flex h-12 items-center border border-ivory/30 px-7 text-[0.7rem] font-semibold uppercase tracking-[0.22em]">
            All projects
          </Link>
        </div>
      </div>
    </section>
  );
}
