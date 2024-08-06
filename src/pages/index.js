import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col justify-start min-h-screen bg-background p-6">
      <div className="w-7/12 mx-auto max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl">
        <Image
          src="/Spot My Pet logo.svg"
          alt="Spot My Pet Logo"
          width={504} // Controla el tamaño inicial aquí, ajustable según sea necesario
          height={369}
          layout="responsive"
          className="max-w-[300px] max-h-[300px] mx-auto"
        />
      </div>
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-overpass text-pink-medium text-center my-1.5">
        ¡Encuentra y adopta a tu futuro mejor amigo!
      </h1>
      <div className="max-w m0 bg-pink-dark">
        <h2>Animal</h2>
      </div>
      <main className="w-full max-w-sm mx-auto my-4">
        {/* Botones o enlaces del menú aquí */}
      </main>
    </div>
  );
}
