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

  const html = `
    <p><strong>Nombre:</strong> ${escapeHtml(nombre)}</p>
    <p><strong>Correo:</strong> ${escapeHtml(correo) || 'No indicado'}</p>
    <p><strong>Servicio:</strong> ${escapeHtml(servicio) || 'No indicado'}</p>
    <p><strong>Mensaje:</strong><br>${escapeHtml(mensaje).replace(/\n/g, '<br>')}</p>
  `;

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
