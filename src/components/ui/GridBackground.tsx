export function GridBackground() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <div
        className="absolute left-[50%] top-[50%] -translate-x-[50%] -translate-y-[50%]"
        aria-hidden="true"
      >
        <div className="absolute h-[50rem] w-[90rem] origin-top-left -translate-x-[50%] -translate-y-[50%] [mask-image:radial-gradient(closest-side,white,transparent)] sm:left-[calc(50%+3rem)] sm:h-[70rem]">
          <div className="absolute inset-0 bg-gradient-to-r from-[#c7d2fe10] to-[#818cf810] opacity-50"></div>
          <svg
            viewBox="0 0 1024 1024"
            className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-x-1/2"
            aria-hidden="true"
          >
            <circle
              cx={512}
              cy={512}
              r={512}
              fill="url(#gradient)"
              fillOpacity="0.7"
            />
            <defs>
              <radialGradient id="gradient">
                <stop stopColor="#818cf8" />
                <stop offset={1} stopColor="#c7d2fe" />
              </radialGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        </div>
      </div>
    </div>
  );
}