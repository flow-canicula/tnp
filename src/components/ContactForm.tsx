'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, CheckCircle, ChevronDown, Check } from 'lucide-react';

const timberOptions  = ['keyaki', 'hinoki', 'oak', 'walnut', 'ash', 'teak', 'other'] as const;
const projectTypeOptions = ['flooring', 'furniture', 'both', 'commercial', 'other'] as const;
const locationOptions    = ['vietnam', 'japan', 'international'] as const;
const languageOptions    = ['en', 'vi', 'ja'] as const;

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

/* ── Shared field label ─────────────────────────────────────────────────── */
function FieldLabel({ htmlFor, children, required }: { htmlFor: string; children: React.ReactNode; required?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="block text-[11px] font-bold uppercase tracking-widest text-stone-400 mb-2">
      {children}{required && <span className="text-timber-500 ml-1" aria-hidden="true">*</span>}
    </label>
  );
}

/* ── Underline text input ───────────────────────────────────────────────── */
function LineInput({ id, name, type = 'text', placeholder, required, autoComplete, hint }: {
  id: string; name: string; type?: string; placeholder: string;
  required?: boolean; autoComplete?: string; hint?: string;
}) {
  return (
    <div className="relative">
      <input
        id={id} name={name} type={type}
        required={required} autoComplete={autoComplete}
        placeholder={placeholder}
        className="
          w-full bg-transparent border-0 border-b-2 border-cream-200
          py-3 pr-2 text-[15px] text-forest-900 placeholder-stone-300/70
          focus:outline-none focus:border-timber-500
          transition-colors duration-200
        "
      />
      {hint && <p className="text-[11px] text-stone-400 mt-1.5">{hint}</p>}
    </div>
  );
}

