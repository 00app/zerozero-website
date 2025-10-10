import React, { useState } from 'react';
import { X } from 'lucide-react';

interface SignupPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSignup: (method: string, value?: string) => void;
}

export function SignupPopup({ isOpen, onClose, onSignup }: SignupPopupProps) {
  const [inputValue, setInputValue] = useState('');
  const [inputType, setInputType] = useState<'email' | 'mobile'>('email');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSignup(inputType, inputValue);
      setInputValue('');
      onClose();
    }
  };

  const handleSocialSignup = (provider: string) => {
    onSignup(provider);
    onClose();
  };

  return (
    <>
      {/* Backdrop - solid black */}
      <div 
        className="fixed inset-0 bg-black z-50 transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Popup Container - slides up from bottom */}
      <div 
        className="fixed inset-0 z-50 flex items-end lg:items-center justify-center pointer-events-none"
        onClick={onClose}
      >
        <div 
          className="w-full lg:w-auto lg:max-w-[480px] bg-black rounded-t-2xl lg:rounded-2xl pointer-events-auto animate-slide-up overflow-hidden"
          style={{
            maxHeight: '80vh',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 lg:p-10 h-full overflow-y-auto scrollbar-hide">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-[28px] font-extrabold uppercase text-white">
                sign up for more tips
              </h4>
              <button
                onClick={onClose}
                className="btn-ghost text-[28px] text-white hover:text-white/80 transition-colors duration-200 leading-none"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            
            {/* Toggle input type */}
            <div className="flex gap-4 mb-6 justify-center">
              <button
                onClick={() => setInputType('email')}
                className={`pill ${inputType === 'email' ? 'bg-white text-black' : 'bg-white/5 text-white'} transition-colors duration-200`}
              >
                email
              </button>
              <button
                onClick={() => setInputType('mobile')}
                className={`pill ${inputType === 'mobile' ? 'bg-white text-black' : 'bg-white/5 text-white'} transition-colors duration-200`}
              >
                mobile
              </button>
            </div>

            {/* Email/Mobile Input Form */}
            <form onSubmit={handleSubmit} className="mb-8">
              <input
                type={inputType === 'email' ? 'email' : 'tel'}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={inputType === 'email' ? 'your@email.com' : '+44 7700 900000'}
                className="zz-input w-full mb-6"
                required
              />
              
              <button 
                type="submit"
                className="bg-white text-black font-bold uppercase px-8 py-3 rounded-full text-[16px] hover:bg-white/90 transition-colors duration-200 w-full"
              >
                SIGN UP
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 mb-8">
              <div className="flex-1 h-px bg-white/20"></div>
              <span className="text-[14px] font-bold text-white/40 uppercase">or</span>
              <div className="flex-1 h-px bg-white/20"></div>
            </div>

            {/* Social Login Options */}
            <div className="space-y-4">
              <button
                onClick={() => handleSocialSignup('google')}
                className="w-full bg-white/5 hover:bg-white/10 text-white font-bold uppercase px-6 py-4 rounded-2xl text-[16px] transition-colors duration-200 flex items-center justify-center gap-3"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                continue with google
              </button>

              <button
                onClick={() => handleSocialSignup('apple')}
                className="w-full bg-white/5 hover:bg-white/10 text-white font-bold uppercase px-6 py-4 rounded-2xl text-[16px] transition-colors duration-200 flex items-center justify-center gap-3"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                </svg>
                continue with apple
              </button>

              <button
                onClick={() => handleSocialSignup('facebook')}
                className="w-full bg-white/5 hover:bg-white/10 text-white font-bold uppercase px-6 py-4 rounded-2xl text-[16px] transition-colors duration-200 flex items-center justify-center gap-3"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="#1877F2"/>
                </svg>
                continue with facebook
              </button>
            </div>

            {/* Privacy notice */}
            <p className="text-[14px] font-bold text-white/40 text-center mt-8">
              we'll only send you helpful tips. no spam, ever.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
