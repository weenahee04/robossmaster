export default function LoadingCar({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="relative">
        <img
          src="/roboss-logo.png"
          alt="Roboss Loading"
          className="w-20 h-20 rounded-full animate-pulse"
        />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin" />
      </div>
      <p className="text-sm text-slate-400 mt-3 font-medium animate-pulse">กำลังโหลด...</p>
    </div>
  );
}
