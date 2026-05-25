# 📁 Estructura del Proyecto - PyGuardian Frontend

## 📋 Resumen General

Este es un proyecto **Next.js 16** (React 19) estructurado como una aplicación web moderna para gestionar y analizar vulnerabilidades en proyectos. La arquitectura sigue patrones de separación de responsabilidades con servicios centralizados y componentes React reutilizables.

---

## 🏗️ Estructura de Carpetas

```
frontend/
├── app/                          # Directorio de rutas de Next.js (App Router)
│   ├── page.tsx                 # Página de inicio
│   ├── layout.tsx               # Layout global
│   ├── globals.css              # Estilos globales
│   ├── dashboard/
│   │   └── page.tsx             # Página del dashboard
│   ├── login/
│   │   └── page.tsx             # Página de login
│   └── register/
│       └── page.tsx             # Página de registro
│
├── components/                  # Componentes React reutilizables
│   ├── auth/                    # Componentes de autenticación
│   │   ├── LoginForm.tsx        # Formulario de login
│   │   ├── RegisterForm.tsx     # Formulario de registro
│   │   └── UserProfile.tsx      # Perfil del usuario
│   ├── dashboard/
│   │   └── Navbar.tsx           # Barra de navegación
│   ├── project/                 # Componentes de proyectos
│   │   ├── ProjectCard.tsx      # Tarjeta de proyecto
│   │   ├── ProjectForm.tsx      # Formulario de proyecto
│   │   └── ProjectList.tsx      # Lista de proyectos
│   └── ui/                      # Componentes UI reutilizables (shadcn/ui)
│       ├── avatar.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       └── tabs.tsx
│
├── lib/                         # 🔧 SERVICIOS Y UTILIDADES CENTRALIZADAS
│   ├── api.ts                   # Configuración de axios e interceptores
│   ├── auth.ts                  # Funciones de autenticación
│   └── utils.ts                 # Utilidades generales
│
├── public/                      # Archivos estáticos
│
├── package.json                 # Dependencias del proyecto
├── next.config.ts               # Configuración de Next.js
├── tsconfig.json                # Configuración de TypeScript
├── tailwind.config.ts           # Configuración de Tailwind CSS
└── eslint.config.mjs            # Configuración de ESLint
```

---

## 🔧 Servicios y Utilidades (Carpeta `lib/`)

### **1. `lib/api.ts` - Cliente HTTP Centralizado**

```typescript
// Características:
// ✅ Instancia única de axios
// ✅ Interceptores para agregar token JWT
// ✅ Manejo automático de refresh token
// ✅ Reintentos automáticos en error 401
// ✅ Redirección a login si falla refresh
```

**¿Cómo se usa?**

Los componentes importan `api` directamente:

```typescript
import api from '@/lib/api';

// Usar en componentes
const response = await api.get('/proyectos');
const newProject = await api.post('/proyectos', {...});
```

---

### **2. `lib/auth.ts` - Gestión de Tokens**

Proporciona funciones utilitarias para JWT:

```typescript
// Funciones disponibles:
- saveTokens(accessToken, refreshToken)    // Guardar tokens
- getAccessToken()                         // Obtener token de acceso
- getRefreshToken()                        // Obtener token refresh
- clearTokens()                            // Limpiar tokens
- isAuthenticated()                        // Verificar si está autenticado
- decodeToken(token)                       // Decodificar JWT (sin verificar)
- isTokenExpired(token)                    // Verificar si expiró
```

---

### **3. `lib/utils.ts`**

Contiene utilidades generales del proyecto (validaciones, formatos, etc.)

---

## 📱 Cómo se Implementan los Servicios

### **Patrón Actual: Servicios en Componentes**

Los servicios se usan **directamente dentro de los componentes** (páginas y formularios).

#### Ejemplo 1: LoginForm.tsx

```typescript
"use client";

import { useState } from "react";
import api from "@/lib/api";
import { saveTokens } from "@/lib/auth";

export default function LoginForm() {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // 🔴 Llamada al API directamente en el componente
      const response = await api.post("/auth/login", {
        correo,
        password,
      });
      
      // Guardar tokens usando función de auth.ts
      saveTokens(response.data.access_token, response.data.refresh_token);
      router.push("/dashboard");
    } catch (error) {
      setError("Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    // JSX del formulario...
  );
}
```

#### Ejemplo 2: ProjectForm.tsx

```typescript
"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";

export const ProjectForm = ({ projectId }: ProjectFormProps) => {
  const [nombre, setNombre] = useState("");
  const [loading, setLoading] = useState(false);

  // Hook que carga datos del proyecto
  useEffect(() => {
    if (projectId) {
      const fetchProyecto = async () => {
        try {
          // 🔴 Llamada al API directamente en useEffect
          const response = await api.get(`/proyectos/${projectId}`);
          setNombre(response.data.nombre);
        } catch (err) {
          console.error("Error:", err);
        }
      };
      
      fetchProyecto();
    }
  }, [projectId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // 🔴 Más llamadas al API en el componente
      const response = await api.post("/proyectos", {
        nombre,
        // ...otros datos
      });
    } catch (error) {
      // Manejo de error
    } finally {
      setLoading(false);
    }
  };

  return (
    // JSX del formulario...
  );
};
```

