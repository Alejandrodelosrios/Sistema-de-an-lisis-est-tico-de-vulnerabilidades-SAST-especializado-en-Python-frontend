# Componente ProjectForm

## Descripción General
`ProjectForm` es un componente React que permite crear o editar proyectos Python. Soporta dos métodos de carga: desde un repositorio de GitHub o mediante carga directa de archivos Python.

---

## Props (Propiedades)

| Propiedad | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `onCancel` | `() => void` | No | Callback ejecutado al cancelar el formulario |
| `onSuccess` | `(nuevoProyecto?: any) => void` | No | Callback ejecutado cuando el proyecto se crea/actualiza exitosamente |
| `projectId` | `number \| null` | No | ID del proyecto a editar. Si se proporciona, activa el modo edición |
| `initialData` | `object` | No | Datos iniciales del proyecto (nombre, origen, url_github) |

---

## Estado (States)

| Estado | Tipo | Valor Inicial | Propósito |
|--------|------|---------------|-----------|
| `origen` | `'github' \| 'carga_directa'` | `initialData?.origen \|\| 'github'` | Define si el proyecto viene de GitHub o de carga directa |
| `nombre` | `string` | `initialData?.nombre \|\| ''` | Nombre del proyecto |
| `urlGithub` | `string` | `initialData?.url_github \|\| ''` | URL del repositorio de GitHub |
| `archivos` | `File[]` | `[]` | Array de archivos Python seleccionados |
| `loading` | `boolean` | `false` | Indica si se está procesando el envío |
| `error` | `string \| null` | `null` | Mensaje de error (si existe) |

---

## Funcionalidades Principales

### 1. **Detección de Modo (Crear vs Editar)**
```typescript
const isEditing = !!projectId;
```
- Si `projectId` está presente, el componente entra en modo edición
- El título y el botón se actualizan según el modo

### 2. **Carga de Datos en Modo Edición**
```typescript
useEffect(() => {
  if (isEditing && projectId) {
    const fetchProyecto = async () => {
      // Obtiene los datos del proyecto desde la API
      const response = await api.get(`/proyectos/${projectId}/`);
      // Poblando los estados con los datos obtenidos
    };
    fetchProyecto();
  }
}, [isEditing, projectId]);
```
- Cuando se carga el componente en modo edición, obtiene los datos del proyecto
- Los datos se cargan desde la API (`/proyectos/{projectId}/`)
- Si hay error, muestra un mensaje en la interfaz

### 3. **Manejo de Carga de Archivos**
```typescript
const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const selectedFiles = Array.from(e.target.files || []);
  
  // Validar que sean archivos .py
  const pythonFiles = selectedFiles.filter(file => file.name.endsWith('.py'));
  
  if (pythonFiles.length !== selectedFiles.length) {
    setError('Solo se permiten archivos .py');
    return;
  }
  
  setArchivos(pythonFiles);
  setError(null);
};
```
- **Validación**: Solo acepta archivos `.py`
- **Filtrado**: Si se incluyen archivos que no son `.py`, muestra un error
- **Almacenamiento**: Guarda los archivos válidos en el estado

### 4. **Eliminación Individual de Archivos**
```typescript
const removeArchivo = (index: number) => {
  setArchivos(archivos.filter((_, i) => i !== index));
};
```
- Permite eliminar archivos seleccionados uno a uno
- Útil para corregir errores antes de enviar el formulario

### 5. **Validación del Formulario**
Antes de enviar, el componente valida:
- ✅ **Nombre requerido**: El nombre del proyecto no puede estar vacío
- ✅ **URL de GitHub**: Si el origen es GitHub, la URL es obligatoria
- ✅ **Archivos requeridos**: Si es carga directa y es nuevo proyecto, debe haber al menos un archivo `.py`

