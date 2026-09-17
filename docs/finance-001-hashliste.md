# Pruefsummen der abgelegten Eingangsrechnungen


**Zweck:** Nachweis der Unveraenderbarkeit (§ 146 Abs. 4 AO). Diese Liste ist
versioniert; eine nachtraegliche Aenderung einer abgelegten Rechnung wuerde
ihre Pruefsumme veraendern und damit von dem hier festgehaltenen Stand
abweichen. **Betraege und Lieferantendaten stehen bewusst nicht hier**, die
fuehrt `belege/eingangsrechnungen/eingangsbuch.csv` ausserhalb der
Versionsverwaltung.

Verfahren: `docs/finance-001-verfahrensdokumentation-rechnungseingang.md`

**Stand 17.09.2026: 25 Dateien zu 18 Belegen.** Erstbefuellung — bis heute
stand hier die Zeile *„noch keine Eingangsrechnung abgelegt"*, obwohl die
Dateien seit dem 17.09. im Ordner lagen. Nachgeholt, nicht geschaetzt: jede
Pruefsumme ist ueber die tatsaechlich abgelegte Datei gerechnet.

**So wird geprueft** (ein Befehl, Ergebnis muss leer sein):

```
node scripts/belege-pruefen.mjs
```

| # | Eingetragen am | Dateiname | SHA-256 |
|---|---|---|---|
| 1 | 2026-09-17 | `IONOS Rechnung 2026-04-26 - RG_100185593347.pdf` | `294574d4ce3152da33d23821d3fc85d66e166952db01803829f6aa3d78bb9541` |
| 2 | 2026-09-17 | `Deine Rechnung von Apple.eml` | `57928b1b82177c40e4f9fd452276d5f7bfc1afea7137e6a4229c493514894e78` |
| 3 | 2026-09-17 | `Invoice-TT0BDQ8S-0001.pdf` | `e26ca2795670da3533336d9f06ef07f6ffd90984cff4f2bd43923b9cb574d596` |
| 4 | 2026-09-17 | `Receipt-2392-5328.pdf` | `f83959f243f128a209fa9dd59401c5b61760afb338fb6934ae244e0f05ce3811` |
| 5 | 2026-09-17 | `Invoice-MVGOOM-00003.pdf` | `1730cf76d24e334ea184f51df091f087e36554ebea828a7325cda97e0c6a3179` |
| 6 | 2026-09-17 | `IONOS Rechnung 2026-05-26 - RG_100187536255.pdf` | `126479807b842532e2d06951a54dd2f51223c5fb80a792726c3c732d3ced18b9` |
| 7 | 2026-09-17 | `Invoice-YL9K6L19-0001.pdf` | `8f6ecd0b157f0d4ded672b6059a10ab6db550b8d6104dc62e56bdf17b4d7dc7a` |
| 8 | 2026-09-17 | `Invoice-TT0BDQ8S-0003.pdf` | `a1f46e40f1431c9e33ff0272412ed6e42b57ed0fbeecbf64e3749ac163f42dbd` |
| 9 | 2026-09-17 | `Receipt-2268-5813.pdf` | `386ece741e483059cc0a048185ccaeceaad88cc197ad4b0c0f977a5e40fb8981` |
| 10 | 2026-09-17 | `Invoice-MVGOOM-00005.pdf` | `58c63be0c497980bfc59007bbc8545741af24de6a9f07508a6f8db64ecd50a0e` |
| 11 | 2026-09-17 | `Receipt-MVGOOM-00005.pdf` | `70c5061f9974fd12ff14d844bd3437a19049a9bcf7e6fbc78d1a8946d1550426` |
| 12 | 2026-09-17 | `IONOS Rechnung 2026-06-26 - RG_100189466040.pdf` | `62bae04b028db0d38a63cbe004df0047e5ffdbf19b9401c43f2796045f0bcf46` |
| 13 | 2026-09-17 | `Invoice-TT0BDQ8S-0004.pdf` | `1ac119f4a64b2a3c2d05c721503f2486f326f069edcba17e52c0fb18527316b8` |
| 14 | 2026-09-17 | `Receipt-2842-3830.pdf` | `ca47a9b18ac2341d015f24a8531c37dd4dbdc1cb6e8f6f2409dc1dc5e2d268f2` |
| 15 | 2026-09-17 | `Invoice-MVGOOM-00006.pdf` | `928a2733c5184d5376fbac406661c34e2700e27e971e3e79a210b10df05d99ad` |
| 16 | 2026-09-17 | `Receipt-MVGOOM-00006.pdf` | `4d25087411960becce9ec80126588f1725c9fde19e1d59eee3aaa4751c83144e` |
| 17 | 2026-09-17 | `IONOS Rechnung 2026-07-26 - RG_100191208015.pdf` | `08cd64c3dfbc8fe5b8cb91ea6abba0f99c217b22aa60a41a7c2a142464bd7a71` |
| 18 | 2026-09-17 | `Deine Käufe bei Apple.eml` | `a1b6239b029436096914c7e398743d671512dfeb7e337f13a092332f05168542` |
| 19 | 2026-09-17 | `Invoice-CBBICKXQ-0001.pdf` | `4cc77ff2a0dfe38b070da596a9edfe9acab3b379402676a4286551d8a6799bc4` |
| 20 | 2026-09-17 | `Invoice-TT0BDQ8S-0005.pdf` | `1c1a95168d589dacfb540cbf8117cb3455cc4626f31185d567e0b82b719c4e7c` |
| 21 | 2026-09-17 | `Receipt-2017-0960.pdf` | `662b732f3112ed310ccb8d72aa54e3dac2379bdd860d349655bd3d4d25070077` |
| 22 | 2026-09-17 | `Invoice-MVGOOM-00007.pdf` | `e96129410ce61b55fd01200f96d5c92a647da2fd7c27ac926cd3c14feba31587` |
| 23 | 2026-09-17 | `Receipt-MVGOOM-00007.pdf` | `ab91001d35923902440ad88197e6ace188f3295e090eb9a527588f95db8725af` |
| 24 | 2026-09-17 | `IONOS Rechnung 2026-08-26 - RG_100192688572.pdf` | `42317a66665e1a1a8710101c6f0de30b98b148fa46e46f031a51b412bac63239` |
| 25 | 2026-09-17 | `406270316_ZUGFeRD.pdf` | `a0da28b699d9e09e4c04a0a99613d3b4d4a541345d9ab7b8ebd317491626eb9e` |

*Fortgeschrieben vom Head of Finance, zuletzt 17.09.2026.*
