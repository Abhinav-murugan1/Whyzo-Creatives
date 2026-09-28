import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import SectionHeading from './SectionHeading';
import MagneticButton from './MagneticButton';
import {
  CURRENCIES,
  CURRENCY_ORDER,
  customAmountError,
  formatCustomAmount,
  recommendCurrency
} from '../lib/currency';
import Reveal from './Reveal';
import { AlertTriangle, Loader2, Send, CheckCircle } from 'lucide-react';

/*
 * EmailJS delivers the inquiry straight from the browser - no backend. The public key is public by
 * design (it only authorises sends against this account's allowlisted domains), so it ships in the
 * bundle like the service and template ids. Lock the account down under EmailJS > Account > Security
 * by allowlisting the live domain, otherwise anyone can post through the form.
 */
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_gjk9ayn';
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_k3u9l8j';
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'Ce0wbof9anolL03p3';

const allServices = [
  'Videography',
  'Photography',
  'Video Editing',
  'Graphic Designing',
  'Web Designing',
  'AI Video Creation',
  'Web Development & Designing'
];

const allCategories = [
  'F&B',
  'Automotive',
  'Events',
  'Social Media Contents',
  'Personal Branding',
  'Influencer Marketing'
];

const ContactSection = ({ initialService }) => {
  const [selectedServices, setSelectedServices] = useState(['Videography']);
  const [prevInitial, setPrevInitial] = useState(initialService);
  const [selectedCategory, setSelectedCategory] = useState('Automotive');
  /*
   * Seeded lazily so the region check runs once on mount rather than on every render. The tier is stored
   * by id, not by label, so switching currency re-prices the selection instead of clearing it.
   */
  const [currency, setCurrency] = useState(() => recommendCurrency());
  const [recommended] = useState(() => recommendCurrency());
  /* Raw digits only. Grouping is applied for display, so a half-typed figure is never fed back in. */
  const [customAmount, setCustomAmount] = useState('');
  const [budgetTouched, setBudgetTouched] = useState(false);

  /*
   * The budget is optional. Plenty of genuine enquiries arrive before a number exists, and refusing to
   * send those would cost real leads to protect a field nobody has to fill. A figure is only validated
   * once something has actually been typed.
   */
  const hasBudget = customAmount.length > 0;
  const budgetError = hasBudget ? customAmountError(customAmount, currency) : null;
  const selectedBudget = hasBudget ? formatCustomAmount(customAmount, currency) : 'Not specified';
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    brief: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState(null);

  if (initialService && initialService !== prevInitial) {
    setPrevInitial(initialService);
    const match = allServices.find(s => s.toLowerCase().includes(initialService.toLowerCase()));
    if (match) {
      setSelectedServices([match]);
    }
  }

  const toggleService = (srv) => {
    if (selectedServices.includes(srv)) {
      if (selectedServices.length > 1) {
        setSelectedServices(selectedServices.filter(s => s !== srv));
      }
    } else {
      setSelectedServices([...selectedServices, srv]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || isSending) return;

    /* An empty budget is fine; a typed one has to be a real figure */
    if (budgetError) {
      setBudgetTouched(true);
      document.getElementById('custom-budget')?.focus();
      return;
    }

    if (!EMAILJS_PUBLIC_KEY) {
      setSendError('Email is not configured yet. Set VITE_EMAILJS_PUBLIC_KEY and redeploy.');
      return;
    }

    setIsSending(true);
    setSendError(null);

    // The template renders {{name}}, {{time}} and {{message}}; everything else is folded into message
    const message = [
      `Email: ${formData.email}`,
      formData.company ? `Company: ${formData.company}` : null,
      `Services: ${selectedServices.join(', ')}`,
      `Category: ${selectedCategory}`,
      hasBudget ? `Budget: ${selectedBudget} (${currency})` : 'Budget: not specified',
      '',
      'Brief:',
      formData.brief || '(no brief provided)'
    ]
      .filter(line => line !== null)
      .join('\n');

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          name: formData.name,
          time: new Date().toLocaleString('en-GB', { dateStyle: 'full', timeStyle: 'short' }),
          message,
          // Spare fields so the template can be extended without touching this code
          email: formData.email,
          reply_to: formData.email,
          company: formData.company,
          services: selectedServices.join(', '),
          category: selectedCategory,
          budget: hasBudget ? `${selectedBudget} (${currency})` : 'Not specified',
          currency
        },
        { publicKey: EMAILJS_PUBLIC_KEY }
      );
      setSubmitted(true);
    } catch (error) {
      // Never show the success panel on a failed send - the lead would be lost silently
      setSendError(error?.text || 'Transmission failed. Please try again, or email us directly.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-black text-white relative border-t border-white/10">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-grid-lines opacity-15 pointer-events-none"></div>

      <div className="w-full max-w-[1700px] mx-auto px-8 sm:px-12 md:px-16 lg:px-24 relative z-10">
        {/* Section Header */}
        <Reveal className="-mt-6 sm:-mt-10 md:-mt-12 mb-12 sm:mb-16 text-center flex flex-col justify-center items-center">
          <SectionHeading title="START A PROJECT" />
          <p className="mt-3 text-xs sm:text-sm md:text-base text-zinc-400 max-w-xl mx-auto font-poppins font-normal leading-relaxed">
            Have a project in mind? Share your vision and let's craft something extraordinary together.
          </p>
        </Reveal>

        {submitted ? (
          <div className="max-w-2xl mx-auto p-10 rounded-2xl bg-zinc-950 border border-white/20 text-center space-y-5 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.9)]">
            <div className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center mx-auto">
              <CheckCircle className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold uppercase tracking-tight">Inquiry Received</h3>
            <p className="text-zinc-300 max-w-md mx-auto text-sm leading-relaxed">
              Thank you, <span className="text-white font-semibold">{formData.name}</span>. The Whyzo Creatives production team has logged your inquiry for <span className="text-white font-semibold">{selectedServices.join(', ')}</span>. We will review your brief and reach out within 24 hours.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                setFormData({ name: '', email: '', company: '', brief: '' });
              }}
              className="px-8 py-3 rounded-full bg-zinc-900 border border-white/20 text-xs font-mono uppercase tracking-widest text-white hover:bg-white hover:text-black transition-colors"
            >
              Submit Another Inquiry
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Column: Interactive Scope Builder (7 Cols) */}
            <div className="lg:col-span-7 space-y-8">
              {/* Step 1: Services Selection */}
              <div>
                <label className="block text-[11px] font-sans font-semibold uppercase tracking-widest text-zinc-300 mb-4">
                  SELECT SERVICES REQUIRED
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {allServices.map((srv) => {
                    const isChecked = selectedServices.includes(srv);
                    return (
                      <button
                        type="button"
                        key={srv}
                        onClick={() => toggleService(srv)}
                        className={`px-4 py-2.5 rounded-xl text-xs font-sans uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                          isChecked
                            ? 'bg-white text-black font-semibold shadow-[inset_0_-1px_0_rgba(0,0,0,0.14)]'
                            : 'bg-zinc-950 text-zinc-400 border border-white/10 hover:border-white/30 hover:text-white'
                        }`}
                      >
                        {isChecked ? `✓ ${srv}` : srv}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Category Selection */}
              <div>
                <label className="block text-[11px] font-sans font-semibold uppercase tracking-widest text-zinc-300 mb-4">
                  SELECT WORK CATEGORY / INDUSTRY
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {allCategories.map((cat) => {
                    const isSelected = selectedCategory === cat;
                    return (
                      <button
                        type="button"
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`p-3.5 rounded-xl text-xs font-sans uppercase tracking-wider transition-all duration-300 cursor-pointer text-left ${
                          isSelected
                            ? 'bg-white text-black font-semibold border-2 border-white'
                            : 'bg-zinc-950 text-zinc-400 border border-white/10 hover:border-white/30 hover:text-white'
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 3: Budget Range */}
              <div>
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <label className="block text-[11px] font-sans font-semibold uppercase tracking-widest text-zinc-300">
                    ESTIMATED BUDGET
                  </label>

                  {/* Currency switch. Defaults to the visitor's region, stays theirs to override. */}
                  <div
                    className="inline-flex items-center rounded-full border border-white/10 bg-zinc-950 p-0.5"
                    role="group"
                    aria-label="Budget currency"
                  >
                    {CURRENCY_ORDER.map((code) => {
                      const isActive = currency === code;
                      const isRecommended = recommended === code;
                      return (
                        <button
                          type="button"
                          key={code}
                          onClick={() => setCurrency(code)}
                          aria-pressed={isActive}
                          title={isRecommended ? `${code} - recommended for your region` : `Show budgets in ${code}`}
                          className={`px-3 py-1.5 rounded-full text-[11px] font-mono uppercase tracking-wider transition-colors cursor-pointer ${
                            isActive
                              ? 'bg-white text-black font-bold'
                              : 'text-zinc-400 hover:text-white'
                          }`}
                        >
                          {CURRENCIES[code].label}
                          {isRecommended && (
                            <span
                              aria-hidden="true"
                              className={`ml-1.5 inline-block w-1 h-1 rounded-full align-middle ${
                                isActive ? 'bg-black/50' : 'bg-emerald-400'
                              }`}
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="custom-budget"
                    className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5"
                  >
                    AMOUNT IN {CURRENCIES[currency].label} <span className="text-zinc-600">(optional)</span>
                  </label>

                  <div className="relative">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-mono text-zinc-500">
                      {CURRENCIES[currency].symbol.trim()}
                    </span>
                    <input
                      id="custom-budget"
                      /*
                       * inputMode numeric rather than type=number: number inputs bring a spinner, let
                       * the wheel silently change the value on scroll, and reject the grouped display.
                       */
                      type="text"
                      inputMode="numeric"
                      autoComplete="off"
                      value={formatCustomAmount(customAmount, currency).replace(CURRENCIES[currency].symbol, '')}
                      onChange={(e) => setCustomAmount(e.target.value.replace(/\D/g, '').slice(0, 12))}
                      onBlur={() => setBudgetTouched(true)}
                      placeholder="0"
                      aria-invalid={Boolean(budgetTouched && budgetError)}
                      aria-describedby={budgetTouched && budgetError ? 'custom-budget-error' : 'custom-budget-hint'}
                      className={`w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-900 border text-white placeholder-zinc-600 focus:outline-none text-sm font-mono ${
                        budgetTouched && budgetError
                          ? 'border-red-500/50 focus:border-red-400'
                          : 'border-white/10 focus:border-white'
                      }`}
                    />
                  </div>

                  {budgetTouched && budgetError ? (
                    <p id="custom-budget-error" role="alert" className="mt-1.5 text-[11px] text-red-300">
                      {budgetError}
                    </p>
                  ) : (
                    <p id="custom-budget-hint" className="mt-1.5 text-[11px] text-zinc-500">
                      Approximate is fine - it only helps us scope the right crew. Leave it blank if you are not sure yet.
                    </p>
                  )}
                </div>

                {recommended === currency && (
                  <p className="mt-2.5 text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                    Showing {CURRENCIES[currency].label} - recommended for your region
                  </p>
                )}
              </div>
            </div>

            {/* Right Column: Contact Details Form (5 Cols) */}
            <div className="lg:col-span-5 rounded-2xl bg-zinc-950 border border-white/20 p-8 space-y-5 flex flex-col justify-between">
              <div className="space-y-5">
                <div>
                  <h3 className="text-xl font-bold uppercase tracking-tight mb-1">Project Brief Details</h3>
                  <p className="text-xs text-zinc-400">Fill in your contact information to finalize your request.</p>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                    YOUR NAME *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Alexander Wright"
                    className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-white/10 text-white placeholder-zinc-600 focus:outline-none focus:border-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                    EMAIL ADDRESS *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="alexander@brand.com"
                    className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-white/10 text-white placeholder-zinc-600 focus:outline-none focus:border-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                    COMPANY / BRAND NAME
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="Whyzo Client Inc."
                    className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-white/10 text-white placeholder-zinc-600 focus:outline-none focus:border-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                    PROJECT GOALS & TIMELINE
                  </label>
                  <textarea
                    rows={3}
                    value={formData.brief}
                    onChange={(e) => setFormData({ ...formData, brief: e.target.value })}
                    placeholder="Tell us about your brand vision, key deliverables, target launch date..."
                    className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-white/10 text-white placeholder-zinc-600 focus:outline-none focus:border-white text-sm resize-none"
                  ></textarea>
                </div>
              </div>

              <MagneticButton
                type="submit"
                disabled={isSending}
                className="w-full py-4 rounded-full bg-white text-black font-bold text-xs uppercase tracking-widest hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-[inset_0_-1px_0_rgba(0,0,0,0.14)] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {/* Label stays put - a morphing "Transmitting..." read as a chat typing indicator */}
                <span>Transmit Inquiry</span>
                {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </MagneticButton>

              {sendError && (
                <div
                  role="alert"
                  className="mt-3 flex items-start gap-2.5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs text-red-200"
                >
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{sendError}</span>
                </div>
              )}
            </div>
          </form>
        )}
      </div>

      {/* Small Glowing Separator between Contact Section and Footer */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden pointer-events-none flex justify-center">
        <div className="w-full max-w-5xl h-px bg-gradient-to-r from-transparent via-white/20 to-transparent relative">
          {/* Intense center core glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 sm:w-72 h-[1.5px] bg-gradient-to-r from-transparent via-white/70 to-transparent blur-[0.5px]"></div>
          {/* Ambient soft glow aura */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 sm:w-96 h-6 bg-white/[0.12] blur-xl rounded-full"></div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
