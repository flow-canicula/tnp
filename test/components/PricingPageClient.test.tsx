import { describe, it, expect } from 'vitest';
import { screen, fireEvent, within } from '@testing-library/react';
import PricingPageClient from '@/components/PricingPageClient';
import { renderWithIntl } from '../renderWithIntl';

const tierMessages = {
  name: '', tagline: '', description: '', examples: '', priceNote: '', cta: 'Request Quote',
};

const messages = {
  hero: { title: 'Transparent pricing.', titleAccent: 'Flooring and furniture, end to end.', subtitle: 'Subtitle text.' },
  statement: { eyebrow: 'Eyebrow', line1: 'Line one.', line2: 'Line two.', sub: 'Sub line.' },
  finalCta: { title: 'Ready to start?', subtitle: 'Tell us about your space.', imageAlt: 'Finished installation' },
  tiers: {
    title: 'Our Services',
    flooring: { ...tierMessages, name: 'Solid Wood Flooring', badge: 'Most popular' },
    furniture: { ...tierMessages, name: 'Custom Timber Furniture' },
    complete: { ...tierMessages, name: 'Complete Projects', badge: 'Best value' },
  },
  included: { title: 'Always included', items: ['Material sourcing', 'Kiln-drying & milling', 'Manufacturing', 'Delivery'] },
  faq: {
    title: 'FAQ', subtitle: 'Answers to common questions.',
    q1: { question: 'What is Hinoki?', answer: 'Japanese cypress.' },
    q2: { question: 'How long does a project take?', answer: '3-12 weeks.' },
    q3: { question: 'Q3', answer: 'A3' },
    q4: { question: 'Q4', answer: 'A4' },
    q5: { question: 'Q5', answer: 'A5' },
    q6: { question: 'Q6', answer: 'A6' },
    q7: { question: 'Q7', answer: 'A7' },
  },
};

const cta = { requestQuote: 'Request a Free Quote' };

describe('PricingPageClient', () => {
  it('renders the hero and three pricing tiers', () => {
    renderWithIntl(<PricingPageClient locale="en" messages={messages} cta={cta} />);
    expect(screen.getByText('Transparent pricing.')).toBeInTheDocument();
    expect(screen.getByText('Solid Wood Flooring')).toBeInTheDocument();
    expect(screen.getByText('Custom Timber Furniture')).toBeInTheDocument();
    expect(screen.getByText('Complete Projects')).toBeInTheDocument();
  });

  it('highlights the first tier by default and shows its badge', () => {
    renderWithIntl(<PricingPageClient locale="en" messages={messages} cta={cta} />);
    expect(screen.getByText('Most popular')).toBeInTheDocument();
  });

  it('selects a tier on click, marking it selected and updating the final CTA link', () => {
    renderWithIntl(<PricingPageClient locale="en" messages={messages} cta={cta} />);
    const furnitureCard = screen.getByText('Custom Timber Furniture').closest('article')!;
    fireEvent.click(furnitureCard);

    expect(within(furnitureCard).getByText('Selected')).toBeInTheDocument();
    expect(screen.getByText('Request a Free Quote').closest('a')).toHaveAttribute(
      'href',
      '/en/contact?type=furniture'
    );
  });

  it('deselects a tier when clicked again, reverting to the default highlight', () => {
    renderWithIntl(<PricingPageClient locale="en" messages={messages} cta={cta} />);
    const furnitureCard = screen.getByText('Custom Timber Furniture').closest('article')!;
    fireEvent.click(furnitureCard);
    fireEvent.click(furnitureCard);

    expect(within(furnitureCard).queryByText('Selected')).not.toBeInTheDocument();
    expect(screen.getByText('Most popular')).toBeInTheDocument();
  });

  it('selects a tier via keyboard activation', () => {
    renderWithIntl(<PricingPageClient locale="en" messages={messages} cta={cta} />);
    const flooringCard = screen.getByText('Solid Wood Flooring').closest('article')!;
    const completeCard = screen.getByText('Complete Projects').closest('article')!;
    fireEvent.keyDown(completeCard, { key: 'Enter' });
    expect(within(completeCard).getByText('Selected')).toBeInTheDocument();
    expect(within(flooringCard).queryByText('Selected')).not.toBeInTheDocument();
  });

  it('lists all "always included" items', () => {
    renderWithIntl(<PricingPageClient locale="en" messages={messages} cta={cta} />);
    for (const item of messages.included.items) {
      expect(screen.getByText(item)).toBeInTheDocument();
    }
  });

  it('expands and collapses FAQ entries one at a time', () => {
    renderWithIntl(<PricingPageClient locale="en" messages={messages} cta={cta} />);
    expect(screen.queryByText('Japanese cypress.')).not.toBeInTheDocument();

    fireEvent.click(screen.getByText('What is Hinoki?'));
    expect(screen.getByText('Japanese cypress.')).toBeInTheDocument();

    fireEvent.click(screen.getByText('What is Hinoki?'));
    expect(screen.queryByText('Japanese cypress.')).not.toBeInTheDocument();
  });

  it('links the bottom CTA to the contact page without a type when no tier selected after deselect', () => {
    renderWithIntl(<PricingPageClient locale="ja" messages={messages} cta={cta} />);
    expect(screen.getByText('Request a Free Quote').closest('a')).toHaveAttribute('href', '/ja/contact');
  });
});
