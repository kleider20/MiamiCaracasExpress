import { useEffect, useState } from 'react';
import { useStorefront } from '@/contexts/StorefrontContext';
import { cn } from '@/lib/utils';

type Slide = {
    eyebrow: string;
    title: string;
    description: string;
    cta: string;
    category: string;
    gradient: string;
    art: 'headphones' | 'home' | 'fashion';
};

const SLIDES: Slide[] = [
    {
        eyebrow: 'Ofertas de temporada',
        title: 'Hasta 60% OFF en Electrónica',
        description:
            'Audífonos, smartwatches, laptops y más con envío Prime gratis.',
        cta: 'Ver ofertas',
        category: 'Electrónica',
        gradient: 'from-[#0f2027] via-[#203a43] to-[#2c5364]',
        art: 'headphones',
    },
    {
        eyebrow: 'Nuevas colecciones',
        title: 'Renueva tu hogar con estilo',
        description:
            'Cocina, decoración y limpieza inteligente para cada rincón.',
        cta: 'Explorar hogar',
        category: 'Hogar',
        gradient: 'from-[#134e4a] via-[#065f46] to-[#14532d]',
        art: 'home',
    },
    {
        eyebrow: 'Temporada 2026',
        title: 'Tendencias de Moda 2026',
        description:
            'Looks que marcan estilo: calzado, chamarras y accesorios.',
        cta: 'Ver moda',
        category: 'Moda',
        gradient: 'from-[#3b0764] via-[#6b21a8] to-[#9d174d]',
        art: 'fashion',
    },
];

