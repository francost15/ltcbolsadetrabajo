# Configuración de Mercado Pago - Sistema de Suscripciones

## Variables de Entorno Necesarias

Agrega estas variables a tu archivo `.env.local`:

```bash
# Mercado Pago - PRODUCCIÓN
# Credenciales de producción obtenidas de https://www.mercadopago.com.ar/developers/
MERCADO_PAGO_ACCESS_TOKEN="APP_USR-5564120413015489-071420-1b2ce7f60194e3362bd7e70b0d815040-180048755"
NEXT_PUBLIC_MP_PUBLIC_KEY="APP_USR-ea8fc03d-b256-479d-8466-780d0a09c9df"

# Claves de prueba (sandbox) - Comentadas para producción
# MERCADO_PAGO_ACCESS_TOKEN="TEST-your-access-token-here"
# NEXT_PUBLIC_MP_PUBLIC_KEY="TEST-your-public-key-here"
```

## Credenciales de Producción Configuradas

✅ **Public Key:** `APP_USR-ea8fc03d-b256-479d-8466-780d0a09c9df`  
✅ **Access Token:** `APP_USR-5564120413015489-071420-1b2ce7f60194e3362bd7e70b0d815040-180048755`  
✅ **Client ID:** `5564120413015489`  
✅ **Client Secret:** `FtiIImddO6yj7GrpaE5via6nNq188D1R`

## Manejo de Errores Mejorado

El sistema ahora incluye manejo robusto de errores para casos específicos:

### 🔴 Errores de Fondos Insuficientes
- **Código:** `cc_rejected_insufficient_amount`
- **Mensaje:** "Tu tarjeta no tiene fondos suficientes."
- **Acción:** Usuario puede intentar con otra tarjeta

### 🔴 Errores de Datos de Tarjeta
- **Códigos:** `cc_rejected_bad_filled_date`, `cc_rejected_bad_filled_security_code`
- **Mensajes:** Errores específicos sobre fecha o código de seguridad
- **Acción:** Usuario puede corregir los datos

### 🔴 Errores de Autorización
- **Código:** `cc_rejected_call_for_authorize`
- **Mensaje:** "Debes autorizar el pago con tu banco."
- **Acción:** Usuario debe contactar su banco

### 🔴 Errores de Tarjeta Deshabilitada
- **Código:** `cc_rejected_card_disabled`
- **Mensaje:** "Llama a tu banco para activar tu tarjeta."
- **Acción:** Usuario debe contactar su banco

### 🔴 Errores de Red y Timeout
- **Códigos:** `timeout`, `network_error`
- **Mensajes:** Errores de conexión con sugerencias de reintento
- **Acción:** Usuario puede intentar nuevamente

### 🔴 Errores de Duplicación
- **Código:** `cc_rejected_duplicated_payment`
- **Mensaje:** "Ya realizaste un pago por ese monto."
- **Acción:** Sistema previene pagos duplicados

## Cómo Obtener las Credenciales

1. **Crear cuenta en Mercado Pago Developers:**
   - Ve a: https://www.mercadopago.com.ar/developers/
   - Crea una cuenta o inicia sesión

2. **Crear aplicación:**
   - En el panel de desarrolladores, crea una nueva aplicación
   - Selecciona "Checkout API" como tipo de integración

3. **Obtener credenciales:**
   - En tu aplicación, ve a "Credenciales"
   - Copia el `Access Token` y `Public Key` de producción
   - Para pruebas, usa las credenciales de sandbox

## Tarjetas de Prueba (Solo para Sandbox)

Para probar la integración en modo sandbox, usa estas tarjetas:

### Visa (Aprobada)
- **Número:** 4509 9535 6623 3704
- **Código de seguridad:** 123
- **Fecha de vencimiento:** 11/25

### Mastercard (Aprobada)
- **Número:** 5031 7557 3453 0604
- **Código de seguridad:** 123
- **Fecha de vencimiento:** 11/25

### American Express (Aprobada)
- **Número:** 3711 803032 57522
- **Código de seguridad:** 1234
- **Fecha de vencimiento:** 11/25

### Tarjeta Rechazada
- **Número:** 4013 5406 8274 6260
- **Código de seguridad:** 123
- **Fecha de vencimiento:** 11/25

## Estructura del Sistema

### 1. Base de Datos
- ✅ **Tablas configuradas:**
  - `planes` - Definición de planes de suscripción
  - `suscripciones` - Suscripciones de usuarios
  - `pagos` - Registro de pagos

