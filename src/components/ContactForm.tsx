'use client';

import { useState, useRef } from 'react';
import { Send, CheckCircle } from 'lucide-react';

const timberOptions = ['keyaki', 'hinoki', 'oak', 'walnut', 'ash', 'teak', 'other'] as const;
const projectTypeOptions = ['flooring', 'furniture', 'both', 'commercial', 'other'] as const;
const locationOptions = ['vietnam', 'japan', 'international'] as const;
const languageOptions = ['en', 'vi', 'ja'] as const;

interface FormMessages {
  title: string;
  name: { label: string; placeholder: string };
  email: { label: string; placeholder: string };
  phone: { label: string; placeholder: string; hint: string };
  projectType: { label: string; placeholder: string; options: Record<string, string> };
  timberPreference: { label: string; hint: string; options: Record<string, string> };
  location: { label: string; placeholder: string; options: Record<string, string> };
  quantity: { label: string; placeholder: string };
  budget: { label: string; placeholder: string };
  language: { label: string; options: Record<string, string> };
  description: { label: string; placeholder: string; hint: string };
  fileNote: string;
  submit: string;
  privacy: string;
  successTitle: string;
  successText: string;
}

interface ContactFormProps {
  locale: string;
  messages: FormMessages;
}

export default function ContactForm({ locale, messages: m }: ContactFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [timberSelected, setTimberSelected] = useState<string[]>([]);

  function toggleTimber(val: string) {
    setTimberSelected((prev) =>
      prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);

    const form = formRef.current;
    if (!form) return;

    const data = new FormData(form);
    data.append('timber_preference', timberSelected.join(', '));
    data.append('locale', locale);

    try {
      const res = await fetch('https://formspree.io/f/mpqeyjea', {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      });
      if (res.ok) setSubmitted(true);
    } catch {
      alert('Something went wrong. Please email us directly at thuy@tnpgr.vn');
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-20">
        <CheckCircle className="w-16 h-16 text-timber-500 mb-4" aria-hidden="true" />
        <h2 className="font-serif text-3xl text-forest-900 mb-3">{m.successTitle}</h2>
        <p className="text-stone-500 max-w-sm">{m.successText}</p>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      noValidate
      aria-label={m.title}
      className="flex flex-col gap-6"
    >
      {/* Name + Email */}
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-forest-800 mb-1.5">
            {m.name.label} <span className="text-timber-500" aria-hidden="true">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder={m.name.placeholder}
            className="w-full px-4 py-3 rounded-xl border border-cream-200 bg-cream-50 text-forest-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-timber-500 focus:border-transparent text-sm transition-shadow"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-forest-800 mb-1.5">
            {m.email.label} <span className="text-timber-500" aria-hidden="true">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder={m.email.placeholder}
            className="w-full px-4 py-3 rounded-xl border border-cream-200 bg-cream-50 text-forest-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-timber-500 focus:border-transparent text-sm transition-shadow"
          />
        </div>
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-forest-800 mb-1.5">
          {m.phone.label}
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          placeholder={m.phone.placeholder}
          className="w-full px-4 py-3 rounded-xl border border-cream-200 bg-cream-50 text-forest-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-timber-500 focus:border-transparent text-sm"
        />
        <p className="text-xs text-stone-400 mt-1">{m.phone.hint}</p>
      </div>

      {/* Project type */}
      <div>
        <label htmlFor="projectType" className="block text-sm font-medium text-forest-800 mb-1.5">
          {m.projectType.label}
        </label>
        <select
          id="projectType"
          name="project_type"
          className="w-full px-4 py-3 rounded-xl border border-cream-200 bg-cream-50 text-forest-900 focus:outline-none focus:ring-2 focus:ring-timber-500 focus:border-transparent text-sm appearance-none cursor-pointer"
          defaultValue=""
        >
          <option value="" disabled>{m.projectType.placeholder}</option>
          {projectTypeOptions.map((opt) => (
            <option key={opt} value={opt}>{m.projectType.options[opt]}</option>
          ))}
        </select>
      </div>

      {/* Timber preference */}
      <fieldset>
        <legend className="text-sm font-medium text-forest-800 mb-1.5">{m.timberPreference.label}</legend>
        <p className="text-xs text-stone-400 mb-3">{m.timberPreference.hint}</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {timberOptions.map((opt) => (
            <label
              key={opt}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg border cursor-pointer text-sm transition-colors duration-150 ${
                timberSelected.includes(opt)
                  ? 'border-timber-500 bg-timber-50 text-timber-700'
                  : 'border-cream-200 bg-cream-50 text-forest-800 hover:border-timber-300'
              }`}
            >
              <input
                type="checkbox"
                name="timber_preference_raw"
                value={opt}
                checked={timberSelected.includes(opt)}
                onChange={() => toggleTimber(opt)}
                className="sr-only"
              />
              <span className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center ${timberSelected.includes(opt) ? 'border-timber-500 bg-timber-500' : 'border-stone-300'}`}>
                {timberSelected.includes(opt) && (
                  <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 12 12">
                    <path d="M10 3L5 8.5 2 5.5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </span>
              {m.timberPreference.options[opt]}
            </label>
          ))}
        </div>
      </fieldset>

      {/* Location */}
      <div>
        <label htmlFor="location" className="block text-sm font-medium text-forest-800 mb-1.5">
          {m.location.label}
        </label>
        <select
          id="location"
          name="location"
          className="w-full px-4 py-3 rounded-xl border border-cream-200 bg-cream-50 text-forest-900 focus:outline-none focus:ring-2 focus:ring-timber-500 focus:border-transparent text-sm appearance-none cursor-pointer"
          defaultValue=""
        >
          <option value="" disabled>{m.location.placeholder}</option>
          {locationOptions.map((opt) => (
            <option key={opt} value={opt}>{m.location.options[opt]}</option>
          ))}
        </select>
      </div>

      {/* Quantity */}
      <div>
        <label htmlFor="quantity" className="block text-sm font-medium text-forest-800 mb-1.5">
          {m.quantity.label}
        </label>
        <input
          id="quantity"
          name="quantity"
          type="text"
          placeholder={m.quantity.placeholder}
          className="w-full px-4 py-3 rounded-xl border border-cream-200 bg-cream-50 text-forest-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-timber-500 focus:border-transparent text-sm"
        />
      </div>

      {/* Budget */}
      <div>
        <label htmlFor="budget" className="block text-sm font-medium text-forest-800 mb-1.5">
          {m.budget.label}
        </label>
        <select
          id="budget"
          name="budget"
          className="w-full px-4 py-3 rounded-xl border border-cream-200 bg-cream-50 text-forest-900 focus:outline-none focus:ring-2 focus:ring-timber-500 focus:border-transparent text-sm appearance-none cursor-pointer"
          defaultValue=""
        >
          <option value="" disabled>{m.budget.placeholder}</option>
          {/* TODO: set budget ranges in USD or VND */}
          <option value="small">Under $5,000</option>
          <option value="medium">$5,000 – $20,000</option>
          <option value="large">$20,000 – $100,000</option>
          <option value="enterprise">$100,000+</option>
        </select>
      </div>

      {/* Preferred language */}
      <fieldset>
        <legend className="text-sm font-medium text-forest-800 mb-3">{m.language.label}</legend>
        <div className="flex flex-wrap gap-3">
          {languageOptions.map((opt) => (
            <label
              key={opt}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-cream-200 bg-cream-50 cursor-pointer text-sm text-forest-800 hover:border-timber-300 has-[:checked]:border-timber-500 has-[:checked]:bg-timber-50 has-[:checked]:text-timber-700 transition-colors"
            >
              <input
                type="radio"
                name="preferred_language"
                value={opt}
                defaultChecked={opt === locale}
                className="sr-only"
              />
              {m.language.options[opt]}
            </label>
          ))}
        </div>
      </fieldset>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-forest-800 mb-1.5">
          {m.description.label}
        </label>
        <textarea
          id="description"
          name="description"
          rows={5}
          placeholder={m.description.placeholder}
          className="w-full px-4 py-3 rounded-xl border border-cream-200 bg-cream-50 text-forest-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-timber-500 focus:border-transparent text-sm resize-y"
        />
        <p className="text-xs text-stone-400 mt-1">{m.description.hint}</p>
      </div>

      {/* File note */}
      <p className="text-xs text-stone-400 italic bg-cream-100 px-4 py-3 rounded-lg">
        {m.fileNote}
      </p>

      {/* Submit */}
      <button
        type="submit"
        disabled={submitting}
        className="btn-primary w-full justify-center text-base py-4 disabled:opacity-60"
      >
        {submitting ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Sending...
          </span>
        ) : (
          <>
            <Send className="w-4 h-4" aria-hidden="true" />
            {m.submit}
          </>
        )}
      </button>

      <p className="text-center text-xs text-stone-400">{m.privacy}</p>
    </form>
  );
}
