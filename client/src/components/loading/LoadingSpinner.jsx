const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="relative w-20 h-20">
          {[...Array(12)].map((_, index) => (
            <div
              key={index}
              className="absolute w-3 h-3 bg-[#6374AE] rounded-full transform"
              style={{
                left: '50%',
                top: '50%',
                transform: `rotate(${index * 30}deg) translate(0, -150%)`,
                opacity: 1 - (index * 0.08),
                animation: 'spin 1.2s linear infinite',
                animationDelay: `${-index * 0.1}s`
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;