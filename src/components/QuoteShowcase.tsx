import { memo } from 'react';
import { clsx } from 'clsx';

export interface AnimeQuote {
  text: string;
  source: string;
  image: string;
  accent: string;
  background: string;
}

interface QuoteShowcaseProps {
  quote: AnimeQuote | null;
}

const QuoteShowcase = memo(function QuoteShowcase({ quote }: QuoteShowcaseProps) {
  if (!quote) return null;

  return (
    <section className="quote-showcase" aria-live="polite">
      <div
        className="quote-panel"
        style={{
          backgroundImage: quote.background,
          borderColor: quote.accent,
        }}
      >
        <div className="quote-art" aria-hidden="true">
          <img src={quote.image} alt="" loading="lazy" />
        </div>
        <div className="quote-copy">
          <blockquote>
            <p>{quote.text}</p>
            <footer>
              <span>— {quote.source}</span>
            </footer>
          </blockquote>
        </div>
      </div>
    </section>
  );
});

export default QuoteShowcase;
