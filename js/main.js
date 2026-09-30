(function(){
  var nav=document.getElementById('nav'), btn=document.getElementById('menuBtn');
  addEventListener('scroll',function(){nav.classList.toggle('scrolled',scrollY>8)},{passive:true});
  btn.addEventListener('click',function(){var o=nav.classList.toggle('open');btn.setAttribute('aria-expanded',o)});
  document.querySelectorAll('#menu a').forEach(function(a){a.addEventListener('click',function(){nav.classList.remove('open');btn.setAttribute('aria-expanded','false')})});
  document.getElementById('yr').textContent=new Date().getFullYear();

  // Hero: code -> result
  var src=[
    ['k','const '],['','negocio = '],['f','crearSitio'],['','({\n'],
    ['','  nombre: '],['s','"Panadería La Espiga"'],['',',\n'],
    ['','  pedidos: '],['s','"WhatsApp"'],['',',\n'],
    ['','  pagos: ['],['s','"Nequi"'],['',', '],['s','"PSE"'],['',', '],['s','"Tarjeta"'],['','],\n'],
    ['','  movil: '],['p','true'],['',',\n'],['','});\n\n'],
    ['','negocio.'],['f','publicar'],['','(); '],['c','// listo']
  ];
  var code=document.getElementById('code'), ed=document.getElementById('editor'),
      tC=document.getElementById('tabCode'), tP=document.getElementById('tabPrev');
  function esc(t){return t.replace(/&/g,'&amp;').replace(/</g,'&lt;')}
  function render(n){var h='',left=n;for(var i=0;i<src.length&&left>0;i++){var t=src[i][1].slice(0,left);left-=t.length;h+=src[i][0]?'<span class="'+src[i][0]+'">'+esc(t)+'</span>':esc(t)}return h}
  var total=src.reduce(function(a,s){return a+s[1].length},0), timer;
  function show(v){ed.dataset.view=v;tC.setAttribute('aria-selected',v==='code');tP.setAttribute('aria-selected',v==='preview')}
  tC.onclick=function(){clearTimeout(timer);code.innerHTML=render(total)+'<span class="caret"></span>';show('code')};
  tP.onclick=function(){clearTimeout(timer);code.innerHTML=render(total);show('preview')};
  if(matchMedia('(prefers-reduced-motion: reduce)').matches){code.innerHTML=render(total);return}
  var n=0;(function type(){n+=2;code.innerHTML=render(n)+'<span class="caret"></span>';if(n<total){timer=setTimeout(type,26)}else{timer=setTimeout(function(){show('preview')},900)}})();
})();

// Analítica: no-op seguro si no hay GA4 configurado (ver bloque comentado en el <head>)
function trackEvent(name, params){ if (typeof gtag === 'function') gtag('event', name, params || {}) }
document.querySelectorAll('a[href^="https://wa.me/"]').forEach(function(a){
  a.addEventListener('click', function(){
    var host = a.closest('section,footer');
    trackEvent('whatsapp_click', {location: a.className || (host && host.id) || 'link'});
  });
});

// Formulario -> WhatsApp o correo
(function(){
  var form=document.getElementById('form'), err=document.getElementById('fErr'), ok=document.getElementById('fOk'),
      btnMail=document.getElementById('fSendMail'), btnWa=document.getElementById('fSendWa');

  function campos(){
    return {
      n: document.getElementById('fNombre').value.trim(),
      c: document.getElementById('fCorreo').value.trim(),
      s: document.getElementById('fServicio').value,
      m: document.getElementById('fMsg').value.trim()
    };
  }

  form.addEventListener('submit', function(e){
    e.preventDefault();
    var f = campos();
    if(!f.n){ err.textContent='Escribe tu nombre para saber cómo llamarte.'; ok.textContent=''; document.getElementById('fNombre').focus(); return }
    err.textContent=''; ok.textContent='';
    trackEvent('whatsapp_click', {location:'form'});
    var txt='Hola Jormelia Soft, soy '+f.n+'. Me interesa: '+f.s+'.'+(f.m?' '+f.m:'');
    window.open('https://wa.me/573005772967?text='+encodeURIComponent(txt),'_blank','noopener');
  });

  btnMail.addEventListener('click', function(){
    var f = campos();
    if(!f.n || !f.m){ err.textContent='Escribe tu nombre y cuéntanos qué necesitas para poder escribirte.'; ok.textContent=''; return }
    err.textContent=''; ok.textContent='';
    btnMail.disabled = true; btnMail.textContent = 'Enviando…';
    fetch('/api/contact', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ nombre:f.n, correo:f.c, servicio:f.s, mensaje:f.m })
    }).then(function(r){ return r.json().then(function(data){ return {status:r.status, data:data} }) })
      .then(function(res){
        btnMail.disabled = false; btnMail.textContent = 'Enviar por correo';
        if(res.data && res.data.ok){ ok.textContent='¡Listo! Te responderemos pronto a tu correo.'; form.reset() }
        else { err.textContent = (res.data && res.data.error) || 'No pudimos enviar el mensaje. Intenta por WhatsApp.' }
      })
      .catch(function(){
        btnMail.disabled = false; btnMail.textContent = 'Enviar por correo';
        err.textContent = 'No pudimos enviar el mensaje. Intenta por WhatsApp.';
      });
  });
})();