### 6. **Envío del Formulario**
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  // Validación...
  
  const payload = {
    nombre: nombre.trim(),
    origen: origen,
  };
  
  // Solo agregar url_github si es github
  if (origen === 'github') {
    payload.url_github = urlGithub.trim();
  }
  
  // Crear o actualizar
  if (isEditing) {
    respuesta = await api.put(`/proyectos/${projectId}/`, payload);
  } else {
    respuesta = await api.post('/proyectos/', payload);
  }
  
  if (onSuccess) onSuccess(respuesta.data);
  if (onCancel) onCancel();
};
```

**Comportamiento:**
- **Modo Crear**: `POST` a `/proyectos/` 
- **Modo Editar**: `PUT` a `/proyectos/{projectId}/`
- **Éxito**: Ejecuta `onSuccess` y `onCancel` si están definidas
- **Error**: Muestra el mensaje de error en la interfaz

---

## Interfaz de Usuario

### Estructura Visual

```
┌─────────────────────────────────────────┐
│         Cancelar (si aplica)            │
├─────────────────────────────────────────┤
│     [Nuevo Proyecto / Editar Proyecto]  │
│        Descripción según el modo        │
├─────────────────────────────────────────┤
│  ⚠️  Mensaje de Error (si existe)       │
├─────────────────────────────────────────┤
│                                         │
│  Nombre del Proyecto                    │
│  [Input texto]                          │
│                                         │
│  Origen del Proyecto                    │
│  [Select: GitHub / Carga Directa]       │
│                                         │
│  [Campos dinámicos según origen]        │
│                                         │
│  [Botón Crear/Actualizar Proyecto]      │
└─────────────────────────────────────────┘
```

### Campos Dinámicos

#### **Si Origen = "Carga Directa"**
- 📁 **Área de carga de archivos**: Drag & drop o clic para seleccionar
- 📝 **Lista de archivos**: Muestra archivos seleccionados con tamaño y opción de eliminar
- ⚠️ **Nota informativa**: Explica que se validarán los archivos

#### **Si Origen = "GitHub"**
- 🔗 **URL del Repositorio**: Input para la URL del repositorio
- ℹ️ **Información**: Explica que el repositorio será clonado

### Estilos y Estados del Botón
- **Estado normal**: Verde (emerald), texto oscuro
- **Estado hover**: Verde más claro
- **Estado disabled (cargando)**: Verde opacado, muestra spinner
- **Texto**: Cambia según el modo ("Crear Proyecto" o "Actualizar Proyecto")

---

## Flujo de Uso

### Crear Nuevo Proyecto (GitHub)
1. Usuario abre el formulario sin `projectId`
2. Selecciona "GitHub" como origen
3. Ingresa el nombre del proyecto
4. Ingresa la URL del repositorio
5. Hace clic en "Crear Proyecto"
6. Se envía `POST` con nombre, origen y url_github
7. Se ejecuta callback `onSuccess` con los datos retornados

### Crear Nuevo Proyecto (Carga Directa)
1. Usuario abre el formulario sin `projectId`
2. Selecciona "Carga Directa" como origen
3. Ingresa el nombre del proyecto
4. Carga archivos `.py`
5. Puede eliminar archivos si lo desea
6. Hace clic en "Crear Proyecto"
7. Se envía `POST` con nombre y origen
8. Se ejecuta callback `onSuccess`

### Editar Proyecto
1. Usuario abre el formulario con `projectId`
2. El `useEffect` carga automáticamente los datos
3. Usuario modifica los datos deseados
4. Hace clic en "Actualizar Proyecto"
5. Se envía `PUT` a `/proyectos/{projectId}/`
6. Se ejecuta callback `onSuccess` con los datos actualizados

---

## Dependencias Externas

### Librerías
- **React**: Hooks (useState, useEffect)
- **lucide-react**: Iconos (Link, Shield, ArrowLeft, Loader, Upload, X)

### Módulos Locales
- **`@/lib/api`**: Cliente API para hacer requests (GET, POST, PUT)

---

## Validaciones

| Validación | Condición | Mensaje de Error |
|------------|-----------|------------------|
| Nombre requerido | `!nombre.trim()` | "El nombre del proyecto es requerido" |
| URL GitHub requerida | `origen === 'github' && !urlGithub.trim()` | "La URL de GitHub es requerida" |
| Archivos requeridos | `origen === 'carga_directa' && archivos.length === 0 && !isEditing` | "Debes seleccionar al menos un archivo .py" |
| Solo archivos .py | Extensión ≠ `.py` | "Solo se permiten archivos .py" |

---

## Manejo de Errores

- **Errores de validación**: Se muestran en un banner rojo en la interfaz
- **Errores de API**: Se obtienen de `err.response?.data?.message` o del mensaje general del error
- **El formulario se deshabilita** durante el envío (`loading = true`)
- **El botón muestra un spinner** mientras se procesa

---

## Notas Importantes

- ⚠️ Los archivos en carga directa **NO se envían en el formulario actual**, solo se muestra la UI para seleccionarlos
- 🔄 Los datos se sincronizan con la API automáticamente en modo edición
- 🛡️ El componente maneja su propio estado de error y loading
- 📱 Es completamente responsive (usa Tailwind CSS)
- ♿ Incluye buenas prácticas de accesibilidad con labels y estructura semántica
