'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Shield, GraduationCap, User, Users, Lock, Eye, EyeOff, KeyRound } from 'lucide-react';

type Role = 'principal' | 'teacher' | 'student' | 'parent';

export default function Login() {
  const { login, user, loading } = useAuth();
  const [role, setRole] = useState<Role>('principal');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Auto-fill test credentials helper
  const handleAutoFill = () => {
    if (role === 'principal') {
      setUsername('principal');
      setPassword('password123');
    } else if (role === 'teacher') {
      setUsername('ramesh.t');
      setPassword('password123');
    } else if (role === 'student') {
      setUsername('stu101');
      setPassword('password123');
    } else if (role === 'parent') {
      setUsername('rajesh.p');
      setPassword('password123');
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setErrorMsg('Please enter both username and password.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');
    try {
      await login(username, password);
    } catch (err: any) {
      console.error('Login error:', err);
      setErrorMsg(err.message || 'Login failed. Please verify credentials.');
      setSubmitting(false);
    }
  };

  // Reset inputs when role changes
  useEffect(() => {
    setUsername('');
    setPassword('');
    setErrorMsg('');
  }, [role]);

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-slate-100 dark:bg-slate-950 px-4 transition-colors">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden p-6 md:p-8 flex flex-col gap-6 text-left">
        
        {/* Title */}
        <div className="text-center">
          <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white leading-none">
            Unified ERP Portal
          </h2>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mt-2">
            Secure Role-Based Access Gate
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 dark:bg-slate-950 rounded-xl border border-slate-250 dark:border-slate-850">
          {(['principal', 'teacher', 'student', 'parent'] as Role[]).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className={`flex flex-col items-center justify-center py-2.5 rounded-lg transition-all cursor-pointer ${
                role === r
                  ? 'bg-white dark:bg-slate-900 text-[var(--primary-color)] shadow-sm font-bold'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-350'
              }`}
            >
              {r === 'principal' && <Shield size={16} />}
              {r === 'teacher' && <GraduationCap size={16} />}
              {r === 'student' && <User size={16} />}
              {r === 'parent' && <Users size={16} />}
              <span className="text-[9px] capitalize mt-1 tracking-wider">
                {r === 'principal' ? 'Admin' : r}
              </span>
            </button>
          ))}
        </div>

        {/* Help box */}
        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-250 dark:border-amber-900 p-3 rounded-lg flex justify-between items-center text-[10px] text-amber-800 dark:text-amber-300">
          <div className="flex items-center gap-1.5 font-medium leading-normal">
            <KeyRound size={13} className="shrink-0" />
            <span>Click to fill mock credentials for this role.</span>
          </div>
          <button
            type="button"
            onClick={handleAutoFill}
            className="bg-amber-200 dark:bg-amber-900 hover:bg-amber-300 px-2.5 py-1 rounded font-bold text-slate-900 dark:text-amber-100 transition-colors uppercase tracking-wider cursor-pointer"
          >
            Auto Fill
          </button>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4 text-xs">
          {errorMsg && (
            <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 text-red-650 dark:text-red-400 p-3 rounded-lg font-semibold leading-relaxed">
              ⚠️ {errorMsg}
            </div>
          )}

          {/* Username */}
          <div className="flex flex-col gap-1">
            <label className="font-bold text-slate-500">
              {role === 'principal' && 'Principal Username'}
              {role === 'teacher' && 'Teacher Username'}
              {role === 'student' && 'Student ID (Roll No / ID)'}
              {role === 'parent' && 'Parent Username'}
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 focus:border-[var(--primary-color)] rounded p-2.5 pl-9 outline-none text-slate-805 dark:text-white transition-colors"
                placeholder={
                  role === 'principal' ? 'e.g. principal' :
                  role === 'teacher' ? 'e.g. ramesh.t' :
                  role === 'student' ? 'e.g. stu101' : 'e.g. rajesh.p'
                }
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                {role === 'principal' && <Shield size={14} />}
                {role === 'teacher' && <GraduationCap size={14} />}
                {role === 'student' && <User size={14} />}
                {role === 'parent' && <Users size={14} />}
              </div>
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1">
            <label className="font-bold text-slate-500">Secure Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 focus:border-[var(--primary-color)] rounded p-2.5 pl-9 pr-9 outline-none text-slate-805 dark:text-white transition-colors"
                placeholder="••••••••"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <Lock size={14} />
              </div>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-655"
              >
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-primary hover:bg-blue-800 text-white font-extrabold py-3 rounded tracking-wider uppercase transition-colors shadow-lg cursor-pointer text-center"
          >
            {submitting ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
