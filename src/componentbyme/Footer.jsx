const Footer2 = () => {
  return (
    <section className="py-8">
      <div className="container">
        <footer>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-t pt-8">
            {/* Copyright text */}
            <p className="text-sm text-muted-foreground">
              © 2026 Snapstack · Built with Next.js & Python
            </p>
            
            {/* Naruto image */}
            <img 
              src="/naruto.jpg" 
              alt="Naruto" 
              className="h-12 w-12 rounded-full object-cover"
            />
          </div>
        </footer>
      </div>
    </section>
  );
};

export { Footer2 };
