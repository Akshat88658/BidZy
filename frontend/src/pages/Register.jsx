import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Gavel, Mail, Lock, User, School, MapPin,
  UserCog, UserCheck, AlertCircle, Sparkles, Eye, EyeOff
} from 'lucide-react';

const ROLES = [
  {
    value: 'buyer',
    label: 'Buyer',
    icon: <UserCheck className="w-5 h-5" />,
    desc: 'Browse & bid on items',
    color: 'border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
    inactive: 'border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:border-emerald-300 dark:hover:border-emerald-800'
  },
  {
    value: 'seller',
    label: 'Seller',
    icon: <UserCog className="w-5 h-5" />,
    desc: 'List & auction your stuff',
    color: 'border-primary-500 bg-primary-550/10 text-primary-700 dark:text-primary-400',
    inactive: 'border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:border-primary-300 dark:hover:border-primary-800'
  },
];

const Register = () => {
  const [form, setForm] = useState({
    username: '', email: '', password: '', confirmPassword: '',
    collegeName: '', location: '', role: 'buyer'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const { register, token, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { if (token) navigate('/dashboard', { replace: true }); }, [token]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setErrorMsg('Please enter a valid email address');
      return;
    }
    if (form.password !== form.confirmPassword) { setErrorMsg('Passwords do not match'); return; }
    if (form.password.length < 6) { setErrorMsg('Password must be at least 6 characters'); return; }

    const res = await register(form.username, form.email, form.password, form.collegeName, form.location, form.role);
    if (!res.success) setErrorMsg(res.message);
  };

  const inputClass = "w-full pl-10 pr-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 text-zinc-900 dark:text-white placeholder:text-zinc-450 dark:placeholder:text-zinc-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all text-sm font-semibold";

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background orbs */}
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-primary-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-primary-500/3 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-xl relative z-10">
        {/* Card */}
        <div className="bg-white dark:bg-zinc-955 rounded-3xl shadow-2xl shadow-zinc-200/20 dark:shadow-black border border-zinc-200/50 dark:border-zinc-900 overflow-hidden">
          
          {/* Top gradient strip */}
          <div className="h-2 bg-gradient-to-r from-zinc-800 via-primary-500 to-zinc-950" />
          
          <div className="p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex p-3 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl text-zinc-950 mb-4 shadow-xl shadow-primary-500/25">
                <Gavel className="w-7 h-7" />
              </div>
              <h1 className="font-display font-black text-3xl text-zinc-950 dark:text-white leading-tight">Join Bidzy Today</h1>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1.5 flex items-center justify-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-primary-500" />
                AI-powered student marketplace — it's free!
              </p>
            </div>

            {/* Error */}
            {errorMsg && (
              <div className="flex items-center gap-2.5 p-3.5 bg-rose-500/5 border border-rose-500/20 text-rose-500 rounded-2xl text-sm font-semibold mb-6 animate-pulse">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Role Selector */}
              <div>
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-400 uppercase tracking-wide block mb-2.5">
                  I want to…
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {ROLES.map(r => (
                    <button
                      key={r.value}
                      type="button"
                      onClick={() => setForm({ ...form, role: r.value })}
                      className={`flex items-center gap-3 p-3.5 rounded-2xl border-2 transition-all text-left ${
                        form.role === r.value 
                          ? 'border-primary-500 bg-primary-500/5 text-primary-600 dark:text-primary-400' 
                          : r.inactive
                      }`}
                    >
                      <span className={`shrink-0 ${form.role === r.value ? 'text-primary-500' : 'opacity-50'}`}>{r.icon}</span>
                      <div>
                        <p className="font-bold text-sm">{r.label}</p>
                        <p className="text-[11px] font-normal opacity-70 leading-tight">{r.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Username & Email */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-400 uppercase tracking-wide block mb-1.5">
                    Username
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-400 pointer-events-none">
                      <User className="w-4 h-4" />
                    </span>
                    <input
                      id="reg-username"
                      type="text"
                      name="username"
                      placeholder="john_doe"
                      value={form.username}
                      onChange={handleChange}
                      className={inputClass}
                      required
                      autoComplete="username"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-400 uppercase tracking-wide block mb-1.5">
                    College Email
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-400 pointer-events-none">
                      <Mail className="w-4 h-4" />
                    </span>
                    <input
                      id="reg-email"
                      type="email"
                      name="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={handleChange}
                      className={inputClass}
                      required
                      autoComplete="email"
                    />
                  </div>
                </div>
              </div>

              {/* Password & Confirm */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-400 uppercase tracking-wide block mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-400 pointer-events-none">
                      <Lock className="w-4 h-4" />
                    </span>
                    <input
                      id="reg-password"
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      placeholder="Min 6 chars"
                      value={form.password}
                      onChange={handleChange}
                      className={inputClass}
                      required
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-355 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-400 uppercase tracking-wide block mb-1.5">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-400 pointer-events-none">
                      <Lock className="w-4 h-4" />
                    </span>
                    <input
                      id="reg-confirm-password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      placeholder="Repeat password"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      className={inputClass}
                      required
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-355 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* College & Location */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-400 uppercase tracking-wide block mb-1.5">
                    College Name
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-400 pointer-events-none">
                      <School className="w-4 h-4" />
                    </span>
                    <input
                      id="reg-college"
                      type="text"
                      name="collegeName"
                      placeholder="IIT Delhi"
                      value={form.collegeName}
                      onChange={handleChange}
                      className={inputClass}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-400 uppercase tracking-wide block mb-1.5">
                    Location
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-400 pointer-events-none">
                      <MapPin className="w-4 h-4" />
                    </span>
                    <input
                      id="reg-location"
                      type="text"
                      name="location"
                      placeholder="New Delhi"
                      value={form.location}
                      onChange={handleChange}
                      className={inputClass}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Submit */}
              <button
                id="reg-submit"
                type="submit"
                disabled={loading}
                className="w-full py-3.5 btn-primary font-bold text-sm shadow-lg shadow-primary-500/10 active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed mt-1"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin w-4 h-4 text-zinc-950" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                    Creating Account…
                  </span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-zinc-950" />
                    Create My Free Account
                  </>
                )}
              </button>
            </form>

            {/* Toggle sign in */}
            <div className="mt-7 pt-6 border-t border-zinc-150 dark:border-zinc-900 text-center">
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Already have an account?{' '}
                <Link to="/login" className="text-primary-500 hover:text-primary-600 font-bold hover:underline transition-colors">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Trust badges */}
        <div className="flex items-center justify-center gap-6 mt-6 text-xs text-zinc-400 dark:text-zinc-550 font-semibold">
          <span className="flex items-center gap-1.5">🔒 SSL Secured</span>
          <span className="flex items-center gap-1.5">🎓 Students Only</span>
          <span className="flex items-center gap-1.5">✅ Free Forever</span>
        </div>
      </div>
    </div>
  );
};

export default Register;
