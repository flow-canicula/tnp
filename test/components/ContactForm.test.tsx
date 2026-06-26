import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ContactForm from '@/components/ContactForm';
import { renderWithIntl } from '../renderWithIntl';

const messages = {
  title: 'Start Your Project',
  name: { label: 'Name', placeholder: 'Your name' },
  email: { label: 'Email', placeholder: 'you@example.com' },
  phone: { label: 'Phone', placeholder: '+84...', hint: 'Zalo/WhatsApp ok' },
  projectType: {
    label: 'Project type', placeholder: 'Select project type',
    options: { flooring: 'Flooring', furniture: 'Furniture', both: 'Both', commercial: 'Commercial', other: 'Other' },
  },
  timberPreference: {
    label: 'Timber', hint: 'Pick any',
    options: { keyaki: 'Keyaki', hinoki: 'Hinoki', oak: 'Oak', walnut: 'Walnut', ash: 'Ash', teak: 'Teak', other: 'Other' },
  },
  location: {
    label: 'Location', placeholder: 'Select location',
    options: { vietnam: 'Vietnam', japan: 'Japan', international: 'International' },
  },
  quantity: { label: 'Quantity', placeholder: 'e.g. 50m2' },
  budget: { label: 'Budget', placeholder: 'Select budget range' },
  language: {
    label: 'Preferred language',
    options: { en: 'English', vi: 'Vietnamese', ja: 'Japanese' },
  },
  description: { label: 'Description', placeholder: 'Tell us more', hint: 'Optional' },
  fileNote: 'Have files? Mention it.',
  submit: 'Send My Project Details',
  privacy: 'We respond within 48 hours.',
  successTitle: 'Thank you!',
  successText: 'We will be in touch soon.',
};

describe('ContactForm', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true }));
    process.env.NEXT_PUBLIC_FORMSPREE_ID = 'mpqeyjea';
  });

  it('renders name and email text inputs', () => {
    renderWithIntl(<ContactForm locale="en" messages={messages} />);
    expect(screen.getByLabelText(/Name/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/)).toBeInTheDocument();
  });

  it('renders the submit button', () => {
    renderWithIntl(<ContactForm locale="en" messages={messages} />);
    expect(screen.getByRole('button', { name: messages.submit })).toBeInTheDocument();
  });

  it('renders all timber preference pill options', () => {
    renderWithIntl(<ContactForm locale="en" messages={messages} />);
    // sr-only checkboxes exist for each timber option
    expect(screen.getByRole('checkbox', { name: /Hinoki/ })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: /Keyaki/ })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: /Oak/ })).toBeInTheDocument();
  });

  it('toggles timber checkboxes on and off', () => {
    renderWithIntl(<ContactForm locale="en" messages={messages} />);
    const hinoki = screen.getByRole('checkbox', { name: /Hinoki/ });
    expect(hinoki).not.toBeChecked();
    fireEvent.click(hinoki);
    expect(hinoki).toBeChecked();
    fireEvent.click(hinoki);
    expect(hinoki).not.toBeChecked();
  });

  it('can select multiple timber options independently', () => {
    renderWithIntl(<ContactForm locale="en" messages={messages} />);
    const oak = screen.getByRole('checkbox', { name: /Oak/ });
    const walnut = screen.getByRole('checkbox', { name: /Walnut/ });
    fireEvent.click(oak);
    fireEvent.click(walnut);
    expect(oak).toBeChecked();
    expect(walnut).toBeChecked();
  });

  it('defaults the preferred-language radio to the current locale', () => {
    renderWithIntl(<ContactForm locale="ja" messages={messages} />);
    expect(screen.getByRole('radio', { name: 'Japanese' })).toBeChecked();
  });

  it('defaults the preferred-language radio to "en" when locale is "en"', () => {
    renderWithIntl(<ContactForm locale="en" messages={messages} />);
    expect(screen.getByRole('radio', { name: 'English' })).toBeChecked();
  });

  it('opens the project-type elegant select and shows options', async () => {
    renderWithIntl(<ContactForm locale="en" messages={messages} />);
    const trigger = screen.getByRole('button', { name: /Select project type/i });
    await userEvent.click(trigger);
    expect(screen.getByRole('option', { name: 'Flooring' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Furniture' })).toBeInTheDocument();
  });

  it('selects a project type from the custom dropdown', async () => {
    renderWithIntl(<ContactForm locale="en" messages={messages} />);
    await userEvent.click(screen.getByRole('button', { name: /Select project type/i }));
    await userEvent.click(screen.getByRole('option', { name: 'Flooring' }));
    // After selection, aria-label on the trigger updates to the selected value
    expect(screen.getByRole('button', { name: 'Flooring' })).toBeInTheDocument();
  });

  it('opens the location elegant select and shows options', async () => {
    renderWithIntl(<ContactForm locale="en" messages={messages} />);
    await userEvent.click(screen.getByRole('button', { name: /Select location/i }));
    expect(screen.getByRole('option', { name: 'Vietnam' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Japan' })).toBeInTheDocument();
  });

  it('opens the budget elegant select and shows options', async () => {
    renderWithIntl(<ContactForm locale="en" messages={messages} />);
    await userEvent.click(screen.getByRole('button', { name: /Select budget range/i }));
    expect(screen.getByRole('option', { name: /Under \$5,000/ })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /\$100,000\+/ })).toBeInTheDocument();
  });

  it('submits the form to Formspree and shows the success state', async () => {
    renderWithIntl(<ContactForm locale="en" messages={messages} />);
    fireEvent.change(screen.getByLabelText(/Name/), { target: { value: 'Tanaka' } });
    fireEvent.change(screen.getByLabelText(/Email/), { target: { value: 'tanaka@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: messages.submit }));
    await waitFor(() => {
      expect(screen.getByText('Thank you!')).toBeInTheDocument();
    });
    expect(fetch).toHaveBeenCalledWith(
      'https://formspree.io/f/mpqeyjea',
      expect.objectContaining({ method: 'POST' })
    );
  });

  it('shows the success message text after submission', async () => {
    renderWithIntl(<ContactForm locale="en" messages={messages} />);
    fireEvent.click(screen.getByRole('button', { name: messages.submit }));
    await waitFor(() => {
      expect(screen.getByText(messages.successText)).toBeInTheDocument();
    });
  });

  it('alerts the user when the submission network fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network error')));
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    renderWithIntl(<ContactForm locale="en" messages={messages} />);
    fireEvent.click(screen.getByRole('button', { name: messages.submit }));
    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith(expect.stringContaining('thuy@tnpgr.vn'));
    });
    expect(screen.queryByText('Thank you!')).not.toBeInTheDocument();
  });

  it('shows the file note hint text', () => {
    renderWithIntl(<ContactForm locale="en" messages={messages} />);
    expect(screen.getByText(messages.fileNote)).toBeInTheDocument();
  });

  it('shows the privacy disclaimer below the submit button', () => {
    renderWithIntl(<ContactForm locale="en" messages={messages} />);
    expect(screen.getByText(messages.privacy)).toBeInTheDocument();
  });
});