export default function HeroCarousel() {
    const { selectCategory } = useStorefront();
    const [heroIdx, setHeroIdx] = useState(0);
    const [paused, setPaused] = useState(false);

    useEffect(() => {
        if (paused) {
            return;
        }

        const timer = window.setInterval(() => {
            setHeroIdx((current) => (current + 1) % SLIDES.length);
        }, 6000);

        return () => {
            window.clearInterval(timer);
        };
    }, [paused]);

    function goTo(index: number) {
        setHeroIdx((index + SLIDES.length) % SLIDES.length);
    }

    return (
        <section
            aria-label="Ofertas destacadas"
            className="px-0 md:px-4"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
        >
            <div className="relative mx-auto h-[360px] max-w-[1500px] overflow-hidden rounded-none shadow-sm md:h-[420px] md:rounded-lg">
                <div
                    className="flex h-full transition-transform duration-500 ease-out"
                    style={{ transform: `translateX(-${heroIdx * 100}%)` }}
                >
                    {SLIDES.map((slide, index) => (
                        <article
                            key={slide.title}
                            aria-hidden={index !== heroIdx}
                            className={cn(
                                'relative flex h-full w-full shrink-0 items-center overflow-hidden bg-gradient-to-r px-6 sm:px-10 md:px-16',
                                slide.gradient,
                            )}
                        >
                            <div className="relative z-10 max-w-lg text-white">
                                <span className="mb-2 inline-block rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold tracking-wide text-white uppercase backdrop-blur-sm">
                                    {slide.eyebrow}
                                </span>
                                <h2 className="text-3xl leading-none font-black tracking-tight sm:text-4xl md:text-5xl">
                                    {slide.title}
                                </h2>
                                <p className="mt-3 max-w-sm text-sm text-white/85 md:text-base">
                                    {slide.description}
                                </p>
                                <button
                                    type="button"
                                    onClick={() =>
                                        selectCategory(slide.category)
                                    }
                                    className="mt-5 rounded-md bg-amz-yellow px-6 py-2.5 text-sm font-bold text-gray-900 shadow-md transition hover:bg-[#f7ca00] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                                >
                                    {slide.cta}
                                </button>
                            </div>

                            <div className="pointer-events-none absolute -right-6 bottom-0 h-[70%] w-[55%] opacity-95 sm:right-4 md:right-16">
                                <SlideArt kind={slide.art} />
                            </div>
                        </article>
                    ))}
                </div>

                <button
                    type="button"
                    onClick={() => goTo(heroIdx - 1)}
                    aria-label="Anterior"
                    className="absolute top-1/2 left-2 z-20 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm transition hover:bg-black/50 md:left-4"
                >
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        className="size-6"
                        aria-hidden="true"
                    >
                        <path
                            d="m15 5-7 7 7 7"
                            stroke="currentColor"
                            strokeWidth="2.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </button>

                <button
                    type="button"
                    onClick={() => goTo(heroIdx + 1)}
                    aria-label="Siguiente"
                    className="absolute top-1/2 right-2 z-20 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm transition hover:bg-black/50 md:right-4"
                >
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        className="size-6"
                        aria-hidden="true"
                    >
                        <path
                            d="m9 5 7 7-7 7"
                            stroke="currentColor"
                            strokeWidth="2.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </button>

                <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2">
                    {SLIDES.map((slide, index) => (
                        <button
                            key={slide.title}
                            type="button"
                            onClick={() => goTo(index)}
                            aria-label={`Ir a la diapositiva ${index + 1}`}
                            aria-current={index === heroIdx}
                            className={cn(
                                'h-2 rounded-full transition-all duration-300',
                                index === heroIdx
                                    ? 'w-6 bg-amz-orange'
                                    : 'w-2 bg-white/60 hover:bg-white',
                            )}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

function SlideArt({ kind }: { kind: Slide['art'] }) {
    if (kind === 'headphones') {
        return (
            <svg
                viewBox="0 0 320 320"
                fill="none"
                className="ml-auto h-full w-full drop-shadow-2xl"
                aria-hidden="true"
            >
                <circle
                    cx="170"
                    cy="165"
                    r="128"
                    fill="white"
                    fillOpacity="0.08"
                />
                <circle
                    cx="170"
                    cy="165"
                    r="96"
                    stroke="white"
                    strokeOpacity="0.15"
                    strokeWidth="2"
                    strokeDasharray="8 10"
                />
                <path
                    d="M95 170v-25c0-42 34-76 76-76s76 34 76 76v25"
                    stroke="white"
                    strokeWidth="14"
                    strokeLinecap="round"
                />
                <rect
                    x="74"
                    y="155"
                    width="45"
                    height="86"
                    rx="22"
                    fill="white"
                />
                <rect
                    x="82"
                    y="168"
                    width="28"
                    height="60"
                    rx="14"
                    fill="#203a43"
                    fillOpacity="0.55"
                />
                <rect
                    x="222"
                    y="155"
                    width="45"
                    height="86"
                    rx="22"
                    fill="white"
                />
                <rect
                    x="231"
                    y="168"
                    width="28"
                    height="60"
                    rx="14"
                    fill="#203a43"
                    fillOpacity="0.55"
                />
                <path
                    d="M254 240c0 16-12 28-28 28h-28"
                    stroke="white"
                    strokeWidth="6"
                    strokeLinecap="round"
                />
                <circle cx="193" cy="268" r="8" fill="#ff9900" />
                <circle cx="248" cy="72" r="10" fill="#ff9900" />
                <circle cx="82" cy="102" r="6" fill="white" fillOpacity="0.7" />
            </svg>
        );
    }

    if (kind === 'home') {
        return (
            <svg
                viewBox="0 0 320 320"
                fill="none"
                className="ml-auto h-full w-full drop-shadow-2xl"
                aria-hidden="true"
            >
                <circle
                    cx="165"
                    cy="155"
                    r="128"
                    fill="white"
                    fillOpacity="0.07"
                />
                <path
                    d="M52 172 160 78l108 94"
                    stroke="white"
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <rect
                    x="72"
                    y="165"
                    width="176"
                    height="112"
                    rx="10"
                    fill="white"
                    fillOpacity="0.16"
                    stroke="white"
                    strokeOpacity="0.5"
                    strokeWidth="3"
                />
                <rect
                    x="129"
                    y="205"
                    width="62"
                    height="72"
                    rx="6"
                    fill="#14532d"
                    fillOpacity="0.7"
                />
                <circle cx="180" cy="242" r="4" fill="#ffd814" />
                <rect
                    x="88"
                    y="188"
                    width="30"
                    height="30"
                    rx="4"
                    fill="#ffd814"
                    fillOpacity="0.9"
                />
                <rect
                    x="202"
                    y="188"
                    width="30"
                    height="30"
                    rx="4"
                    fill="#ffd814"
                    fillOpacity="0.9"
                />
                <path
                    d="M52 165h216"
                    stroke="white"
                    strokeWidth="4"
                    strokeOpacity="0.4"
                />
                <circle cx="61" cy="270" r="16" fill="#86efac" fillOpacity="0.8" />
                <circle cx="268" cy="92" r="10" fill="#ff9900" />
                <circle cx="78" cy="82" r="6" fill="white" fillOpacity="0.7" />
            </svg>
        );
    }

    return (
        <svg
            viewBox="0 0 320 320"
            fill="none"
            className="ml-auto h-full w-full drop-shadow-2xl"
            aria-hidden="true"
        >
            <circle
                cx="165"
                cy="155"
                r="128"
                fill="white"
                fillOpacity="0.07"
            />
            <path
                d="M160 60c-4 0-7 2-7 6v12c0 6 3 9 8 9h6"
                stroke="white"
                strokeWidth="6"
                strokeLinecap="round"
            />
            <path
                d="M100 112c12-10 28-16 45-16h35c17 0 33 6 45 16l24 22-30 30-18-16v100H124V148l-18 16-30-30 24-22Z"
                fill="white"
                fillOpacity="0.9"
            />
            <path
                d="M139 96c6 14 14 21 24 21s18-7 24-21"
                stroke="#9d174d"
                strokeOpacity="0.55"
                strokeWidth="6"
                strokeLinecap="round"
            />
            <circle cx="260" cy="220" r="12" fill="#ffd814" />
            <circle cx="62" cy="238" r="8" fill="white" fillOpacity="0.7" />
            <path
                d="M232 260c16-22 36-32 46-32"
                stroke="white"
                strokeOpacity="0.45"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray="6 8"
            />
        </svg>
    );
}
