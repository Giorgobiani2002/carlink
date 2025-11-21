export default function HomeS1() {
    return (
      <div className="relative w-full h-screen">
        {/* Background Video */}
        <video
          src="/video.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        />
  
        {/* Text Overlay */}
        <div className="absolute inset-0 flex flex-col items-center gap-2 justify-center">
          <h1 className="text-white text-6xl font-bold drop-shadow-lg text-[80px] font-serif">
            CARLINK
          </h1>
          <span className="text-green-900 font-serif text-[20px] font-extrabold">AUTO IMPORT</span>
          <p className="text-white">ავტომობილების იმპორტი ამერიკიდან და ჩინეთიდან</p>
          <button className="w-60 h-[60px] rounded-4xl bg-green-900 text-white">
            მოგვწერეთ ახლავე
          </button>
        </div>
      </div>
    );
  }
  