/* ── Elegant custom dropdown ────────────────────────────────────────────── */
function ElegantSelect({ id, name, label, placeholder, options, required }: {
  id: string; name: string; label: string; placeholder: string;
  options: { value: string; label: string }[]; required?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const selectedLabel = options.find(o => o.value === selected)?.label;

  return (
    <div ref={ref} className="relative">
      {/* Hidden native input for form submission */}
      <input type="hidden" name={name} value={selected ?? ''} required={required} />

      <button
        type="button"
        id={id}
        aria-label={selectedLabel ?? placeholder}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen(v => !v)}
        className="
          w-full flex items-center justify-between gap-3
          bg-transparent border-0 border-b-2 border-cream-200
          py-3 text-left text-[15px]
          focus:outline-none focus:border-timber-500
          transition-colors duration-200
          cursor-pointer
        "
      >
        <span className={selectedLabel ? 'text-forest-900' : 'text-stone-300/70'}>
          {selectedLabel ?? placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-stone-400 shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>

      {/* Dropdown panel */}
      <div
        role="listbox"
        aria-label={label}
        className={`
          absolute left-0 right-0 top-full z-50 mt-1
          bg-white rounded-xl overflow-hidden
          shadow-[0_8px_40px_rgba(15,14,12,0.12),0_2px_8px_rgba(15,14,12,0.06)]
          border border-cream-200/80
          transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
          origin-top
          ${open ? 'opacity-100 scale-y-100 pointer-events-auto' : 'opacity-0 scale-y-90 pointer-events-none'}
        `}
      >
        {options.map((opt, i) => (
          <div key={opt.value}>
            {i > 0 && <div className="mx-4 h-px bg-cream-100" />}
            <button
              type="button"
              role="option"
              aria-selected={selected === opt.value}
              onClick={() => { setSelected(opt.value); setOpen(false); }}
              className="
                w-full flex items-center justify-between gap-3
                px-5 py-3.5 text-left text-[14px] cursor-pointer
                transition-colors duration-150
                hover:bg-cream-50
              "
            >
              <span className={selected === opt.value ? 'text-timber-600 font-medium' : 'text-forest-800'}>
                {opt.label}
              </span>
              {selected === opt.value && (
                <Check className="w-3.5 h-3.5 text-timber-500 shrink-0" aria-hidden="true" />
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Section divider inside form ────────────────────────────────────────── */
function FormSection({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-4 pt-2 pb-1">
      <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-stone-400">{label}</span>
      <span className="flex-1 h-px bg-cream-200" aria-hidden="true" />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════ */
export default function ContactForm({ locale, messages: m }: ContactFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [timberSelected, setTimberSelected] = useState<string[]>([]);

  function toggleTimber(val: string) {
    setTimberSelected(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]);
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
      const res = await fetch(`https://formspree.io/f/${process.env.NEXT_PUBLIC_FORMSPREE_ID}`, {
        method: 'POST', body: data, headers: { Accept: 'application/json' },
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
      <div className="flex flex-col items-center justify-center text-center py-16 gap-5">
        <div className="w-16 h-16 rounded-full bg-timber-500/10 flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-timber-500" aria-hidden="true" />
        </div>
        <h2 className="font-serif text-2xl text-forest-900">{m.successTitle}</h2>
        <p className="text-stone-500 max-w-sm text-sm leading-relaxed">{m.successText}</p>
      </div>
    );
  }

  const projectTypeOpts = projectTypeOptions.map(v => ({ value: v, label: m.projectType.options[v] }));
  const locationOpts    = locationOptions.map(v => ({ value: v, label: m.location.options[v] }));
  const budgetOpts = [
    { value: 'small',      label: 'Under $5,000' },
    { value: 'medium',     label: '$5,000 – $20,000' },
    { value: 'large',      label: '$20,000 – $100,000' },
    { value: 'enterprise', label: '$100,000+' },
  ];

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate aria-label={m.title} className="flex flex-col gap-7">

      {/* ── Contact details ── */}
      <FormSection label="Contact Details" />

      <div className="grid sm:grid-cols-2 gap-x-8 gap-y-7">
        <div>
          <FieldLabel htmlFor="name" required>{m.name.label}</FieldLabel>
          <LineInput id="name" name="name" placeholder={m.name.placeholder} required autoComplete="name" />
        </div>
        <div>
          <FieldLabel htmlFor="email" required>{m.email.label}</FieldLabel>
          <LineInput id="email" name="email" type="email" placeholder={m.email.placeholder} required autoComplete="email" />
        </div>
      </div>

      <div>
        <FieldLabel htmlFor="phone">{m.phone.label}</FieldLabel>
        <LineInput id="phone" name="phone" type="tel" placeholder={m.phone.placeholder} autoComplete="tel" hint={m.phone.hint} />
      </div>

      {/* ── Project scope ── */}
      <FormSection label="Project Scope" />

      <div>
        <FieldLabel htmlFor="projectType">{m.projectType.label}</FieldLabel>
        <ElegantSelect
          id="projectType" name="project_type" label={m.projectType.label}
          placeholder={m.projectType.placeholder} options={projectTypeOpts}
        />
      </div>

      {/* Timber preference — pill checkboxes */}
      <fieldset>
        <legend className="text-[11px] font-bold uppercase tracking-widest text-stone-400 mb-3">{m.timberPreference.label}</legend>
        <p className="text-[11px] text-stone-400 mb-3">{m.timberPreference.hint}</p>
        <div className="flex flex-wrap gap-2">
          {timberOptions.map(opt => {
            const active = timberSelected.includes(opt);
            return (
              <label
                key={opt}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-full border text-[13px] cursor-pointer
                  transition-all duration-200 select-none
                  ${active
                    ? 'border-timber-500 bg-timber-500 text-white'
                    : 'border-cream-200 bg-white text-forest-800 hover:border-timber-300'
                  }
                `}
              >
                <input
                  type="checkbox" name="timber_preference_raw" value={opt}
                  checked={active} onChange={() => toggleTimber(opt)} className="sr-only"
                />
                {active && <Check className="w-3 h-3 shrink-0" aria-hidden="true" />}
                {m.timberPreference.options[opt]}
              </label>
            );
          })}
        </div>
      </fieldset>

      <div>
        <FieldLabel htmlFor="quantity">{m.quantity.label}</FieldLabel>
        <LineInput id="quantity" name="quantity" placeholder={m.quantity.placeholder} />
      </div>

      {/* ── Logistics ── */}
      <FormSection label="Logistics" />

      <div className="grid sm:grid-cols-2 gap-x-8 gap-y-7">
        <div>
          <FieldLabel htmlFor="location">{m.location.label}</FieldLabel>
          <ElegantSelect
            id="location" name="location" label={m.location.label}
            placeholder={m.location.placeholder} options={locationOpts}
          />
        </div>
        <div>
          <FieldLabel htmlFor="budget">{m.budget.label}</FieldLabel>
          <ElegantSelect
            id="budget" name="budget" label={m.budget.label}
            placeholder={m.budget.placeholder} options={budgetOpts}
          />
        </div>
      </div>

      {/* Preferred language — pill radio */}
      <fieldset>
        <legend className="text-[11px] font-bold uppercase tracking-widest text-stone-400 mb-3">{m.language.label}</legend>
        <div className="flex flex-wrap gap-2">
          {languageOptions.map(opt => (
            <label
              key={opt}
              className="flex items-center px-5 py-2 rounded-full border border-cream-200 bg-white cursor-pointer text-[13px] text-forest-800 transition-all duration-200 hover:border-timber-300 has-[:checked]:border-timber-500 has-[:checked]:bg-timber-500 has-[:checked]:text-white select-none"
            >
              <input type="radio" name="preferred_language" value={opt} defaultChecked={opt === locale} className="sr-only" />
              {m.language.options[opt]}
            </label>
          ))}
        </div>
      </fieldset>

      {/* ── Notes ── */}
      <FormSection label="Notes" />

      <div>
        <FieldLabel htmlFor="description">{m.description.label}</FieldLabel>
        <textarea
          id="description" name="description" rows={5}
          placeholder={m.description.placeholder}
          className="
            w-full bg-transparent border-0 border-b-2 border-cream-200
            py-3 text-[15px] text-forest-900 placeholder-stone-300/70
            focus:outline-none focus:border-timber-500
            transition-colors duration-200 resize-none
          "
        />
        <p className="text-[11px] text-stone-400 mt-1.5">{m.description.hint}</p>
      </div>

      {/* File note */}
      <p className="text-[11px] text-stone-400 italic bg-cream-100 px-4 py-3 rounded-xl leading-relaxed">
        {m.fileNote}
      </p>

      {/* Submit */}
      <button
        type="submit"
        disabled={submitting}
        className="
          group relative w-full flex items-center justify-center gap-3
          bg-forest-900 hover:bg-timber-500 text-white
          font-semibold text-[15px] py-5 rounded-full
          transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
          hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(169,123,62,0.35)]
          disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
          cursor-pointer
        "
      >
        {submitting ? (
          <>
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Sending…
          </>
        ) : (
          <>
            <Send className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true" />
            {m.submit}
          </>
        )}
      </button>

      <p className="text-center text-[11px] text-stone-400 leading-relaxed">{m.privacy}</p>
    </form>
  );
}
