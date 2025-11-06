import React from "react";

type Testimonial = {
  text: string;
  name: string;
  role: string;
  image: string;
  company?: string;
};

const testimonials: Testimonial[] = [
  {
    text: "We are impressed by the AI and think it's the best choice on the market.",
    name: "Emil Barsø Rheinlænder",
    role: "Content & Marketing Coordinator",
    image: "/cat1.jpg",
    company: "Sony Music",
  },
  {
    text: "Cleanpixel is leaps and bounds ahead of the competition. A thousand times better. It simplified the whole process.",
    name: "Marc Cohen",
    role: "CEO",
    image: "/cat2.jpeg",
    company: "Phoenix Trading",
  },
  {
    text: "We were impressed by its ability to account for pesky, feathery hair without making an image look jagged and amateurish.",
    name: "Taylor Hatmaker",
    role: "Senior Technology Editor",
    image: "/cat1.jpg",
    company: "TechCrunch",
  },
];

const Testimonials: React.FC = () => {
  return (
    <section className="relative" style={{ backgroundColor: 'var(--secondary)' }}>
      {/* Wavy top border */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0]">
        <svg 
          className="relative block w-full h-[100px] md:h-[120px]" 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M0,0 L0,40 Q300,80 600,40 T1200,40 L1200,0 Z" 
            style={{ fill: 'var(--background)' }}
          />
        </svg>
      </div>

      <div className="pt-32 pb-20 px-6 md:px-10 lg:px-20 text-center">
        <div className="max-w-3xl mx-auto mb-16">
          <p className="text-sm font-medium tracking-wider uppercase mb-3" style={{ color: 'var(--primary)' }}>
            Testimonials
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-sans mb-4" style={{ color: 'var(--text)' }}>
            They love us. You will too.
          </h2>
          <p className="text-base md:text-lg opacity-80 max-w-2xl mx-auto" style={{ color: 'var(--text)' }}>
            Join thousands of satisfied customers who've transformed their workflow with our AI-powered solutions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.map((t, index) => (
            <div
              key={index}
              className="rounded-2xl shadow-lg p-8 text-left flex flex-col justify-between relative overflow-hidden group hover:shadow-xl transition-all duration-300"
              style={{ 
                backgroundColor: 'var(--background)',
                border: '1px solid var(--border)'
              }}
            >
              <div 
                className="absolute -top-2 -left-2 text-8xl font-serif opacity-10 leading-none select-none"
                style={{ color: 'var(--primary)' }}
              >
                "
              </div>

              {t.company && (
                <div className="mb-4">
                  <span 
                    className="inline-block px-3 py-1 text-xs font-semibold rounded-full"
                    style={{ 
                      backgroundColor: 'var(--primary)',
                      color: 'white'
                    }}
                  >
                    {t.company}
                  </span>
                </div>
              )}

              <div className="relative z-10">
                <p 
                  className="text-[16px] leading-relaxed mb-8 font-medium italic"
                  style={{ color: 'var(--text)' }}
                >
                  "{t.text}"
                </p>
              </div>

              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    style={{ color: 'var(--primary)' }}
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              <div className="flex items-center gap-3 mt-auto pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
                <div className="relative">
                  <img
                    src={t.image}
                    alt={t.name}
                    className="w-14 h-14 rounded-full object-cover"
                    style={{ boxShadow: '0 0 0 2px var(--primary)' }}
                  />
                  <div 
                    className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: 'var(--primary)' }}
                  >
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-sm" style={{ color: 'var(--text)' }}>
                    {t.name}
                  </p>
                  <p className="text-xs opacity-70" style={{ color: 'var(--text)' }}>
                    {t.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <a
          href="/testimonials"
          className="mt-16 inline-flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300 hover:gap-3 group"
          style={{ 
            color: 'var(--text)',
            border: '2px solid var(--border)'
          }}
        >
          <span>Read Success Stories</span>
          <svg 
            className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </a>
      </div>
    </section>
  );
};

export default Testimonials;