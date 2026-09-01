KOKAND UNIVERSITY — SHRIFTLAR
=================================

Sayt 5 ta shriftdan foydalanadi:

  1) Syne .............. BEPUL — Google Fonts orqali avtomatik yuklanadi (hech narsa kerak emas)
  2) Comfortaa ......... BEPUL — Google Fonts orqali avtomatik yuklanadi (hech narsa kerak emas)
  3) TAN - MERMAID ..... PREMIUM — fayl kerak (pastga qarang)
  4) Northwell ......... PREMIUM — fayl kerak (pastga qarang)
  5) Brittany Signature  PREMIUM — fayl kerak (pastga qarang)

------------------------------------------------------------------
PREMIUM SHRIFTLARNI QANDAY ULASH KERAK
------------------------------------------------------------------
Ushbu 3 ta shrift litsenziyali (pullik). Fayllarini sotib olib yoki
sizda bo'lgan nusxasini SHU papkaga (public/fonts/) quyidagi nomlar bilan
qo'ying — sayt darhol ulardan foydalanishni boshlaydi:

  public/fonts/TAN-MERMAID.woff2        (yoki .woff / .ttf)
  public/fonts/Northwell.woff2          (yoki .woff / .ttf)
  public/fonts/BrittanySignature.woff2  (yoki .woff / .ttf)

Eng yaxshisi — .woff2 formati (eng yengil). Agar sizda .ttf yoki .otf bo'lsa,
uni bepul onlayn "font converter" (masalan transfonter.org) orqali .woff2 ga
o'tkazing.

------------------------------------------------------------------
FAYL BO'LMASA NIMA BO'LADI?
------------------------------------------------------------------
Sayt buzilmaydi. Fayl topilmaganda avtomatik ravishda zaxira (fallback)
shrift ishlatiladi:
  - TAN - MERMAID   -> nafis serif (Playfair/Georgia)
  - Northwell       -> qo'lyozma (script)
  - Brittany Signature -> imzo uslubidagi (script)

Shrift sozlamalari: public/css/ku-theme.css (yuqoridagi @font-face qismi).
