(function(){
  var nav=document.getElementById('nav'), btn=document.getElementById('menuBtn');
  addEventListener('scroll',function(){nav.classList.toggle('scrolled',scrollY>8)},{passive:true});
  btn.addEventListener('click',function(){var o=nav.classList.toggle('open');btn.setAttribute('aria-expanded',o)});
  document.querySelectorAll('#menu a').forEach(function(a){a.addEventListener('click',function(){nav.classList.remove('open');btn.setAttribute('aria-expanded','false')})});
  document.getElementById('yr').textContent=new Date().getFullYear();

  // Hero: code -> result
  var src=[
    ['k','const '],['','sitio = '],['f','crearSitio'],['','({\n'],
    ['','  diseño: '],['s','"100% responsive"'],['',',\n'],
    ['','  dispositivos: ['],['s','"celular"'],['',', '],['s','"tablet"'],['',', '],['s','"laptop"'],['','],\n'],
    ['','  unaVezPorTodas: '],['p','true'],['',',\n'],['','});\n\n'],
    ['','sitio.'],['f','publicar'],['','(); '],['c','// listo']
  ];
  var code=document.getElementById('code'), ed=document.getElementById('editor'),
      tC=document.getElementById('tabCode'), tP=document.getElementById('tabPrev'), popTimer;
  function esc(t){return t.replace(/&/g,'&amp;').replace(/</g,'&lt;')}
  function render(n){var h='',left=n;for(var i=0;i<src.length&&left>0;i++){var t=src[i][1].slice(0,left);left-=t.length;h+=src[i][0]?'<span class="'+src[i][0]+'">'+esc(t)+'</span>':esc(t)}return h}
  var total=src.reduce(function(a,s){return a+s[1].length},0), timer;
  function show(v){
    ed.dataset.view=v; tC.setAttribute('aria-selected',v==='code'); tP.setAttribute('aria-selected',v==='preview');
    clearTimeout(popTimer); ed.classList.remove('pop');
    if(v==='preview'){ popTimer=setTimeout(function(){ ed.classList.add('pop') },20) }
  }
  tC.onclick=function(){clearTimeout(timer);code.innerHTML=render(total)+'<span class="caret"></span>';show('code')};
  tP.onclick=function(){clearTimeout(timer);code.innerHTML=render(total);show('preview')};
  if(matchMedia('(prefers-reduced-motion: reduce)').matches){code.innerHTML=render(total);return}
  var n=0;(function type(){n+=2;code.innerHTML=render(n)+'<span class="caret"></span>';if(n<total){timer=setTimeout(type,26)}else{timer=setTimeout(function(){show('preview')},900)}})();
})();

// Franja "Imagina · Crea · Conecta": animar los íconos una sola vez al entrar en vista
(function(){
  var band=document.querySelector('.band');
  if(!band || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var io=new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){ band.classList.add('in-view'); io.disconnect() }
    });
  },{threshold:.5});
  io.observe(band);
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

