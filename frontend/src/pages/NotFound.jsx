import { Link } from 'react-router-dom';
export default function NotFound() {
  return (
    <div className="h-screen flex flex-col items-center justify-center space-y-4 bg-slate-50">
      <h1 className="text-4xl font-bold text-brand-600">404</h1>
      <p className="text-slate-600">Page not found</p>
      <Link to="/" className="px-4 py-2 bg-brand-600 text-white rounded-lg">Go Home</Link>
    </div>
  );
}