import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-dvh bg-bg flex flex-col items-center justify-center gap-4 px-6 text-center">
      <div className="text-5xl mb-2">🔍</div>
      <h1 className="font-syne font-extrabold text-anthracite text-[24px]">
        Seite nicht gefunden
      </h1>
      <p className="text-anthracite/50 font-semibold text-[15px] leading-relaxed max-w-xs">
        Die Seite existiert nicht mehr — vielleicht wurde das Angebot gelöscht oder der Link ist veraltet.
      </p>
      <Link
        href="/dashboard"
        className="mt-4 bg-yellow text-anthracite rounded-2xl px-8 py-4 font-extrabold text-[16px] active:scale-95 transition-all"
      >
        Zum Dashboard
      </Link>
    </div>
  )
}