// Cotizador: modal + motor de estimacion
(function(){
  var modal=document.getElementById('quoteModal'), backdrop=document.getElementById('quoteBackdrop'),
      closeBtn=document.getElementById('quoteClose'), lastFocus=null;

  function openModal(e){
    if(e) e.preventDefault();
    lastFocus=document.activeElement;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden','false');
    document.body.style.overflow='hidden';
    closeBtn.focus();
  }
  function closeModal(){
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden','true');
    document.body.style.overflow='';
    if(lastFocus) lastFocus.focus();
  }
  document.querySelectorAll('a[href="#cotizador"]').forEach(function(t){ t.addEventListener('click', openModal) });
  closeBtn.addEventListener('click', closeModal);
  backdrop.addEventListener('click', closeModal);
  document.addEventListener('keydown', function(e){ if(e.key==='Escape' && modal.classList.contains('open')) closeModal() });

  var fmt=function(n){ return '$' + Math.round(n).toLocaleString('es-CO') };

  var services={
    web:{ label:'Página web',
      icon:'<rect x="3" y="4" width="18" height="14" rx="2.5"/><path d="M3 8.5h18M8 21h8M12 18v3"/>',
      questions:[
        { id:'size', label:'¿Qué tamaño necesitas?', type:'base', options:[
          {label:'Landing page (1-3 páginas)', min:900000, max:1800000, weeks:'1-2 semanas'},
          {label:'Sitio corporativo (5-10 páginas)', min:2500000, max:5500000, weeks:'2-4 semanas'},
          {label:'Sitio grande (10+ páginas)', min:6000000, max:10000000, weeks:'4-6 semanas'}
        ]},
        { id:'seo', label:'¿Necesitas SEO avanzado y copy profesional?', type:'add', options:[
          {label:'No, lo básico está bien', add:0},
          {label:'Sí, quiero posicionar en Google', add:900000}
        ]}
      ]},
    tienda:{ label:'Tienda en línea',
      icon:'<path d="M6 8V6.5a4.5 4.5 0 0 1 9 0V8"/><rect x="3.5" y="8" width="15" height="12.5" rx="2.5"/>',
      questions:[
        { id:'size', label:'¿Cuántos productos vas a vender?', type:'base', options:[
          {label:'Menos de 30', min:2800000, max:4500000, weeks:'2-3 semanas'},
          {label:'Entre 30 y 200', min:4500000, max:7000000, weeks:'3-5 semanas'},
          {label:'Más de 200 / varias bodegas', min:9000000, max:15000000, weeks:'5-8 semanas'}
        ]},
        { id:'dian', label:'¿Necesitas facturación electrónica (DIAN) integrada?', type:'add', options:[
          {label:'No por ahora', add:0},
          {label:'Sí, la necesito integrada', add:2000000}
        ]}
      ]},
    app:{ label:'Aplicación móvil',
      icon:'<rect x="6.5" y="2.5" width="11" height="19" rx="2.5"/><path d="M10.5 18.5h3"/>',
      questions:[
        { id:'complexity', label:'¿Qué tan compleja es?', type:'base', options:[
          {label:'Básica (perfil, pocas pantallas)', min:14000000, max:22000000, weeks:'6-8 semanas'},
          {label:'Con pagos y notificaciones', min:28000000, max:45000000, weeks:'10-14 semanas'},
          {label:'Compleja (backend propio, tiempo real)', min:55000000, max:90000000, weeks:'16-24 semanas'}
        ]},
        { id:'platform', label:'¿Para qué plataforma?', type:'mult', options:[
          {label:'Solo Android o solo iOS', mult:1},
          {label:'Android y iOS', mult:1.35}
        ]}
      ]},
    software:{ label:'Software a la medida',
      icon:'<path d="M4 7h9M17 7h3M4 17h3M11 17h9"/><circle cx="13.5" cy="7" r="2.2"/><circle cx="8" cy="17" r="2.2"/>',
      questions:[
        { id:'scope', label:'¿Cuál es el alcance?', type:'base', options:[
          {label:'Un proceso puntual (ej. solo citas)', min:8000000, max:14000000, weeks:'4-6 semanas'},
          {label:'Sistema completo con varios módulos', min:16000000, max:28000000, weeks:'8-12 semanas'},
          {label:'Con integraciones (CRM, ERP, pagos)', min:32000000, max:55000000, weeks:'12-20 semanas'}
        ]}
      ]},
    automatizacion:{ label:'Automatización',
      icon:'<path d="M21 12a9 9 0 0 1-15.5 6.36"/><path d="M3 12a9 9 0 0 1 15.5-6.36"/><path d="M21 4v6h-6"/><path d="M3 20v-6h6"/>',
      questions:[
        { id:'scope', label:'¿Cuántas herramientas quieres conectar?', type:'base', options:[
          {label:'2-3 herramientas', min:1200000, max:2500000, weeks:'1-2 semanas'},
          {label:'4 o más, con reportes automáticos', min:3000000, max:6000000, weeks:'2-4 semanas'}
        ]}
      ]},
    soporte:{ label:'Soporte y mantenimiento',
      icon:'<path d="M4.5 13v-1.5a7.5 7.5 0 0 1 15 0V13"/><rect x="2.5" y="13" width="4" height="6.5" rx="2"/><rect x="17.5" y="13" width="4" height="6.5" rx="2"/>',
      questions:[
        { id:'plan', label:'¿Qué plan necesitas?', type:'base', suffix:'/mes', options:[
          {label:'Básico (backups + actualizaciones)', min:350000, max:600000, weeks:'Plan mensual continuo'},
          {label:'Completo (+ cambios y monitoreo prioritario)', min:700000, max:1200000, weeks:'Plan mensual continuo'}
        ]}
      ]}
  };

  var qstate={service:null, answers:{}};
  var svcGrid=document.getElementById('qSvcGrid'), questionsEl=document.getElementById('qQuestions'), resultBox=document.getElementById('qResult');

  Object.keys(services).forEach(function(key){
    var s=services[key], b=document.createElement('button');
    b.type='button'; b.className='quote-svc-btn'; b.id='qsvc-'+key;
    b.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'+s.icon+'</svg><span>'+s.label+'</span>';
    b.addEventListener('click', function(){ selectService(key) });
    svcGrid.appendChild(b);
  });

  function selectService(key){
    qstate.service=key; qstate.answers={};
    Object.keys(services).forEach(function(k){ document.getElementById('qsvc-'+k).classList.toggle('active', k===key) });
    renderQuestions();
  }

  function renderQuestions(){
    questionsEl.innerHTML='';
    if(!qstate.service) return;
    var s=services[qstate.service];
    s.questions.forEach(function(q){
      var block=document.createElement('div'), label=document.createElement('span');
      label.className='quote-q-label'; label.textContent=q.label; block.appendChild(label);
      var grid=document.createElement('div'); grid.className='quote-opt-grid';
      q.options.forEach(function(opt,i){
        var o=document.createElement('div'); o.className='quote-opt'; o.id='qopt-'+q.id+'-'+i;
        o.innerHTML='<span>'+opt.label+'</span><span class="check"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg></span>';
        o.addEventListener('click', function(){
          qstate.answers[q.id]=opt;
          q.options.forEach(function(_,j){ document.getElementById('qopt-'+q.id+'-'+j).classList.remove('active') });
          o.classList.add('active');
          renderResult();
        });
        grid.appendChild(o);
        if(i===0 && qstate.answers[q.id]===undefined && q.type==='base'){ qstate.answers[q.id]=opt; o.classList.add('active') }
      });
      block.appendChild(grid); questionsEl.appendChild(block);
    });
    renderResult();
  }

  function renderResult(){
    if(!qstate.service){ resultBox.innerHTML='<p class="quote-empty">Elige un servicio arriba para ver el estimado.</p>'; return }
    var s=services[qstate.service], base=null, addTotal=0, mult=1, weeks='';
    s.questions.forEach(function(q){
      var ans=qstate.answers[q.id]; if(!ans) return;
      if(q.type==='base'){ base=ans; weeks=ans.weeks }
      if(q.type==='add'){ addTotal+=ans.add }
      if(q.type==='mult'){ mult=ans.mult }
    });
    if(!base){ resultBox.innerHTML='<p class="quote-empty">Responde las preguntas para ver tu estimado.</p>'; return }
    var min=Math.round((base.min*mult+addTotal)/10000)*10000, max=Math.round((base.max*mult+addTotal)/10000)*10000;
    var suffix=s.questions[0].suffix || '';
    var waText='Hola Jormelia Soft, quiero cotizar: '+s.label+
      Object.keys(qstate.answers).map(function(k){ return ' · '+qstate.answers[k].label }).join('')+
      '. Rango estimado: '+fmt(min)+suffix+' - '+fmt(max)+suffix+'. ¿Podemos hablar?';

    resultBox.innerHTML=
      '<div class="quote-result">'+
        '<div class="quote-result-row">'+
          '<div><div class="quote-price-label">Rango estimado</div><div class="quote-price">'+fmt(min)+' – '+fmt(max)+suffix+'</div></div>'+
          '<div class="quote-meta"><div class="n">'+weeks+'</div><div class="l">tiempo estimado</div></div>'+
        '</div>'+
        '<p class="quote-disclaimer">Estimado de referencia según proyectos similares. El valor final se confirma después de conocer tu proyecto en detalle, sin costo ni compromiso.</p>'+
      '</div>'+
      '<a class="quote-cta" target="_blank" rel="noopener" id="qCtaLink" href="https://wa.me/573005772967?text='+encodeURIComponent(waText)+'">'+
        '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91C21.95 6.45 17.5 2 12.04 2Zm5.8 14.03c-.24.68-1.42 1.3-1.95 1.35-.5.05-1.13.07-1.83-.11-.42-.13-.96-.31-1.65-.61-2.9-1.25-4.8-4.17-4.94-4.36-.14-.2-1.18-1.57-1.18-3s.75-2.13 1.02-2.42c.26-.29.57-.36.77-.36h.55c.18 0 .42-.07.65.5.24.58.82 2 .89 2.15.07.14.12.31.02.5-.1.2-.14.31-.29.48-.14.17-.3.38-.43.51-.14.14-.29.3-.13.59.17.29.74 1.22 1.58 1.97 1.09.97 2 1.27 2.29 1.41.29.14.46.12.63-.07.17-.2.72-.84.92-1.13.19-.29.38-.24.65-.14.26.1 1.68.79 1.97.94.29.14.48.21.55.33.07.13.07.71-.17 1.39Z"/></svg>'+
        'Continuar por WhatsApp'+
      '</a>'+
      '<p class="quote-fine">Se abrirá WhatsApp con tu selección y el rango estimado ya escritos.</p>';

    var ctaLink=document.getElementById('qCtaLink');
    if(ctaLink) ctaLink.addEventListener('click', function(){ trackEvent('whatsapp_click', {location:'cotizador'}) });
  }

  renderResult();
})();
