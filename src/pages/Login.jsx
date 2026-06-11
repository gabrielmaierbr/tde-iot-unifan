import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { Lock, Mail, ArrowRight, ShieldCheck, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    
    if (!email || !password) {
      return toast.error('Preencha todos os campos!');
    }

    try {
      setLoading(true);
      if (isLogin) {
        await login(email, password);
        toast.success('Acesso autorizado!');
      } else {
        await signup(email, password);
        toast.success('Conta criada com sucesso!');
      }
      navigate('/');
    } catch (error) {
      console.error(error);
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        toast.error('Credenciais inválidas. Tente novamente.');
      } else if (error.code === 'auth/email-already-in-use') {
        toast.error('Este e-mail já está em uso.');
      } else if (error.code === 'auth/weak-password') {
        toast.error('A senha deve ter pelo menos 6 caracteres.');
      } else {
        toast.error('Falha na autenticação: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0B0F13] flex items-center justify-center font-sans relative overflow-hidden">
      {/* Background Decorators */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
      <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-[#00E676] rounded-full blur-[150px] opacity-10 pointer-events-none" />
      <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] bg-[#00B0FF] rounded-full blur-[150px] opacity-10 pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-8 bg-[#111820]/80 backdrop-blur-xl border border-[#1A242E] rounded-xl shadow-2xl relative z-10 mx-4"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-[#00E676]/10 rounded-full flex items-center justify-center mb-4 border border-[#00E676]/20 shadow-[0_0_20px_rgba(0,230,118,0.15)]">
            <Cpu className="w-8 h-8 text-[#00E676]" />
          </div>
          <h1 className="text-2xl font-bold text-gray-100 tracking-wide font-mono uppercase">
            SmartBin <span className="text-[#00E676]">OS</span>
          </h1>
          <p className="text-xs text-gray-500 font-mono tracking-widest mt-2 uppercase">
            Acesso Restrito ao Sistema
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider ml-1">
              Operador (E-mail)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-4 w-4 text-gray-500" />
              </div>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-[#1A242E] rounded-md leading-5 bg-[#0B0F13] text-gray-300 placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-[#00E676] focus:border-[#00E676] transition-colors sm:text-sm"
                placeholder="operador@smartbin.com"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider ml-1">
              Chave de Acesso (Senha)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-4 w-4 text-gray-500" />
              </div>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-[#1A242E] rounded-md leading-5 bg-[#0B0F13] text-gray-300 placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-[#00E676] focus:border-[#00E676] transition-colors sm:text-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-[#00E676] hover:bg-[#00C853] text-[#0B0F13] font-bold py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00E676] focus:ring-offset-[#111820] transition-all disabled:opacity-50 disabled:cursor-not-allowed font-mono uppercase tracking-wider mt-4"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-[#0B0F13]/30 border-t-[#0B0F13] rounded-full animate-spin" />
                Processando...
              </span>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                {isLogin ? 'Autenticar' : 'Registrar Operador'}
                <ArrowRight className="w-4 h-4 ml-1" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-xs font-mono text-gray-500 hover:text-[#00B0FF] transition-colors uppercase tracking-wider"
          >
            {isLogin 
              ? 'Novo operador? Solicite registro.' 
              : 'Já possui credenciais? Acesse aqui.'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
