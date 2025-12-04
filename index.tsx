import React, { Component, ReactNode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// [CRITICAL FIX] Polyfill process for browser environments (Vercel/Vite/CRA)
// This prevents "ReferenceError: process is not defined" which causes white screens.
if (typeof window !== 'undefined' && typeof process === 'undefined') {
  (window as any).process = { env: {} };
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

interface ErrorBoundaryProps {
  children?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

// Simple Error Boundary to catch runtime errors and prevent white screen of death
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
          <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#e11d48' }}>앱 실행 중 문제가 발생했습니다.</h1>
          <p style={{ color: '#475569', marginBottom: '2rem' }}>잠시 후 다시 시도해주시거나, 문제가 지속되면 관리자에게 문의해주세요.</p>
          <div style={{ padding: '1rem', background: '#f1f5f9', borderRadius: '0.5rem', overflowX: 'auto', textAlign: 'left' }}>
            <p style={{ fontWeight: 'bold', color: '#334155', marginBottom: '0.5rem' }}>Error Details:</p>
            <code style={{ fontSize: '0.875rem', color: '#dc2626' }}>
              {this.state.error?.toString()}
            </code>
          </div>
          <button 
            onClick={() => window.location.reload()} 
            style={{ marginTop: '2rem', padding: '0.75rem 1.5rem', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 'bold' }}
          >
            앱 다시 불러오기
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);