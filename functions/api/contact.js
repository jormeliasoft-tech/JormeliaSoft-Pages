// Cloudflare Pages Function: recibe el formulario de contacto y lo envía por correo con Resend.
// Configuración necesaria (Cloudflare Pages > Settings > Environment variables):
//   RESEND_API_KEY = tu clave de https://resend.com (plan gratuito alcanza de sobra)
// Además, en Resend debes verificar el dominio jormeliasoft.com para poder enviar desde "formulario@jormeliasoft.com".
export async function onRequestPost(context) {
  const { request, env } = context;

  let data;
  try {
    data = await request.json();
  } catch (e) {
    return json({ ok: false, error: 'Solicitud inválida.' }, 400);
  }

  const nombre = String(data.nombre || '').trim();
  const correo = String(data.correo || '').trim();
  const servicio = String(data.servicio || '').trim();
  const mensaje = String(data.mensaje || '').trim();

  if (!nombre || !mensaje) {
    return json({ ok: false, error: 'Nombre y mensaje son obligatorios.' }, 400);
  }

  const apiKey = String(env.RESEND_API_KEY || '').trim();
  if (!apiKey) {
    return json({ ok: false, error: 'El envío de correo no está configurado todavía.' }, 500);
  }

  const html = buildEmailHtml({ nombre, correo, servicio, mensaje });
  const text = buildEmailText({ nombre, correo, servicio, mensaje });

  let resendRes;
  try {
    resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Jormelia Soft <formulario@jormeliasoft.com>',
        to: ['hola@jormeliasoft.com'],
        reply_to: correo || undefined,
        subject: `Nueva cotización de ${nombre}`,
        html,
        text,
      }),
    });
  } catch (e) {
    console.error('Resend fetch failed:', e.message);
    return json({ ok: false, error: 'No pudimos conectar con el servicio de correo. Intenta por WhatsApp.' }, 502);
  }

  if (!resendRes.ok) {
    const errText = await resendRes.text().catch(() => '');
    console.error('Resend API error:', resendRes.status, errText);
    return json({ ok: false, error: 'No pudimos enviar el mensaje. Intenta por WhatsApp.' }, 502);
  }

  return json({ ok: true }, 200);
}

function json(body, status) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
}

// Plantilla del correo interno (a hola@jormeliasoft.com) con la identidad de marca.
// Tablas + estilos en línea a propósito: es lo único que renderiza de forma confiable
// en Gmail/Outlook/Apple Mail (nada de CSS externo, grid, flexbox ni gradientes).
function buildEmailHtml({ nombre, correo, servicio, mensaje }) {
  const primerNombre = escapeHtml(nombre).split(' ')[0];
  const filas = [
    ['Nombre', escapeHtml(nombre)],
    ['Correo', escapeHtml(correo) || '<span style="color:#AEB8DC;">No indicado</span>'],
    ['Servicio', escapeHtml(servicio) || '<span style="color:#AEB8DC;">No indicado</span>'],
  ].map(([label, value]) => `
    <tr>
      <td style="padding:12px 0;border-bottom:1px solid #EEF1FB;font:600 12px Arial,Helvetica,sans-serif;color:#8A93B8;text-transform:uppercase;letter-spacing:.04em;width:110px;vertical-align:top;">${label}</td>
      <td style="padding:12px 0;border-bottom:1px solid #EEF1FB;font:400 15px Arial,Helvetica,sans-serif;color:#020C30;">${value}</td>
    </tr>`).join('');

  const boton = correo ? `
    <tr>
      <td style="padding:4px 32px 32px;text-align:center;">
        <a href="mailto:${escapeHtml(correo)}" style="display:inline-block;background:#1D4FE0;color:#ffffff;text-decoration:none;font:600 14px Arial,Helvetica,sans-serif;padding:13px 30px;border-radius:10px;">Responder a ${primerNombre}</a>
      </td>
    </tr>` : '';

  return `<!doctype html>
<html lang="es">
<body style="margin:0;padding:0;background:#F5F7FE;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F5F7FE;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:18px;overflow:hidden;border:1px solid #DCE2F5;">
          <tr>
            <td style="background:#020C30;padding:30px 32px;text-align:center;">
              <div style="font:700 21px Arial,Helvetica,sans-serif;color:#ffffff;letter-spacing:-.02em;">
                Jormelia<span style="font-weight:400;color:#4F5BEF;">Soft</span>
              </div>
              <div style="margin-top:8px;font:400 13px Arial,Helvetica,sans-serif;color:#AEB8DC;">Nueva cotización desde el sitio web</div>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 32px 4px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${filas}</table>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 32px 8px;">
              <div style="font:600 12px Arial,Helvetica,sans-serif;color:#8A93B8;text-transform:uppercase;letter-spacing:.04em;margin-bottom:10px;">Mensaje</div>
              <div style="background:#F5F7FE;border-radius:12px;padding:18px 20px;font:400 15px/1.6 Arial,Helvetica,sans-serif;color:#020C30;white-space:pre-wrap;">${escapeHtml(mensaje)}</div>
            </td>
          </tr>
          ${boton}
          <tr>
            <td style="background:#F5F7FE;padding:18px 32px;text-align:center;border-top:1px solid #DCE2F5;">
              <div style="font:400 12px Arial,Helvetica,sans-serif;color:#8A93B8;">Enviado automáticamente desde el formulario de <a href="https://jormeliasoft.com" style="color:#1D4FE0;text-decoration:none;">jormeliasoft.com</a></div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function buildEmailText({ nombre, correo, servicio, mensaje }) {
  return [
    'JORMELIA SOFT — Nueva cotización desde el sitio web',
    '',
    `Nombre: ${nombre}`,
    `Correo: ${correo || 'No indicado'}`,
    `Servicio: ${servicio || 'No indicado'}`,
    '',
    'Mensaje:',
    mensaje,
    '',
    '— Enviado automáticamente desde jormeliasoft.com',
  ].join('\n');
}
