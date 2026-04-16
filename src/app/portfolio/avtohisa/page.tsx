import Link from 'next/link';

const CARS = [
  {
    id: 'megane-rs',
    title: 'Renault Megane RS 2018 Trophy',
    image: 'megane.jpg',
    description:
      'Brutalen sportni hatch z 1.8L turbo motorjem in 300 KM, narejen za ostre ovinke in track-day vikende.',
  },
  {
    id: 'audi-rsq8',
    title: 'Audi RS Q8 2022',
    image: 'rsq8.jpg',
    description:
      'Premium SUV z V8 biturbo karakterjem. Kombinacija luksuza, udobja in brutalne zmogljivosti.',
  },
  {
    id: 'mustang-gt',
    title: 'Mustang GT V8 2020',
    image: 'mustang.jpg',
    description:
      'Cisti ameriski muscle car s 5.0L V8 motorjem, izrazitim zvokom in surovo energijo.',
  },
] as const;

export default function AvtohisaPortfolioPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <div className="mb-10 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-zinc-400">Portfolio</p>
            <h1 className="mt-3 text-3xl font-semibold md:text-5xl">Apex Motors - Avtohisa</h1>
            <p className="mt-4 max-w-2xl text-zinc-300">
              Prikaz podstrani avtohise z galerijo vozil. Stran je zdaj direktno dosegljiva iz
              portfolija.
            </p>
          </div>
          <Link
            href="/"
            className="rounded-full border border-white/25 px-4 py-2 text-xs uppercase tracking-[0.2em] text-zinc-200 transition hover:bg-white/10"
          >
            Nazaj
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {CARS.map((car) => (
            <article
              key={car.id}
              className="overflow-hidden rounded-2xl border border-white/15 bg-zinc-950"
            >
              <img
                src={`/portfolio/avtohisa/images/${car.image}`}
                alt={car.title}
                className="h-56 w-full object-cover"
              />
              <div className="p-5">
                <h2 className="text-xl font-semibold">{car.title}</h2>
                <p className="mt-3 text-sm text-zinc-300">{car.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