### 2. Server Actions Mejoradas
- ✅ **Funciones creadas:**
  - `createAnnualSubscription()` - Procesa pagos con manejo robusto de errores
  - `checkActiveSubscription()` - Verifica suscripciones activas
  - `getUserSubscriptionStatus()` - Obtiene estado de suscripción del usuario

### 3. Middleware
- ✅ **Protección de rutas:**
  - Rutas protegidas: `/home/candidate`, `/home/company`, `/home/vancancy`
  - Redirige a `/subscription/checkout` si no hay suscripción activa

### 4. Componentes
- ✅ **Formulario de pago:** `SubscriptionForm.tsx` (Diseño minimalista estilo Tesla)
- ✅ **Página de checkout:** `/subscription/checkout` (Interfaz limpia y profesional)
- ✅ **Estado de suscripción:** `SubscriptionStatus.tsx` (Monitoreo elegante)
- ✅ **Página de éxito:** `/subscription/success` (Confirmación minimalista)
- ✅ **Beneficios:** `SubscriptionBenefits.tsx` (Presentación elegante)

## Diseño Minimalista

### Estilo Tesla Compacto
- **Colores:** Blanco, negro, grises neutros
- **Tipografía:** `font-light` para texto elegante
- **Espaciado:** Optimizado para dispositivos móviles
- **Elementos:** Líneas limpias, bordes sutiles
- **Interacciones:** Transiciones suaves y elegantes
- **Tamaño:** Diseño más compacto y eficiente

### Componentes clave
- **Formulario:** Campos con borde inferior, sin cajas
- **Botones:** Fondo negro, texto blanco, esquinas rectas
- **Indicadores:** Puntos minimalistas y barras de progreso
- **Notificaciones:** Toast centrados y elegantes
- **Responsividad:** Optimizado para móviles y tablets
- **Loading:** Skeleton animations suaves en gris

### Mejoras móviles
- **Textos:** Tamaños adaptativos (`text-sm md:text-base`)
- **Espaciado:** Compacto en móvil, generoso en desktop
- **Botones:** Altura optimizada para touch
- **Navegación:** Stack vertical en móvil, horizontal en desktop
- **Skeleton:** Loading animations profesionales

## Flujo de Pago Mejorado

1. **Usuario accede a ruta protegida** sin suscripción
2. **Middleware redirige** a `/subscription/checkout`
3. **Usuario completa formulario** con datos de tarjeta (diseño minimalista)
4. **Se crea token** de Mercado Pago
5. **Server action procesa** el pago con validaciones robustas
6. **Sistema maneja errores** específicos con mensajes amigables
7. **Se crea suscripción** en base de datos si el pago es exitoso
8. **Usuario redirigido** a `/subscription/success` (página de confirmación elegante)

## Configuración del Plan

El plan anual se crea automáticamente ejecutando:

```bash
node scripts/init-subscription-plan.js
```

**Características del plan:**
- **Precio:** $365 por año
- **Duración:** 365 días
- **Características:** Acceso completo, matching avanzado, soporte prioritario

## Pruebas en Producción

Para probar el sistema en producción:

1. **Configura las variables de entorno** con las credenciales de producción
2. **Ejecuta la aplicación:** `npm run dev`
3. **Accede a una ruta protegida** sin suscripción
4. **Completa el formulario** con una tarjeta real
5. **Verifica que se crea** la suscripción en la base de datos
6. **Prueba diferentes escenarios** de error (fondos insuficientes, tarjeta inválida, etc.)

## Seguridad

- ✅ **Tokens de pago:** Se generan del lado del cliente y se envían al servidor
- ✅ **Datos sensibles:** No se almacenan datos de tarjetas en nuestra base de datos
- ✅ **Encriptación:** Todas las comunicaciones usan HTTPS
- ✅ **Validación:** Se valida la suscripción en cada request
- ✅ **Prevención de duplicados:** Sistema evita pagos duplicados
- ✅ **Manejo de errores:** Mensajes específicos sin exponer información sensible

## Soporte

Si necesitas ayuda:
- 📧 **Email:** soporte@tuaplicacion.com
- 💬 **Chat:** Disponible en la aplicación
- 📚 **Documentación:** https://www.mercadopago.com.ar/developers/es/docs
- 🔧 **Logs:** Revisa la consola del servidor para errores detallados 