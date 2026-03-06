import React, { useState } from 'react';
import { User, Lock, ArrowRight, ShieldCheck, Trophy, Mail, Phone, CreditCard, Calendar, ArrowLeft, AlertCircle, Key, CheckCircle2 } from 'lucide-react';

interface LoginProps {
  onLogin: (username: string, password?: string) => boolean;
  onRegister: (userData: any) => void;
  t: (key: any) => string;
}

const Login: React.FC<LoginProps> = ({ onLogin, onRegister, t }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [isForgotPass, setIsForgotPass] = useState(false);
  const [forgotEmailSent, setForgotEmailSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [forgotEmail, setForgotEmail] = useState('');

  const [regData, setRegData] = useState({
    fullName: '',
    dni: '',
    phone: '',
    email: '',
    birthDate: '',
    password: '',
    confirmPassword: ''
  });

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError(null);

    setTimeout(() => {
      const success = onLogin(loginUser, loginPass);
      if (!success) {
        setLoginError('Usuario o contraseña incorrectos. Si no tienes cuenta, por favor regístrate.');
        setIsLoading(false);
      }
    }, 1000);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (regData.password !== regData.confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      onRegister(regData);
      alert("¡Cuenta creada con éxito! Ahora ya puedes entrar con tu email y contraseña.");
      setIsRegistering(false);
      setIsLoading(false);
      setLoginUser(regData.email);
      setLoginPass(regData.password);
    }, 1500);
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setForgotEmailSent(true);
      setIsLoading(false);
    }, 1500);
  };

  const seasonInfo = (
    <div className="flex justify-center gap-6 md:gap-8 opacity-40 lg:opacity-60 py-4 lg:py-0">
      <div className="flex flex-col items-center gap-1">
        <span className="text-xl md:text-2xl font-black">2026</span>
        <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest">Season</span>
      </div>
      <div className="w-px h-8 md:h-10 bg-current opacity-20"></div>
      <div className="flex flex-col items-center gap-1">
        <span className="text-xl md:text-2xl font-black">Pro</span>
        <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest">Training</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row overflow-x-hidden font-inter">
      {/* Lado del Branding: Más compacto en móvil */}
      <div className="lg:w-1/2 gold-gradient relative flex items-center justify-center py-12 px-6 md:p-12 lg:p-16 overflow-hidden order-first shrink-0">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-pulse delay-700"></div>
          <div className="grid grid-cols-10 gap-1 w-full h-full opacity-20">
            {Array.from({ length: 100 }).map((_, i) => (
              <div key={i} className="aspect-square border border-white/20"></div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-center text-white max-w-md animate-in fade-in zoom-in duration-1000">
          <div className="mb-4 lg:mb-8 flex justify-center">
            <div className="w-14 h-14 md:w-24 md:h-24 bg-white/20 backdrop-blur-md rounded-2xl md:rounded-3xl flex items-center justify-center shadow-2xl border border-white/30 transform rotate-12">
              <Trophy className="w-6 h-6 md:w-12 md:h-12 text-white" />
            </div>
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tighter uppercase mb-2 md:mb-6 leading-none">
            Prem Academy
          </h1>
          <p className="text-white/80 text-sm md:text-lg font-medium tracking-tight italic px-4">
            Rendiment, tècnica i mentalitat professional per al futur del futbol.
          </p>
        </div>
      </div>

      {/* Lado del Formulario: Ajustado para que quepan los botones */}
      <div className="lg:w-1/2 flex flex-col items-center justify-center p-6 md:p-10 lg:p-16 bg-white relative">
        <div className="flex-1 w-full flex flex-col items-center justify-center max-w-sm mx-auto">
          {isForgotPass ? (
            <div className="w-full animate-in slide-in-from-right-12 duration-700">
              <button 
                onClick={() => { setIsForgotPass(false); setForgotEmailSent(false); }}
                className="flex items-center gap-2 text-gray-400 hover:text-prem-gold font-black text-[10px] uppercase tracking-widest mb-6 transition-colors"
              >
                <ArrowLeft size={16} /> {t('reg_back')}
              </button>
              
              {forgotEmailSent ? (
                <div className="text-center py-6 animate-in zoom-in duration-500">
                  <div className="w-16 h-16 gold-gradient rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-prem-gold/20">
                    <CheckCircle2 className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-black text-gray-900 uppercase tracking-tighter mb-4">Correu Enviat</h3>
                  <p className="text-gray-400 font-medium mb-8 leading-relaxed text-sm">
                    Rebràs un enllaç per restablir la teva clau en uns minuts a <span className="text-gray-900 font-bold">{forgotEmail}</span>.
                  </p>
                  <button 
                    onClick={() => { setIsForgotPass(false); setForgotEmailSent(false); }}
                    className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl transition-all hover:bg-black"
                  >
                    Tornar a l'Inici
                  </button>
                </div>
              ) : (
                <>
                  <div className="mb-8">
                    <div className="w-12 h-12 bg-gray-50 text-prem-gold rounded-2xl flex items-center justify-center mb-4 border border-gray-100">
                      <Key size={20} />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tighter uppercase mb-2">Oblidat la clau?</h2>
                    <p className="text-gray-400 font-medium text-sm">T'enviarem instruccions al teu correu.</p>
                  </div>

                  <form onSubmit={handleForgotSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">Correu Electrònic</label>
                      <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-prem-gold transition-colors">
                          <Mail size={18} />
                        </div>
                        <input 
                          type="email" 
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                          placeholder="correu@exemple.com"
                          className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-prem-gold/10 focus:border-prem-gold transition-all"
                          required
                        />
                      </div>
                    </div>

                    <button 
                      type="submit" 
                      disabled={isLoading}
                      className="w-full gold-gradient text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-prem-gold/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                    >
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      ) : (
                        <>
                          Enviar Instruccions
                          <ArrowRight size={18} />
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          ) : !isRegistering ? (
            <div className="w-full animate-in slide-in-from-right-12 duration-700">
              <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tighter uppercase mb-1">{t('login_title')}</h2>
                <p className="text-gray-400 font-medium text-sm">{t('login_subtitle')}</p>
              </div>

              {loginError && (
                <div className="mb-4 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 animate-in fade-in slide-in-from-top-2 duration-300">
                  <AlertCircle size={18} className="shrink-0" />
                  <p className="text-[10px] font-bold uppercase tracking-tight leading-tight">{loginError}</p>
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">{t('login_user')}</label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-prem-gold transition-colors">
                      <User size={18} />
                    </div>
                    <input 
                      type="text" 
                      value={loginUser}
                      onChange={(e) => setLoginUser(e.target.value)}
                      placeholder="Email o usuari..."
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-prem-gold/10 focus:border-prem-gold transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{t('login_pass')}</label>
                    <button 
                      type="button" 
                      onClick={() => setIsForgotPass(true)}
                      className="text-[10px] font-black uppercase text-prem-gold hover:text-prem-gold-dark tracking-widest"
                    >
                      {t('login_forgot')}
                    </button>
                  </div>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-prem-gold transition-colors">
                      <Lock size={18} />
                    </div>
                    <input 
                      type="password" 
                      value={loginPass}
                      onChange={(e) => setLoginPass(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-prem-gold/10 focus:border-prem-gold transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 py-1">
                  <input type="checkbox" id="remember" className="w-4 h-4 rounded border-gray-300 text-prem-gold focus:ring-prem-gold" />
                  <label htmlFor="remember" className="text-[10px] font-bold text-gray-400 uppercase tracking-tight cursor-pointer">{t('login_remember')}</label>
                </div>

                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full gold-gradient text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-prem-gold/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      {t('login_btn')}
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8 pt-6 border-t border-gray-50 text-center">
                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-tight mb-2">
                  {t('login_no_acc')}
                </p>
                <button 
                  onClick={() => setIsRegistering(true)}
                  className="text-prem-gold font-black uppercase text-[10px] tracking-widest hover:underline decoration-2 underline-offset-4"
                >
                  {t('login_request')}
                </button>
              </div>
            </div>
          ) : (
            <div className="w-full animate-in slide-in-from-left-12 duration-700">
              <button 
                onClick={() => setIsRegistering(false)}
                className="flex items-center gap-2 text-gray-400 hover:text-prem-gold font-black text-[10px] uppercase tracking-widest mb-6 transition-colors"
              >
                <ArrowLeft size={16} /> {t('reg_back')}
              </button>
              
              <div className="mb-6">
                <h2 className="text-2xl font-black text-gray-900 tracking-tighter uppercase mb-1">{t('reg_title')}</h2>
                <p className="text-gray-400 font-medium text-xs">{t('reg_subtitle')}</p>
              </div>

              <form onSubmit={handleRegisterSubmit} className="space-y-3">
                <div className="grid grid-cols-1 gap-3">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase text-gray-400 tracking-widest px-1">{t('profile_name')}</label>
                    <div className="relative">
                      <User size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                      <input 
                        type="text" 
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-11 pr-4 py-2.5 text-sm font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-prem-gold/10"
                        required
                        value={regData.fullName}
                        onChange={e => setRegData({...regData, fullName: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase text-gray-400 tracking-widest px-1">{t('reg_dni')}</label>
                      <input 
                        type="text" 
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-900 focus:outline-none"
                        required
                        value={regData.dni}
                        onChange={e => setRegData({...regData, dni: e.target.value})}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase text-gray-400 tracking-widest px-1">{t('reg_phone')}</label>
                      <input 
                        type="tel" 
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-900 focus:outline-none"
                        required
                        value={regData.phone}
                        onChange={e => setRegData({...regData, phone: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase text-gray-400 tracking-widest px-1">Email</label>
                    <input 
                      type="email" 
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-900 focus:outline-none"
                      required
                      value={regData.email}
                      onChange={e => setRegData({...regData, email: e.target.value})}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase text-gray-400 tracking-widest px-1">Clau</label>
                      <input 
                        type="password" 
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-900 focus:outline-none"
                        required
                        value={regData.password}
                        onChange={e => setRegData({...regData, password: e.target.value})}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase text-gray-400 tracking-widest px-1">Repetir</label>
                      <input 
                        type="password" 
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-900 focus:outline-none"
                        required
                        value={regData.confirmPassword}
                        onChange={e => setRegData({...regData, confirmPassword: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex items-start gap-3">
                  <input type="checkbox" id="terms" className="mt-1 w-4 h-4 rounded border-gray-300 text-prem-gold focus:ring-prem-gold" required />
                  <label htmlFor="terms" className="text-[9px] font-bold text-gray-400 uppercase leading-tight cursor-pointer">
                    Accepto els termes de servei de PREM Academy.
                  </label>
                </div>

                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full gold-gradient text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-prem-gold/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 mt-4"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      {t('reg_btn')}
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Footer Area: Más compacto */}
        <div className="w-full mt-8 lg:mt-auto text-gray-300 flex flex-col items-center gap-3">
           {seasonInfo}
           <div className="flex items-center gap-2 pb-6">
             <ShieldCheck size={14} />
             <span className="text-[9px] font-black uppercase tracking-widest">Secure Cloud Encryption</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Login;