export default function Logo() {
  return (
    <div className="relative group cursor-pointer">
      <div className="text-2xl font-black uppercase italic tracking-tighter text-white group-hover:text-brand-neon transition-colors duration-300">
        Cactus<span className="text-brand-neon group-hover:text-white">Bear</span>
      </div>
      <div className="h-0.5 w-full bg-brand-neon scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
    </div>
  );
}