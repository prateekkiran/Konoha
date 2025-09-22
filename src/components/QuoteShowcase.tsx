import { memo } from 'react';
import { clsx } from 'clsx';

export interface AnimeQuote {
  text: string;
  jp: string;
  source: string;
  image: string;
  logo: string;
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
      <div className="quote-panel" style={{ backgroundImage: quote.background, borderColor: quote.accent }}>
        <div className="quote-art" aria-hidden="true">
          <img src={quote.image} alt="" loading="lazy" />
        </div>
        <div className="quote-copy">
          <div className="quote-logo">
            <img src={quote.logo} alt={`${quote.source} logo`} loading="lazy" />
          </div>
          <blockquote>
            <p className="jp">{quote.jp}</p>
            <p className="en">{quote.text}</p>
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
