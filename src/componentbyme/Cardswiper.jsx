import { CardSwipe } from "../components/ui/card-swipe.jsx";
function BasicExample() {
  const images = [
    { src: "/card/1.png", alt: "Image 1" },
    { src: "/card/2.png", alt: "Image 2" },
    { src: "/card/3.png", alt: "Image 3" },
  ]

  return (
   <div className="w-full">
      <CardSwipe images={images} autoplayDelay={2000} slideShadows={false} />
    </div>
  )
}