---

## 📊 Flujo de Datos

```
┌─────────────────────────────────────────────────────────┐
│           Página (app/login/page.tsx)                   │
│                                                         │
│  - Renderiza componentes                               │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│        Componente (LoginForm.tsx)                       │
│                                                         │
│  - Estados (useState)                                  │
│  - Efectos (useEffect)                                 │
│  - Lógica de formulario                                │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│     Servicios (lib/)                                    │
│                                                         │
│  ├─ api.ts ──────► axios + interceptores              │
│  └─ auth.ts ─────► manejo de tokens                   │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│        Backend API (http://localhost:8000)              │
│                                                         │
│  - /auth/login                                         │
│  - /proyectos                                          │
│  - etc...                                              │
└─────────────────────────────────────────────────────────┘
```

---

## ⚙️ Tecnologías Utilizadas

| Tecnología | Versión | Uso |
|-----------|---------|-----|
| **Next.js** | 16.2.4 | Framework React con SSR |
| **React** | 19.2.4 | Librería UI |
| **TypeScript** | ^5 | Tipado estático |
| **Axios** | ^1.16.0 | Cliente HTTP |
| **Tailwind CSS** | ^4 | Estilos CSS |
| **shadcn/ui** | Componentes UI | Componentes reutilizables |
| **Radix UI** | ^1.4.3 | Base para componentes accesibles |

---

## 🔐 Autenticación y Autorización

### **Flujo de Autenticación**

```
1. Usuario inicia sesión (LoginForm.tsx)
   ↓
2. api.post("/auth/login") → Backend
   ↓
3. Backend retorna { access_token, refresh_token }
   ↓
4. saveTokens() → Guarda tokens
   - access_token en cookie (15 minutos)
   - refresh_token en localStorage
   ↓
5. Redirigir a /dashboard
```

### **Interceptores de Axios**

**Request Interceptor:**
- Añade automáticamente el `Authorization: Bearer {token}` a cada petición

**Response Interceptor:**
- Si status 401 (token expirado):
  1. Intenta refrescar el token
  2. Reinicia la petición original
  3. Si falla, limpia tokens y redirige a login

---

## 📌 Puntos Importantes

### ✅ Ventajas de la Estructura Actual

- ✅ **Centralización**: Servicios en una carpeta específica (`lib/`)
- ✅ **Reutilización**: `api.ts` se usa en todos los componentes
- ✅ **Interceptores**: Manejo automático de tokens y errores 401
- ✅ **Type-safe**: Completo soporte de TypeScript

### ⚠️ Consideraciones

- 🔴 **Lógica en componentes**: Las llamadas API están directamente en los componentes
  - *Alternativa*: Crear hooks personalizados (`useLogin()`, `useProyectos()`)
  - *Alternativa avanzada*: React Query o SWR para manejo de datos

- 🔴 **Gestión de estado global**: No hay context/Redux para estado compartido
  - *Alternativa*: Usar React Context para compartir usuario autenticado

---

## 🚀 Recomendaciones para Escalar

Si el proyecto crece, considera:

### 1. **Hooks Personalizados** (Recomendado)

```typescript
// lib/hooks/useAuth.ts
export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = async (correo, password) => {
    setLoading(true);
    const response = await api.post("/auth/login", { correo, password });
    saveTokens(response.data.access_token, response.data.refresh_token);
    return response.data;
  };

  return { user, loading, login };
}
```

### 2. **React Query** (Para datos complejos)

```typescript
// Para manejo de caché, sincronización automática, etc.
import { useQuery } from "@tanstack/react-query";

const { data: proyectos } = useQuery({
  queryKey: ["proyectos"],
  queryFn: () => api.get("/proyectos"),
});
```

### 3. **React Context** (Para estado global)

```typescript
// Para compartir usuario autenticado entre componentes
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // ...
  return <AuthContext.Provider value={...}>{children}</AuthContext.Provider>;
}
```

---

## 📝 Resumen

| Aspecto | Implementación |
|--------|----------------|
| **¿Dónde están los servicios?** | En la carpeta `lib/` (api.ts, auth.ts) |
| **¿Cómo se usan?** | Importándolos en componentes y páginas |
| **¿Están centralizados?** | ✅ Sí, en `lib/` |
| **¿Hay interceptores?** | ✅ Sí, en `api.ts` (token + refresh automático) |
| **¿Se usan hooks?** | Parcialmente (useEffect + useState en componentes) |
| **¿Hay estado global?** | ❌ No (cada componente maneja su estado) |

---

## 🔗 Referencias de Archivos Clave

- **API Configuration**: [lib/api.ts](lib/api.ts)
- **Auth Functions**: [lib/auth.ts](lib/auth.ts)
- **Login Component**: [components/auth/LoginForm.tsx](components/auth/LoginForm.tsx)
- **Project Form**: [components/project/ProjectForm.tsx](components/project/ProjectForm.tsx)
