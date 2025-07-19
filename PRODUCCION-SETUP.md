# 🚀 Configuración de Producción - LTC Bolsa de Trabajo

## 📋 Resumen de Configuración

Este documento contiene toda la información necesaria para desplegar el sistema LTC Bolsa de Trabajo en producción con Mercado Pago configurado.

## 🔑 Credenciales de Mercado Pago (PRODUCCIÓN)

### Credenciales Configuradas
- **Public Key:** `APP_USR-ea8fc03d-b256-479d-8466-780d0a09c9df`
- **Access Token:** `APP_USR-5564120413015489-071420-1b2ce7f60194e3362bd7e70b0d815040-180048755`
- **Client ID:** `5564120413015489`
- **Client Secret:** `FtiIImddO6yj7GrpaE5via6nNq188D1R`

### Variables de Entorno Requeridas

Crea un archivo `.env.local` en la raíz del proyecto con:

```bash
# Mercado Pago - PRODUCCIÓN
MERCADO_PAGO_ACCESS_TOKEN="APP_USR-5564120413015489-071420-1b2ce7f60194e3362bd7e70b0d815040-180048755"
NEXT_PUBLIC_MP_PUBLIC_KEY="APP_USR-ea8fc03d-b256-479d-8466-780d0a09c9df"

# NextAuth
NEXTAUTH_SECRET="tu-secret-super-seguro-aqui"
NEXTAUTH_URL="https://tu-dominio.com"

# Base de datos PostgreSQL
DATABASE_URL="postgresql://usuario:password@host:5432/ltc_project"

# Cloudinary para imágenes
CLOUDINARY_URL="cloudinary://tu-cloudinary-url"

# Resend para emails
RESEND_API_KEY="tu-resend-api-key"

# API de matching (si aplica)
NEXT_PUBLIC_MATCHING_API_URL="https://tu-api-matching.com"
```

## 🔧 Pasos de Configuración

### 1. Verificar Credenciales

Ejecuta el script de verificación:

```bash
npm run verify-mp
```

Este script verificará:
- ✅ Configuración de variables de entorno
- ✅ Conexión con API de Mercado Pago
- ✅ Validez de credenciales
- ✅ Manejo de errores

### 2. Configurar Base de Datos

```bash
# Aplicar migraciones
npm run prisma:deploy

# Generar cliente Prisma
npx prisma generate
```

### 3. Crear Plan de Suscripción

```bash
# Ejecutar script para crear el plan anual
node scripts/init-subscription-plan.js
```

### 4. Configurar Dominio

Asegúrate de que tu dominio esté configurado en:
- **Mercado Pago:** Para webhooks y notificaciones
- **NextAuth:** Para autenticación segura
- **Resend:** Para envío de emails

## 🛡️ Manejo de Errores en Producción

### Errores Comunes y Soluciones

#### 🔴 Fondos Insuficientes
- **Código:** `cc_rejected_insufficient_amount`
- **Mensaje:** "Tu tarjeta no tiene fondos suficientes."
- **Acción:** Usuario puede intentar con otra tarjeta

#### 🔴 Datos de Tarjeta Inválidos
- **Códigos:** `cc_rejected_bad_filled_date`, `cc_rejected_bad_filled_security_code`
- **Mensajes:** Errores específicos sobre fecha o código de seguridad
- **Acción:** Usuario puede corregir los datos

#### 🔴 Tarjeta Deshabilitada
- **Código:** `cc_rejected_card_disabled`
- **Mensaje:** "Llama a tu banco para activar tu tarjeta."
- **Acción:** Usuario debe contactar su banco

#### 🔴 Errores de Red
- **Códigos:** `timeout`, `network_error`
- **Mensajes:** Errores de conexión con sugerencias de reintento
- **Acción:** Usuario puede intentar nuevamente

### Componente de Manejo de Errores

El sistema incluye un componente `PaymentErrorHandler` que:
- ✅ Muestra errores de forma amigable
- ✅ Proporciona sugerencias específicas
- ✅ Permite reintentos para errores recuperables
- ✅ Incluye información técnica expandible

## 📊 Monitoreo y Logs

### Logs Importantes

El sistema registra logs detallados para:

```bash
# Logs de pago exitoso
✅ Pago aprobado: ID 123456789, Usuario: user@example.com

# Logs de errores
❌ Error de pago: cc_rejected_insufficient_amount
❌ Error de conexión: timeout

# Logs de configuración
🌍 Modo: PRODUCCIÓN
🔑 Access token configurado: SÍ
```

### Métricas a Monitorear

1. **Tasa de éxito de pagos**
2. **Errores más comunes**
3. **Tiempo de respuesta de API**
4. **Suscripciones activas**
5. **Usuarios con errores recurrentes**

## 🔒 Seguridad

### Medidas Implementadas

- ✅ **Tokens seguros:** No se almacenan datos de tarjetas
- ✅ **HTTPS obligatorio:** Todas las comunicaciones encriptadas
- ✅ **Validación robusta:** Verificación de datos en frontend y backend
- ✅ **Prevención de duplicados:** Sistema evita pagos duplicados
- ✅ **Logs seguros:** No se registran datos sensibles

### Recomendaciones Adicionales

1. **Configurar WAF** (Web Application Firewall)
2. **Implementar rate limiting**
3. **Configurar alertas de seguridad**
4. **Backups regulares de base de datos**
5. **Monitoreo de intentos de fraude**

## 🚀 Despliegue

### Plataformas Recomendadas

#### Vercel (Recomendado)
```bash
# Configurar variables de entorno en Vercel
vercel env add MERCADO_PAGO_ACCESS_TOKEN
vercel env add NEXT_PUBLIC_MP_PUBLIC_KEY
# ... otras variables

# Desplegar
vercel --prod
```

#### Railway
```bash
# Configurar variables en Railway Dashboard
# Conectar repositorio
# Desplegar automáticamente
```

#### AWS/GCP/Azure
```bash
# Configurar variables de entorno
# Usar Docker o despliegue directo
# Configurar SSL/TLS
```

### Checklist de Despliegue

- [ ] Variables de entorno configuradas
- [ ] Base de datos migrada
- [ ] Plan de suscripción creado
- [ ] Dominio configurado
- [ ] SSL/TLS habilitado
- [ ] Logs configurados
- [ ] Monitoreo activo
- [ ] Backup configurado

## 📞 Soporte

### Contacto Técnico
- **Email:** soporte@tuaplicacion.com
- **Documentación:** https://www.mercadopago.com.ar/developers/es/docs
- **Logs:** Revisar consola del servidor

### Escalación de Problemas

1. **Verificar logs** del servidor
2. **Revisar estado** de Mercado Pago
3. **Contactar soporte** de Mercado Pago si es necesario
4. **Documentar** el problema y solución

## 🎯 Próximos Pasos

1. **Configurar webhooks** para notificaciones automáticas
2. **Implementar analytics** de conversión
3. **Configurar alertas** de errores críticos
4. **Optimizar rendimiento** según métricas
5. **Planificar escalabilidad** para crecimiento

---

**¡Sistema listo para producción! 🚀**

Recuerda monitorear constantemente y mantener actualizadas las dependencias. 