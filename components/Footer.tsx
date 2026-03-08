const Footer = () => {
  return (
    <footer className="border-t border-white/10 bg-black">
      <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
        
        <p className="text-white/60">
          Made by <span className="text-white font-medium">Bichitra Behera</span>
        </p>

        <div className="flex items-center gap-5 text-white/50">
          <a
            href="https://x.com/bichitra_16"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            X
          </a>

          <a
            href="https://www.linkedin.com/in/bichitra-behera-99b189291"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            LinkedIn
          </a>

          <a
            href="https://github.com/bichitrabehera"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            GitHub
          </a>

          <a
            href="https://bichitrabehera.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            Portfolio
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;