"use client";
 
import React, { useEffect, useState } from 'react';
import { User, Key, Trash2, ArrowLeft, Loader2, AlertCircle, Check, Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { clearTokens } from '@/lib/auth';
import axios from 'axios';
 
interface UserData {
  nombre_completo: string;
  correo: string;
}
 
interface UserProfileProps {
  onBack: () => void;
}
 
export const UserProfile = ({ onBack }: UserProfileProps) => {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
 
  // Estados para cambiar contraseña
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
 
  // ─── Estados para mostrar/ocultar contraseñas ────────────────
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
 
  // Estados para actualizar perfil
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editData, setEditData] = useState({
    nombre_completo: userData?.nombre_completo || '',
    correo: userData?.correo || ''
  });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [editSuccess, setEditSuccess] = useState(false);

  // Estados para borrar cuenta
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
 
  // Cargar perfil del usuario
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await api.get("/auth/me");
        setUserData(response.data);
        setEditData({
          nombre_completo: response.data.nombre_completo,
          correo: response.data.correo
        });
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.detail || "No se pudo cargar el perfil");
        } else {
          setError("Error inesperado");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Manejar actualización de perfil
  const handleUpdateProfile = async () => {
    setEditError(null);

    if (!editData.nombre_completo || !editData.correo) {
      setEditError("Todos los campos son requeridos");
      return;
    }

    if (!editData.correo.includes("@")) {
      setEditError("Ingresá un correo válido");
      return;
    }

    try {
      setEditLoading(true);
      const response = await api.put("/auth/me", {
        nombre_completo: editData.nombre_completo,
        correo: editData.correo
      });

      setUserData(response.data);
      setEditSuccess(true);

      setTimeout(() => {
        setShowEditProfile(false);
        setEditSuccess(false);
      }, 2000);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setEditError(err.response?.data?.detail || "No se pudo actualizar el perfil");
      } else {
        setEditError("Error al actualizar el perfil");
      }
    } finally {
      setEditLoading(false);
    }
  };
 
  // Manejar cambio de contraseña
  const handleChangePassword = async () => {
    setPasswordError(null);
 
    if (!passwordData.current_password || !passwordData.new_password || !passwordData.confirm_password) {
      setPasswordError("Todos los campos son requeridos");
      return;
    }
    if (passwordData.new_password !== passwordData.confirm_password) {
      setPasswordError("Las contraseñas nuevas no coinciden");
      return;
    }
    if (passwordData.new_password.length < 8) {
      setPasswordError("La contraseña debe tener al menos 8 caracteres");
      return;
    }
 
    try {
      setPasswordLoading(true);
      await api.put("/auth/me/password", {
        current_password: passwordData.current_password,
        new_password: passwordData.new_password,
        confirm_password: passwordData.confirm_password,
      });
 
      setPasswordSuccess(true);
      setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
 
      setTimeout(() => {
        clearTokens();
        router.push("/login")
      }, 2000);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setPasswordError(err.response?.data?.detail || "No se pudo cambiar la contraseña");
      } else {
        setPasswordError("Error al cambiar la contraseña");
      }
    } finally {
      setPasswordLoading(false);
    }
  };
 
  // ─── Manejar eliminación de cuenta ───────────────────────────
  const handleDeleteAccount = async () => {
    setDeleteError(null);
 
    try {
      setDeleteLoading(true);
      await api.delete("/auth/me");
 
      // Limpia los tokens correctamente
      clearTokens();
 
      // Redirige a la página de bienvenida
      router.push("/");
 
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setDeleteError(err.response?.data?.detail || "No se pudo eliminar la cuenta");
      } else {
        setDeleteError("Error al eliminar la cuenta");
      }
      setDeleteLoading(false);
    }
  };
 
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin mb-2" />
        <p>Cargando información...</p>
      </div>
    );
  }
 
  if (error || !userData) {
    return (
      <div className="text-center p-8 bg-red-500/10 border border-red-500/20 rounded-2xl">
        <p className="text-red-400">{error}</p>
        <button onClick={onBack} className="mt-4 text-white underline">Volver</button>
      </div>
    );
  }
 
  return (
    <div className="max-w-2xl mx-auto animate-in slide-in-from-bottom-4 duration-500">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors text-sm"
      >
        <ArrowLeft className="w-4 h-4" /> Volver al dashboard
      </button>
 
      <div className="bg-slate-800/30 border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
        <div className="h-32 bg-linear-to-r from-emerald-600/20 to-blue-600/20 border-b border-white/5 flex items-end px-8 pb-4">
          <div className="w-20 h-20 rounded-2xl bg-emerald-500 flex items-center justify-center border-4 border-[#0f172a] shadow-xl translate-y-8">
            <User className="w-10 h-10 text-slate-900" />
          </div>
        </div>
 
        <div className="pt-12 px-8 pb-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white">{userData.nombre_completo}</h2>
          </div>
 
          <div className="space-y-4 mb-10">
            <ProfileField label="Correo Electrónico" value={userData.correo} />
          </div>
 
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => setShowEditProfile(true)}
              className="flex items-center justify-center gap-2 py-3 px-4 bg-blue-500/10 hover:bg-blue-500 text-blue-400 hover:text-white rounded-xl border border-blue-500/20 text-sm font-bold transition-all"
            >
              <User className="w-4 h-4" /> Actualizar Perfil
            </button>
            <button
              onClick={() => setShowChangePassword(!showChangePassword)}
              className="flex items-center justify-center gap-2 py-3 px-4 bg-slate-800 hover:bg-slate-700 rounded-xl border border-white/5 text-sm font-bold transition-all text-white"
            >
              <Key className="w-4 h-4 text-emerald-400" /> Cambiar Contraseña
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center justify-center gap-2 py-3 px-4 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-xl border border-red-500/20 text-sm font-bold transition-all"
            >
              <Trash2 className="w-4 h-4" /> Borrar Cuenta
            </button>
          </div>
        </div>
      </div>
 
      {/* ─── Modal Cambiar Contraseña ─────────────────────────── */}
      {showChangePassword && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-white/10 rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-white mb-4">Cambiar Contraseña</h3>
 
            {passwordSuccess && (
              <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center gap-2 text-emerald-400 text-sm">
                <Check className="w-4 h-4" />
                Contraseña cambiada exitosamente
              </div>
            )}
 
            {passwordError && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-400 text-sm">
                <AlertCircle className="w-4 h-4" />
                {passwordError}
              </div>
            )}
 
            <div className="space-y-4 mb-6">
 
              {/* Contraseña actual */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Contraseña Actual
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    value={passwordData.current_password}
                    onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                    placeholder="Ingresá tu contraseña actual"
                    className="w-full bg-slate-900 border border-white/10 rounded-lg px-4 py-2 pr-10 text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                  >
                    {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
 
              {/* Nueva contraseña */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Nueva Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={passwordData.new_password}
                    onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                    placeholder="Ingresá tu nueva contraseña"
                    className="w-full bg-slate-900 border border-white/10 rounded-lg px-4 py-2 pr-10 text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
 
              {/* Confirmar contraseña */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Confirmar Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={passwordData.confirm_password}
                    onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                    placeholder="Confirmá tu nueva contraseña"
                    className="w-full bg-slate-900 border border-white/10 rounded-lg px-4 py-2 pr-10 text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
 
            </div>
 
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowChangePassword(false);
                  setPasswordError(null);
                  setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
                }}
                disabled={passwordLoading}
                className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-bold transition-all disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleChangePassword}
                disabled={passwordLoading}
                className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-900 rounded-lg font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {passwordLoading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Guardando...</>
                ) : (
                  'Guardar'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Modal Editar Perfil ───────────────────────────────── */}
      {showEditProfile && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-white/10 rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-white mb-4">Actualizar Perfil</h3>

            {editSuccess && (
              <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center gap-2 text-emerald-400 text-sm">
                <Check className="w-4 h-4" />
                Perfil actualizado exitosamente
              </div>
            )}

            {editError && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-400 text-sm">
                <AlertCircle className="w-4 h-4" />
                {editError}
              </div>
            )}

            <div className="space-y-4 mb-6">
              {/* Nombre Completo */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  value={editData.nombre_completo}
                  onChange={(e) => setEditData({ ...editData, nombre_completo: e.target.value })}
                  placeholder="Ingresá tu nombre completo"
                  className="w-full bg-slate-900 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500/50 transition-colors"
                />
              </div>

              {/* Correo */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  value={editData.correo}
                  onChange={(e) => setEditData({ ...editData, correo: e.target.value })}
                  placeholder="Ingresá tu correo"
                  className="w-full bg-slate-900 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500/50 transition-colors"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowEditProfile(false);
                  setEditError(null);
                  setEditSuccess(false);
                  if (userData) {
                    setEditData({
                      nombre_completo: userData.nombre_completo,
                      correo: userData.correo
                    });
                  }
                }}
                disabled={editLoading}
                className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-bold transition-all disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleUpdateProfile}
                disabled={editLoading}
                className="flex-1 py-2 bg-blue-500 hover:bg-blue-400 text-white rounded-lg font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {editLoading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Guardando...</>
                ) : (
                  'Guardar'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
 
      {/* ─── Modal Confirmar Borrar Cuenta ───────────────────── */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-red-500/20 rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Borrar Cuenta</h3>
            </div>
 
            <p className="text-slate-400 text-sm mb-4">
              Esta acción es permanente. Se eliminarán todos tus datos y proyectos. ¿Estás seguro?
            </p>
 
            {deleteError && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-400 text-sm">
                <AlertCircle className="w-4 h-4" />
                {deleteError}
              </div>
            )}
 
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleteLoading}
                className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-bold transition-all disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleteLoading}
                className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deleteLoading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Eliminando...</>
                ) : (
                  'Sí, Borrar'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
 
function ProfileField({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="p-4 bg-slate-900/50 border border-white/5 rounded-2xl">
      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">{label}</p>
      <p className="text-white font-medium">{value}</p>
    </div>
  );
}