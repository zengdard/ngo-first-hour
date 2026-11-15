# The five first-hour steps — NIS2 / GDPR notes

**Short answer:** the public session description does not spell out the five steps. The sequence below is the
one we use in the training; it is consistent with CIRCL’s incident-handling guidance and adds the two legal
clocks that matter for an NGO: **GDPR/CNPD (72 h)** and **NIS2 (24 h / 72 h / 1 month) if the NGO is in scope**.

---

## 1. The five steps we teach

| Step | What the NGO does | Legal hook |
|---|---|---|
| **1. Check** | Recognise the incident; ask: is personal data involved? Is it a significant incident? | GDPR Art. 33(1) “becomes aware”; NIS2 Art. 14(3) “significant incident” |
| **2. Contain** | Disconnect the device from the network; do not power it off; do not delete, pay or “clean” the evidence. | CIRCL evidence guidance; GDPR Art. 32; NIS2 Art. 21 |
| **3. Call** | Management/IT/DPO; CIRCL; CNPD if personal data risk; NIS2 competent authority if in scope; bank/police if money or crime. | GDPR Art. 33; NIS2 Art. 14; CIRCL mandate |
| **4. Capture** | Write the facts: who, what, when, systems/data, actions, people informed, decisions. | GDPR Art. 33(5) breach register; NIS2 evidence and records |
| **5. Communicate** | Say what is known, unknown and being done; inform data subjects if high risk; update donors/members; one voice, no blame. | GDPR Art. 34; NIS2 incident updates |

---

## 2. NIS2 in Luxembourg — what matters

- **Law:** Law of **5 May 2026** on measures to ensure a high level of cybersecurity, in force since
  **10 May 2026** (Mémorial A 225). It transposes Directive (EU) 2022/2555 and repeals the 2019 NIS1 law.
- **Who is in scope:** medium and large entities (50+ staff, or turnover/balance sheet thresholds) active in
  one of the 18 sectors of Annexes I/II, plus certain entities regardless of size. Sectors include energy,
  transport, health, water, digital infrastructure, ICT service management, public administration, space,
  postal, waste, chemicals, food, manufacturing, digital providers and **research**.
- **Most small NGOs are out of scope** unless they are medium/large in a listed sector, a research
  organisation, a public administration entity, or designated as critical/sole provider. Check the ILR
  simulator if unsure. Their IT providers may be in scope even if the NGO is not.
- **Competent authority:** **ILR** for most sectors; **CSSF** for banking/financial market infrastructures
  and the digital/ICT activities it supervises. **CIRCL** and **GOVCERT.LU** are the CSIRTs; **HCPN** is the
  single point of contact.
- **Notification route:** the significant incident is notified to the **competent authority** (ILR via
  **SERIMA**), not directly to CIRCL. The authority forwards it to the CSIRT and the single point of contact.
- **Clocks** (from awareness of a significant incident):
  - **24 h:** early warning (can be made even if the impact is not yet defined).
  - **72 h:** incident notification with an initial assessment.
  - **1 month:** final report; progress report if the incident is still open.
- **Significant incident test:** severe operational disruption or financial loss for the entity, or
  considerable material/non-material damage to others.
- **NIS2 does not replace GDPR.** A personal data breach can trigger both; do both notifications, not one
  instead of the other.

---

## 3. GDPR / CNPD — what matters

- **Applies to all NGOs processing personal data**, regardless of size.
- **72 hours:** notify the **CNPD** after becoming aware of a personal data breach **if it is likely to
  result in a risk** to the rights and freedoms of natural persons. If the 72-hour deadline is missed, the
  notification must explain the delay. You can notify with what you have and supplement later.
- **High risk:** communicate the breach to the **data subjects without undue delay**, in clear and plain
  language (Art. 34).
- **Record everything:** keep a **breach register** of all personal data breaches, including those not
  notified (Art. 33(5)): facts, effects, remedial action.
- **Processor:** a processor must notify the controller **without undue delay** after becoming aware
  (Art. 33(2)). If the NGO uses a provider, check the contract and the provider’s notification clause.
- **CNPD contact:** `databreach@cnpd.lu`; the CNPD data breach notification form is on cnpd.public.lu.
  Encryption with the CNPD GPG key is possible.
- **Do not wait for the full picture.** The clock starts at awareness, not at the end of the investigation.

---

## 4. CIRCL — the operational reflex

- CIRCL is the **CERT for the private sector, communes and non-governmental entities** in Luxembourg.
- **Report as soon as possible**: phone **+352 247 88444**, email **info@circl.lu**, or the anonymous form.
- CIRCL advises: report early; preserve evidence; do not alter the crime scene; **unplug the network rather
  than power off**; do not install, copy, move or delete files/logs; note **who, what, when, why, expected
  and actual outcome**; be specific about time and time zone.
- CIRCL is **not the regulator**: it supports and coordinates. NIS2 notifications go to the competent
  authority; GDPR notifications go to the CNPD.

---

## 5. The first hour, legally

| Time | Action |
|---|---|
| 0–15 min | **Check + Contain**: stop the spread, disconnect, preserve evidence, call IT/CIRCL. |
| 15–60 min | **Call**: management/DPO; CIRCL; assess personal data and CNPD risk; if NIS2 in scope, prepare the 24 h early warning. |
| 1–3 days | **Capture + Communicate**: CNPD within 72 h if risk; NIS2 notification within 72 h if in scope; data subjects if high risk; donors/members. |
| 1 month | NIS2 final report; lessons learned; update the register and the A5. |

**Three clocks to remember:** **24 h NIS2 early warning** · **72 h GDPR/CNPD (and NIS2 notification)** ·
**1 month NIS2 final report**.

---

## 6. What to change in the training

1. **Step 3 “Call”**: add “NIS2 competent authority (ILR/CSSF) if in scope” next to CIRCL and CNPD. Make clear
   that CIRCL is support, not the NIS2 regulator.
2. **Step 4 “Capture”**: call it the **breach register** when personal data is involved; it is a GDPR
   obligation, not just good practice.
3. **Step 5 “Communicate”**: add the GDPR Art. 34 trigger (high risk → data subjects) and the NIS2 update
   rhythm.
4. **A5 cheat sheet**: add the three clocks, the CNPD email, the CIRCL phone and the ILR/SERIMA route.
5. **Kahoot**: add one question on the 72 h CNPD clock and one on “NIS2 notification goes to the competent
   authority, not directly to CIRCL” if the audience is likely to be in scope.
6. **Debrief**: ask “are we in NIS2 scope?” and “is personal data involved?” before closing the incident.

---

## 7. Sources

- ILR, NIS2 incident notification: <https://www.ilr.lu/en/sectors/niss/incident-notification>
- ILR, NIS2 scope: <https://www.ilr.lu/en/sectors/niss/nis-2/scope-and-field-of-application>
- Law of 5 May 2026 (Mémorial A 225): <https://legilux.public.lu/eli/etat/leg/loi/2026/05/05/a225/jo>
- CNPD, data breaches: <https://cnpd.public.lu/en/professionnels/obligations/violation-de-donnees/violation-donnees-rgpd.html>
- GDPR Art. 33/34: <https://eur-lex.europa.eu/eli/reg/2016/679/oj/eng>
- CIRCL, report an incident: <https://www.circl.lu/report>
- CIRCL, RFC 2350: <https://circl.lu/mission/rfc2350>
