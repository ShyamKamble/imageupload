import {
  MinimalCard,
  MinimalCardDescription,
  MinimalCardImage,
  MinimalCardTitle,
} from "@/components/ui/minimal-card"

export function MinimalCardDemo() {
 const cards = [
  {
    title: "News Website",
    description:
      "A comprehensive news platform featuring modern design and dynamic content. Integrated third-party APIs for real-time news updates and article searching.",
    src: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=220&fit=crop&auto=format",
  },
  {
    title: "Salary Prediction App",
    description:
      "A machine learning-powered web application for salary prediction using various algorithms, featuring interactive data visualizations.",
    src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=220&fit=crop&auto=format",
  },
  {
    title: "E-Commerce Platform",
    description:
      "Full-stack e-commerce solution with a modern shopping cart, payment integration, and inventory management.",
    src: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=220&fit=crop&auto=format",
  },
  {
    title: "Design Tool Clone",
    description:
      "A collaborative real-time design application inspired by Figma, featuring a live cursor, comments, and reactions.",
    src: "https://images.unsplash.com/photo-1606857521015-7f9fcf423740?w=400&h=220&fit=crop&auto=format",
  },
  {
    title: "Animated Movie App",
    description:
      "A visually engaging application for discovering and tracking animated movies, built with server-side rendering and infinite scroll.",
    src: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=400&h=220&fit=crop&auto=format",
  },
];

  return (
    <div className="w-full max-w-5xl ">
      <div className="flex flex-col justify-center rounded-lg p-4">
        <div className="flex flex-wrap items-center justify-center ">
          {cards.map((card, index) => (
            <MinimalCard className="m-2 w-[460px] " key={index}>
              <MinimalCardImage
                className="h-[320px]"
                src={card.src}
                alt={card.title}
              />
              <MinimalCardTitle>{card.title}</MinimalCardTitle>
              <MinimalCardDescription>
                {card.description}
              </MinimalCardDescription>
            </MinimalCard>
          ))}
        </div>
      </div>
    </div>
  )
}
