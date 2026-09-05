import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.warn('[System Auto-Recovery Caught Error]:', error, errorInfo);
  }

  handleReload = () => {
    try {
      localStorage.removeItem('noor_products');
      localStorage.removeItem('noor_reviews');
      localStorage.removeItem('noor_cart');
    } catch (e) {}
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div dir="rtl" className="min-h-screen bg-[#0B1E2C] text-slate-100 flex items-center justify-center p-4">
          <div className="max-w-md w-full p-6 sm:p-8 bg-[#132F45] border border-[#2A5578] rounded-3xl text-center space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-amber-400 mx-auto flex items-center justify-center text-2xl shadow-lg">
              ⚡
            </div>
            <h2 className="text-lg font-bold text-emerald-400">نۇر دۇكىنى سىستېمىسى</h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              سېستىما دەل ۋاقتىدا قوغداش ھالىتىگە ئۆتتى. تۆۋەندىكى كۇنۇپكىنى بېسىپ ئەڭ يېڭى سانلىق مەلۇماتلار بىلەن دەرھال قايتا قوزغىتىڭ:
            </p>
            <button
              onClick={this.handleReload}
              className="w-full py-3 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs sm:text-sm shadow-xl transition-all cursor-pointer"
            >
              🔄 سىستېمىنى قايتا قوزغىتىش ۋە يېڭىلاش
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
