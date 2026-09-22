import{C as s}from"./config-DZnAvSjb.js";document.addEventListener("DOMContentLoaded",()=>{r(),d(),p(),m(),u(),f(),x(),y(),g(),v(),b(),h(),$()});function r(){var n;document.querySelectorAll("#nav-brand, #footer-brand").forEach(e=>{e.textContent=s.brand}),document.title=`${s.name} — ${s.brand}`,(n=document.querySelector('meta[name="description"]'))==null||n.setAttribute("content",`${s.name} — ${s.subtitle}. Master ${s.topic} and start earning. Instant Google Drive access.`)}function d(){document.getElementById("hero-highlight").textContent=s.heroHeadlineHighlight,document.getElementById("hero-suffix").textContent=s.heroHeadlineSuffix,document.getElementById("hero-price").textContent=s.price.display,document.getElementById("mobile-cta-price").textContent=`· ${s.price.display}`;{const e=document.getElementById("hero-price-original");e.textContent=s.price.displayOriginal,e.style.display="";const t=document.getElementById("hero-discount-badge");t.textContent=`${s.price.discountPercent} Off`,t.classList.remove("hidden")}document.getElementById("instructor-name").textContent=s.instructor,document.getElementById("instructor-sub").textContent=`Expert in ${s.topic}`;const n=s.modules.reduce((e,t)=>e+t.lessons,0);document.getElementById("stat-lessons").textContent=`${n}+ HD Lessons`,document.getElementById("vault-folder-name").textContent=s.vault.folderName}function p(){const n=document.getElementById("vault-file-list");n&&(n.innerHTML=s.vault.files.slice(0,4).map(e=>`
    <div class="drive-file text-[12px]">
      <span class="text-[16px]">${e.icon}</span>
      <span class="truncate">${e.name}</span>
    </div>
  `).join(""))}function m(){const n=["⚡ Instant Drive Access","📁 Lifetime Vault Included","🎓 Self-Paced Learning","🔒 Secured by Razorpay","📱 Mobile-First Design","🔄 Future Updates Free","✅ Gmail-Based Delivery","💬 WhatsApp Support"],e=document.getElementById("marquee-inner"),t=[...n,...n];e.innerHTML=t.map(o=>`
    <span class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">${o}</span>
  `).join("")}function u(){const n=document.getElementById("for-you-list"),e=document.getElementById("not-for-you-list");n.innerHTML=s.forYou.map(t=>`
    <li class="check-item">
      <span class="material-symbols-outlined text-primary-container text-[16px] shrink-0 mt-0.5">check</span>
      <span class="font-body-sm text-body-sm">${t}</span>
    </li>
  `).join(""),e.innerHTML=s.notForYou.map(t=>`
    <li class="check-item">
      <span class="material-symbols-outlined text-error text-[16px] shrink-0 mt-0.5">close</span>
      <span class="font-body-sm text-body-sm">${t}</span>
    </li>
  `).join("")}function f(){const n=document.getElementById("inclusions-list");n.innerHTML=s.inclusions.map(e=>`
    <div class="flex items-start gap-space-sm">
      <span class="material-symbols-outlined text-primary-container text-[20px] shrink-0 mt-0.5">${e.icon}</span>
      <div>
        <p class="font-body-md text-body-md text-on-surface font-medium">${e.label}</p>
        <p class="font-body-sm text-body-sm text-on-surface-variant">${e.desc}</p>
      </div>
    </div>
  `).join("")}function x(){const n=document.getElementById("drive-file-tree"),e=document.getElementById("drive-folder-name");e&&(e.textContent=s.vault.folderName),n&&(n.innerHTML=s.vault.files.map((t,o)=>`
    <div class="drive-file" style="animation-delay: ${o*60}ms">
      <span class="text-[18px]">${t.icon}</span>
      <span class="text-[13px] truncate">${t.name}</span>
      <span class="ml-auto badge text-[9px]">Viewer</span>
    </div>
  `).join(""))}function y(){const n=document.getElementById("curriculum-accordion");n.innerHTML=s.modules.map((e,t)=>`
    <div class="accordion-item">
      <button class="accordion-trigger" onclick="toggleAccordion('mod-${t}', this)">
        <div class="flex items-center gap-space-md">
          <span class="font-label-md text-label-md text-primary-container">${e.index}</span>
          <div class="flex flex-col items-start">
            <span class="font-headline-md text-[16px] text-on-surface">${e.title}</span>
            <span class="font-label-sm text-label-sm text-on-surface-variant uppercase mt-0.5">
              ${e.lessons} Lessons · ${e.duration}
              ${e.badge?`<span class="ml-2 badge-primary text-[9px] py-0 px-1">${e.badge}</span>`:""}
            </span>
          </div>
        </div>
        <span class="material-symbols-outlined text-on-surface-variant text-[20px] shrink-0 transition-transform duration-200" id="chevron-mod-${t}">expand_more</span>
      </button>
      <div class="accordion-content" id="mod-${t}">
        <div class="px-space-lg pb-space-lg flex flex-col gap-2">
          ${e.topics.map(o=>`
            <div class="flex items-center gap-space-sm">
              <span class="material-symbols-outlined text-secondary text-[16px]">play_circle</span>
              <span class="font-body-sm text-body-sm text-on-surface-variant">${o}</span>
            </div>
          `).join("")}
        </div>
      </div>
    </div>
  `).join("")}function g(){const n=document.getElementById("steps-grid");n.innerHTML=s.steps.map((e,t)=>`
    <div class="card flex flex-col gap-space-md relative">
      ${t<s.steps.length-1?`
        <div class="hidden md:block absolute top-10 -right-[calc(theme(spacing.space-lg)/2+1px)] w-[calc(theme(spacing.space-lg)+2px)] h-0.5 bg-primary-container/20 translate-x-full z-10"></div>
      `:""}
      <div class="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center">
        <span class="material-symbols-outlined text-primary-container text-[24px]">${e.icon}</span>
      </div>
      <div class="flex items-center gap-space-sm">
        <span class="font-label-md text-label-md text-primary-container">${e.num}</span>
        <h3 class="font-headline-md text-[16px] text-on-surface">${e.title}</h3>
      </div>
      <p class="font-body-sm text-body-sm text-on-surface-variant">${e.desc}</p>
    </div>
  `).join("")}function v(){document.getElementById("pricing-current").textContent=s.price.display;{const e=document.getElementById("pricing-original");e.textContent=s.price.displayOriginal,e.classList.remove("hidden");const t=document.getElementById("pricing-discount");t.textContent=`${s.price.discountPercent} Off — Founding Offer`,t.classList.remove("hidden")}const n=document.getElementById("pricing-inclusions");n.innerHTML=s.inclusions.map(e=>`
    <div class="check-item">
      <span class="material-symbols-outlined text-primary-container text-[18px] shrink-0 mt-0.5">check_circle</span>
      <span>${e.label}</span>
    </div>
  `).join("")}function b(){const n=document.getElementById("faq-accordion");n.innerHTML=s.faqs.map((e,t)=>`
    <div class="accordion-item">
      <button class="accordion-trigger" onclick="toggleAccordion('faq-${t}', this)">
        <span class="font-body-md text-body-md text-on-surface text-left">${e.q}</span>
        <span class="material-symbols-outlined text-on-surface-variant text-[20px] shrink-0 transition-transform duration-200" id="chevron-faq-${t}">expand_more</span>
      </button>
      <div class="accordion-content" id="faq-${t}">
        <div class="px-space-lg pb-space-lg">
          <p class="font-body-md text-body-md text-on-surface-variant">${e.a}</p>
        </div>
      </div>
    </div>
  `).join("")}function h(){const n=s.support.whatsappUrl;document.querySelectorAll("#whatsapp-float, #whatsapp-faq, #whatsapp-how-it-works").forEach(t=>{t.href=n,t.target="_blank",t.rel="noopener noreferrer"});const e=document.getElementById("footer-support-link");e&&(e.href=`mailto:${s.support.email}`)}function $(){const n=document.getElementById("site-nav");window.addEventListener("scroll",()=>{window.scrollY>60?n.style.top="0":n.style.top="40px"})}window.toggleAccordion=function(n,e){var l;const t=document.getElementById(n),o=t.classList.contains("open"),c=(l=e.querySelector('[id^="chevron-"]'))==null?void 0:l.id,a=c?document.getElementById(c):e.querySelector(".material-symbols-outlined");o?(t.classList.remove("open"),a&&(a.style.transform="")):(document.querySelectorAll(".accordion-content.open").forEach(i=>{i.classList.remove("open")}),document.querySelectorAll(".accordion-trigger .material-symbols-outlined").forEach(i=>{i.style.transform=""}),t.classList.add("open"),a&&(a.style.transform="rotate(180deg)"))};window.closePreviewModal=function(){document.getElementById("preview-modal").classList.add("hidden")};
