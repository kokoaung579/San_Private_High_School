import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "နေပြည်တော် 'စံ' ကိုယ်ပိုင်အထက်တန်းကျောင်း | San Private High School",
  description: "Discover San Private High School in Nay Pyi Taw — a supportive learning community building knowledge, character and success from Grade 5 to Grade 12.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="my" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(() => { try { const saved = localStorage.getItem('san-private-high-school-theme'); const dark = saved ? saved === 'night' : window.matchMedia('(prefers-color-scheme: dark)').matches; document.documentElement.classList.toggle('theme-dark', dark); } catch {} })()` }} />
        <script dangerouslySetInnerHTML={{ __html: `if (location.protocol === 'file:') { document.addEventListener('DOMContentLoaded', function () { var box = document.createElement('div'); box.setAttribute('role', 'alert'); box.style.cssText = 'position:fixed;inset:0;z-index:2147483647;display:flex;align-items:center;justify-content:center;padding:24px;background:#0d1b31;color:#f3f5fa;font-family:system-ui,-apple-system,sans-serif;text-align:center'; box.innerHTML = '<div style="max-width:620px"><div style="color:#e6c477;font-size:12px;letter-spacing:.18em;text-transform:uppercase;margin-bottom:14px">San Private High School</div><h1 style="margin:0 0 14px;font-size:26px;color:#fff">This preview needs a local server</h1><p style="margin:0 0 10px;line-height:1.7;font-size:15px">You opened the exported <code>out/index.html</code> directly from disk. Browsers block the site&rsquo;s CSS and JavaScript in that mode, so the page appears broken.</p><p style="margin:0;line-height:1.7;font-size:15px">From the project folder run <code style="display:inline-block;margin-top:8px;padding:6px 10px;border:1px solid #e6c477;border-radius:6px;background:#172b50;color:#e6c477">npm run preview</code><br>then open <a href="http://localhost:4173" style="color:#e6c477">http://localhost:4173</a></p></div>'; document.body.appendChild(box); }); }` }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Sans+Myanmar:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-slate-50 text-slate-800 antialiased">{children}</body>
    </html>
  );
}
