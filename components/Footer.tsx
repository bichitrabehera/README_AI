const Footer = () => {
  return (
    <footer className="border-t border-black/10 bg-[#f8fafc] ">
      <div className="max-w-6xl mx-auto px-6 py-6  flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
        <p className="text-black/60">
          Made by <span className="text-black">Bichitra Behera</span>
        </p>

        <div className="flex items-center gap-5 text-black/50">
          <a
            href="https://x.com/bichitra_16"
            target="_blank"
            className="hover:text-white transition"
          >
            X
          </a>

          <a
            href="https://www.linkedin.com/in/bichitra-behera-99b189291"
            target="_blank"
            className="hover:text-white transition"
          >
            LinkedIn
          </a>

          <a
            href="https://github.com/bichitrabehera"
            target="_blank"
            className="hover:text-white transition"
          >
            GitHub
          </a>
          <a
            href="https://bichitrabehera.vercel.app"
            target="_blank"
            className="hover:text-white transition"
          >
            Portfolio
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
