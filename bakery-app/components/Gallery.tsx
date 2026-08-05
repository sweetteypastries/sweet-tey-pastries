const galleryImages = [
  {
    src: "/images/pound-cakes.jpg",
    alt: "Sweet Tey's Southern pound cakes",
    label: "Southern Pound Cakes",
  },
  {
    src: "/images/sweet-potato-pie.png",
    alt: "Sweet potato pie from Sweet Tey's Pastries",
    label: "Sweet Potato Pie",
  },
  {
    src: "/images/peach-cobbler.jpg",
    alt: "Homemade Southern peach cobbler",
    label: "Peach Cobbler",
  },
  {
    src: "/images/parfait-cups.jpg",
    alt: "Banana pudding and cheesecake dessert cups",
    label: "Parfait Cups",
  },
  {
    src: "/images/cupcakes.jpg",
    alt: "Cupcakes and mini cupcakes",
    label: "Cupcakes",
  },
  {
    src: "/images/chocolate-covered-strawberries.jpg",
    alt: "Chocolate-covered strawberries",
    label: "Chocolate-Covered Strawberries",
  },
];

export default function Gallery() {
  return (
    <section id="gallery" className="bg-[#fff8f2] px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.3em] text-[#ed6f91]">
            From Our Bakery
          </p>

          <h2 className="font-serif text-4xl font-bold text-[#4b3428] sm:text-5xl">
            Made to Look as Sweet as It Tastes
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[#6b5548]">
            A closer look at the Southern desserts and handcrafted treats
            created by Sweet Tey&apos;s Pastries.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {galleryImages.map((image) => (
            <figure
              key={image.label}
              className="group relative h-80 overflow-hidden rounded-3xl shadow-sm"
            >
              <img
                src={image.src}
                alt={image.alt}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#3f2b22]/80 via-transparent to-transparent" />

              <figcaption className="absolute bottom-0 left-0 right-0 p-6">
                <p className="font-serif text-2xl font-bold text-white">
                  {image.label}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-lg text-[#6b5548]">
            Follow Sweet Tey&apos;s Pastries for seasonal treats, new flavors,
            and behind-the-scenes bakery moments.
          </p>

          <a
            href="#"
            className="mt-6 inline-block rounded-full border-2 border-[#ed6f91] px-9 py-4 font-bold text-[#ed6f91] transition hover:bg-[#ed6f91] hover:text-white"
          >
            Follow Our Sweet Journey
          </a>
        </div>
      </div>
    </section>
  );
}