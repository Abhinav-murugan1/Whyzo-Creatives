import React from 'react';

/*
 * Without a boundary, React 19 unmounts the entire root when any component throws during render. The
 * app's <div id="root"> empties, the black page background is all that is left, and the visitor sees a
 * blank black screen with no indication that anything failed - which is indistinguishable from a network
 * stall. This catches the throw, keeps the page addressable, and shows the error text so a fault can be
 * reported rather than guessed at.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    /*
     * The production build strips console.* calls, so this is written to a global instead. It gives
     * anyone debugging a live incident something to read: `window.__whyzoError` in the console.
     */
    window.__whyzoError = {
      message: error?.message ?? String(error),
      stack: error?.stack,
      componentStack: info?.componentStack
    };
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-6 py-20 font-sans">
        <div className="w-full max-w-xl text-center">
          <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500 mb-4">
            // Something broke
          </span>
          <h1 className="font-poppins poppins-bold font-bold text-2xl sm:text-3xl uppercase tracking-tight mb-4">
            This page failed to load
          </h1>
          <p className="text-sm text-zinc-400 leading-relaxed mb-8">
            A reload usually clears it. If it keeps happening, send us the detail below.
          </p>

          <button
            type="button"
            onClick={this.handleReload}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black text-xs font-mono font-bold uppercase tracking-widest hover:bg-zinc-200 transition-colors cursor-pointer"
          >
            Reload page
          </button>

          <p className="mt-10 font-mono text-[11px] leading-relaxed text-zinc-600 break-words">
            {error?.message ?? String(error)}
          </p>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
