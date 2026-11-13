/* Bilingual content for 9:14 — The First Hour.
   English and French share the same structure. */

const CONTENT = {
  en: {
    ui: {
      brandSubtitle: "The First Hour",
      navHome: "Home",
      navGroup: "Group game",
      navIndividual: "Individual game",
      footer: "Cybersecurity for NGOs — Session 3 · No account · No data stored",

      homeEyebrow: "Cybersecurity for NGOs · Session 3",
      homeTitle: "9:14 — The First Hour",
      homeLede:
        "An incident just started. You have one hour to spot it, contain it, call the right people and write it down.",
      homeCore:
        "<strong>Core message:</strong> If in doubt, report it. Speed and a written record matter more than technical expertise.",

      groupTag: "Group game · 12 min",
      groupTitle: "Two scenarios. One team.",
      groupText:
        "Play the incident-response cell. The presenter runs it on the projected screen, or each team plays on a phone. Same content, same decisions.",
      presenterBtn: "Presenter mode",
      playerBtn: "Play on your phone",

      individualTag: "Individual game · 8 min",
      individualTitle: "Fraudulent bank transaction",
      individualText:
        "Read the scenario and complete the log sheet: name, time, description, affected. The app gives feedback and a printable sheet.",
      individualBtn: "Start the individual game",

      noAccount:
        "<strong>No account. No data stored.</strong> Everything runs in the browser. Use the QR code on the projected screen to open the player mode.",

      groupSelectEyebrow: "Group game",
      groupSelectTitle: "Choose a scenario",
      groupSelectLede:
        "Five steps per scenario. Ten points per step. The presenter and the players see the same content.",
      presenterMode: "Presenter mode",
      playerMode: "Player mode",
      teamName: "Team name",
      optional: "(optional)",
      startScenario: "Start scenario",
      completed: "Completed",
      backHome: "Back to home",

      stepOf: "Step {n} of {total}",
      timeLeft: "Time left",
      donorTrust: "Donor trust",
      containment: "Containment",
      presenterTip: "Presenter tip",
      correct: "Correct",
      partlyRight: "Partly right",
      notBest: "Not the best choice",
      points: "points",
      nextStep: "Next step",
      seeResult: "See the result",
      leaveScenario: "Leave scenario",

      scenarioResult: "Scenario result",
      percentStrong: "Strong first hour.",
      percentGood: "A good start; check the debrief.",
      percentNeeds: "Use the debrief to review the five steps.",
      yourDecisions: "Your decisions",
      totalBoth:
        "<strong>Total across both scenarios: {total}/100.</strong> The two scenarios cover the same five steps in different contexts.",
      playOther: "Play the other scenario",
      backScenarios: "Back to scenarios",

      individualEyebrow: "Individual game · 8 min",
      individualLede:
        "Read the scenario. Then complete the log sheet with four fields: name, time, description, affected.",
      statement: "statement",
      payment: "Payment",
      recipient: "Recipient",
      status: "Status",
      beforeYouWrite:
        "<strong>Before you write:</strong> call the bank, report to management/IT, then log the facts. The log is not a blame note.",
      nameLabel: "Name",
      nameHint: "Who detected or reported it?",
      timeLabel: "Time",
      timeHint: "Date and time of the incident",
      descriptionLabel: "Description",
      descriptionHint: "What happened, in one or two sentences",
      affectedLabel: "Affected",
      affectedHint: "What is affected?",
      namePlaceholder: "e.g. Alex Martin, treasurer",
      timePlaceholder: "e.g. 13/11/2026 09:14",
      descriptionPlaceholder: "What did you see? What did you do?",
      affectedPlaceholder: "e.g. NGO bank account and card",
      submitLog: "Submit log sheet",

      fieldCheck: "Field check",
      complete: "Complete",
      tooShort: "Too short",
      addDate: "Add a date",
      addFacts: "Add facts",
      beSpecific: "Be specific",
      toImprove: "To improve",
      allComplete:
        "<strong>All four fields are complete.</strong><p>Check the model answer to compare the wording.</p>",
      modelAnswer: "Model answer",
      print: "Print / save as PDF",
      tryAgain: "Try again",
      missing: "Missing",
      issueName: "Add the name of the person who detected or reported the incident.",
      issueTime: "Add the date and time of the incident.",
      issueDescription:
        "Mention the fraudulent transaction, the amount (€4,890), the bank/account and what you did.",
      issueAffected:
        "State what is affected: the bank account, the card and the funds.",

      resultEyebrow: "Individual game · result",
      yourLogSheet: "Your log sheet",
      needsWork: "Needs work. Use the model below.",
      goodStart: "Good start. Add the missing details.",
      strongLog: "Strong log sheet.",
      printEyebrow: "Incident log sheet",

      from: "From",
      subject: "Subject",
      simulation: "Simulation",
      fakeLoginTitle: "Confirm your identity",
      fakeLoginId: "Client ID",
      fakeLoginPassword: "Password",
      fakeLoginButton: "Confirm",
      fakeLoginNotice:
        "This is a simulation. This page is not the bank. Never enter your credentials from an email link.",
    },

    scenarios: {
      phishing: {
        id: "phishing",
        label: "Scenario A",
        title: "Clicked phishing link",
        subtitle: "Weird things started happening.",
        context: {
          type: "email",
          from: "Banque de Luxembourg <security@bank-lu.example>",
          subject: "Urgent — confirm the payment of €4,890",
          body: "Dear customer, a payment of €4,890 is waiting for your confirmation. Open the attached invoice to validate it within 24 hours.",
          link: "https://bank-lu.example/verify",
          attachment: "invoice_2026.pdf.exe",
          footer:
            "A volunteer clicks the link. Ten minutes later, a window says the files are encrypted.",
        },
        steps: [
          {
            title: "The email",
            prompt: "A volunteer receives this email. What should she do?",
            tip: "Ask the room: what are the three signs? Sender, urgency, .exe attachment.",
            options: [
              {
                text: "Click the link to check the payment.",
                points: 0,
                quality: "bad",
                feedback:
                  "The link is the trap. One click can install malware or steal credentials.",
                effect: { time: -8, trust: -10, contain: 0 },
              },
              {
                text: "Report it to IT and the phishing inbox.",
                points: 10,
                quality: "good",
                feedback:
                  "Correct. Report, do not click. IT can block the sender and warn others.",
                effect: { time: -2, trust: 5, contain: 1 },
              },
              {
                text: "Delete it and say nothing.",
                points: 4,
                quality: "partial",
                feedback:
                  "Better than clicking, but deleting hides the evidence. Report it.",
                effect: { time: -5, trust: 0, contain: 0 },
              },
              {
                text: "Forward it to all colleagues to warn them.",
                points: 2,
                quality: "bad",
                feedback:
                  "Forwarding spreads the malicious link. Report it to IT instead.",
                effect: { time: -6, trust: -5, contain: 0 },
              },
            ],
          },
          {
            title: "Weird things",
            prompt:
              "Ten minutes later, a window says the files are encrypted. What do you do first?",
            tip: "Ask: pay, restart, or disconnect? Which one contains the damage?",
            options: [
              {
                text: "Pay the ransom.",
                points: 0,
                quality: "bad",
                feedback:
                  "Paying does not guarantee recovery and funds the attacker.",
                effect: { time: -8, trust: -15, contain: 0 },
              },
              {
                text: "Disconnect the laptop from the internet and call IT.",
                points: 10,
                quality: "good",
                feedback:
                  "Correct. Contain first, then call. Do not switch the laptop off.",
                effect: { time: -2, trust: 5, contain: 1 },
              },
              {
                text: "Restart the computer.",
                points: 2,
                quality: "partial",
                feedback:
                  "A restart can destroy evidence. Disconnect and call IT.",
                effect: { time: -5, trust: 0, contain: 0 },
              },
              {
                text: "Wait to see what happens.",
                points: 0,
                quality: "bad",
                feedback:
                  "Every minute lets the malware spread. Act now.",
                effect: { time: -10, trust: -10, contain: 0 },
              },
            ],
          },
          {
            title: "The calls",
            prompt: "Who do you contact?",
            tip: "Ask: who calls whom, and in what order?",
            options: [
              {
                text: "IT support and CIRCL.",
                points: 10,
                quality: "good",
                feedback:
                  "Correct. IT contains; CIRCL advises. Contact the CNPD if personal data is involved.",
                effect: { time: -2, trust: 5, contain: 1 },
              },
              {
                text: "The bank only.",
                points: 4,
                quality: "partial",
                feedback:
                  "The bank matters if money is at risk, but IT and CIRCL come first.",
                effect: { time: -5, trust: 0, contain: 0 },
              },
              {
                text: "The police only.",
                points: 4,
                quality: "partial",
                feedback:
                  "The police are useful for fraud, but IT and CIRCL come first.",
                effect: { time: -5, trust: 0, contain: 0 },
              },
              {
                text: "No one; IT will notice.",
                points: 0,
                quality: "bad",
                feedback: "Speed matters. Report now.",
                effect: { time: -10, trust: -10, contain: 0 },
              },
            ],
          },
          {
            title: "The log",
            prompt: "Which log entry is complete?",
            tip: "Ask: which fields are missing — name, time, description, affected?",
            options: [
              {
                text: "9:14 — something happened — computer.",
                points: 2,
                quality: "partial",
                feedback:
                  "Too vague. A log needs who, what, when and what is affected.",
                effect: { time: -4, trust: 0, contain: 0 },
              },
              {
                text: "9:14 — A volunteer clicked a phishing link; files encrypted on the finance laptop; IT and CIRCL called; beneficiary data at risk.",
                points: 10,
                quality: "good",
                feedback:
                  "Correct. Name, time, description, affected and actions.",
                effect: { time: -2, trust: 5, contain: 1 },
              },
              {
                text: "The volunteer's fault.",
                points: 0,
                quality: "bad",
                feedback: "A log is factual, not a blame note.",
                effect: { time: -4, trust: -10, contain: 0 },
              },
              {
                text: "See email.",
                points: 0,
                quality: "bad",
                feedback: "Not a log. Write the facts.",
                effect: { time: -6, trust: 0, contain: 0 },
              },
            ],
          },
          {
            title: "The message",
            prompt: "Which message to donors and members is best?",
            tip: "Ask: what do we know, what do we not know, what are we doing?",
            options: [
              {
                text: "Everything is fine.",
                points: 0,
                quality: "bad",
                feedback: "False reassurance destroys trust.",
                effect: { time: -2, trust: -20, contain: 0 },
              },
              {
                text: "We detected an incident. We have contained it and called our IT provider and CIRCL. We will update you within 24 hours. No action is needed from you at this stage.",
                points: 10,
                quality: "good",
                feedback:
                  "Correct: what happened, what is known, what we do, what happens next.",
                effect: { time: -2, trust: 10, contain: 1 },
              },
              {
                text: "A volunteer made a mistake; we are investigating.",
                points: 2,
                quality: "partial",
                feedback:
                  "No blame. Say what happened, not who is at fault.",
                effect: { time: -4, trust: -5, contain: 0 },
              },
              {
                text: "Pay us to get your data back.",
                points: 0,
                quality: "bad",
                feedback: "Never. This is not a communication strategy.",
                effect: { time: -2, trust: -25, contain: 0 },
              },
            ],
          },
        ],
      },

      laptop: {
        id: "laptop",
        label: "Scenario B",
        title: "Stolen laptop",
        subtitle: "A laptop with beneficiary data is gone.",
        context: {
          type: "note",
          title: "The theft",
          body: "A staff member’s laptop was stolen from a car. It contains the beneficiary list and the finance folder.",
          details: [
            "Beneficiary list: 240 names, addresses and phone numbers",
            "Finance folder: bank statements and invoices",
            "Laptop: no full-disk encryption",
          ],
        },
        steps: [
          {
            title: "The theft",
            prompt: "The laptop is gone. What do you do first?",
            tip: "Ask: what is the real risk — the device or the data?",
            options: [
              {
                text: "Wait for the laptop to come back.",
                points: 0,
                quality: "bad",
                feedback: "The data is at risk now. Do not wait.",
                effect: { time: -10, trust: -10, contain: 0 },
              },
              {
                text: "Report it to IT, remote-wipe the laptop and change passwords.",
                points: 10,
                quality: "good",
                feedback: "Correct. Contain the data risk first.",
                effect: { time: -2, trust: 5, contain: 1 },
              },
              {
                text: "Buy a new laptop.",
                points: 2,
                quality: "partial",
                feedback:
                  "A new laptop does not protect the data. Report and wipe first.",
                effect: { time: -5, trust: 0, contain: 0 },
              },
              {
                text: "Post the serial number on social media.",
                points: 0,
                quality: "bad",
                feedback:
                  "This can expose the incident and help the thief.",
                effect: { time: -4, trust: -10, contain: 0 },
              },
            ],
          },
          {
            title: "The data",
            prompt: "What is affected?",
            tip: "Ask: which data was on the laptop, and is it personal data?",
            options: [
              {
                text: "Only the laptop.",
                points: 0,
                quality: "bad",
                feedback: "The data is the real risk, not the device.",
                effect: { time: -6, trust: -10, contain: 0 },
              },
              {
                text: "The beneficiary list and the finance folder; personal data may be exposed.",
                points: 10,
                quality: "good",
                feedback: "Correct. Assess the data, not just the device.",
                effect: { time: -2, trust: 5, contain: 1 },
              },
              {
                text: "Nothing, the laptop was encrypted.",
                points: 2,
                quality: "partial",
                feedback:
                  "Check: the scenario says there is no full-disk encryption.",
                effect: { time: -5, trust: 0, contain: 0 },
              },
              {
                text: "The building.",
                points: 0,
                quality: "bad",
                feedback: "No. Focus on the data on the laptop.",
                effect: { time: -4, trust: 0, contain: 0 },
              },
            ],
          },
          {
            title: "The calls",
            prompt: "Who do you contact?",
            tip: "Ask: who handles the theft, the data risk and the data protection duty?",
            options: [
              {
                text: "IT, the police, CIRCL and the CNPD if personal data is involved.",
                points: 10,
                quality: "good",
                feedback:
                  "Correct. Report the theft, contain the data risk, get advice, assess data protection.",
                effect: { time: -2, trust: 5, contain: 1 },
              },
              {
                text: "The police only.",
                points: 4,
                quality: "partial",
                feedback:
                  "The police handle theft; IT and CIRCL handle the data risk.",
                effect: { time: -5, trust: 0, contain: 0 },
              },
              {
                text: "The insurance only.",
                points: 4,
                quality: "partial",
                feedback:
                  "Insurance is useful, but it is not the first call.",
                effect: { time: -5, trust: 0, contain: 0 },
              },
              {
                text: "No one.",
                points: 0,
                quality: "bad",
                feedback: "Report now.",
                effect: { time: -10, trust: -10, contain: 0 },
              },
            ],
          },
          {
            title: "The log",
            prompt: "Which log entry is complete?",
            tip: "Ask: which fields are missing — name, time, description, affected?",
            options: [
              {
                text: "Laptop stolen.",
                points: 2,
                quality: "partial",
                feedback:
                  "Too vague. A log needs who, what, when and what is affected.",
                effect: { time: -4, trust: 0, contain: 0 },
              },
              {
                text: "14:20 — Staff laptop stolen from a car; beneficiary list and finance folder on it; remote wipe requested; IT, police and CIRCL informed; CNPD to assess.",
                points: 10,
                quality: "good",
                feedback:
                  "Correct. Name, time, description, affected and actions.",
                effect: { time: -2, trust: 5, contain: 1 },
              },
              {
                text: "Ask the staff member to pay.",
                points: 0,
                quality: "bad",
                feedback: "No blame; log the facts.",
                effect: { time: -4, trust: -10, contain: 0 },
              },
              {
                text: "No log needed.",
                points: 0,
                quality: "bad",
                feedback: "If it is not written, it did not happen.",
                effect: { time: -6, trust: 0, contain: 0 },
              },
            ],
          },
          {
            title: "The message",
            prompt: "Which message to beneficiaries is best?",
            tip: "Ask: what do we know, what do we not know, what are we doing?",
            options: [
              {
                text: "Your data is safe.",
                points: 0,
                quality: "bad",
                feedback: "You do not know that yet.",
                effect: { time: -2, trust: -20, contain: 0 },
              },
              {
                text: "We are aware that a laptop was stolen. We have taken steps to protect the data and have informed the authorities. We will contact you if your data is affected.",
                points: 10,
                quality: "good",
                feedback: "Correct: factual, actions, next step.",
                effect: { time: -2, trust: 10, contain: 1 },
              },
              {
                text: "It was the staff member's fault.",
                points: 0,
                quality: "bad",
                feedback: "No blame.",
                effect: { time: -2, trust: -15, contain: 0 },
              },
              {
                text: "We cannot comment.",
                points: 2,
                quality: "partial",
                feedback:
                  "Silence erodes trust. Say what you know and what you are doing.",
                effect: { time: -2, trust: -8, contain: 0 },
              },
            ],
          },
        ],
      },
    },

    bank: {
      account: "NGO main account",
      date: "13/11/2026",
      time: "09:14",
      amount: "€4,890.00",
      recipient: "GLOBAL SERVICES LTD",
      status: "Completed",
      note: "You did not authorize this payment. The treasurer calls you.",
    },

    model: {
      name: "Treasurer (the person who detected the payment)",
      time: "13/11/2026, 09:14",
      description:
        "Noticed an unauthorized payment of €4,890 from the NGO main account to GLOBAL SERVICES LTD. Called the bank immediately to block the account and reported to management and IT.",
      affected:
        "NGO main bank account and card; the funds are at risk; no beneficiary data.",
    },
  },

  fr: {
    ui: {
      brandSubtitle: "La première heure",
      navHome: "Accueil",
      navGroup: "Jeu de groupe",
      navIndividual: "Jeu individuel",
      footer: "Cybersécurité pour les ONG — Session 3 · Aucun compte · Aucune donnée stockée",

      homeEyebrow: "Cybersécurité pour les ONG · Session 3",
      homeTitle: "9:14 — La première heure",
      homeLede:
        "Un incident vient de commencer. Vous avez une heure pour le repérer, le contenir, appeler les bonnes personnes et l'écrire.",
      homeCore:
        "<strong>Message clé :</strong> En cas de doute, signalez. La rapidité et une trace écrite comptent plus que l'expertise technique.",

      groupTag: "Jeu de groupe · 12 min",
      groupTitle: "Deux scénarios. Une équipe.",
      groupText:
        "Jouez la cellule de réponse à l'incident. Le présentateur anime sur l'écran projeté, ou chaque équipe joue sur son téléphone. Même contenu, mêmes décisions.",
      presenterBtn: "Mode présentateur",
      playerBtn: "Jouer sur votre téléphone",

      individualTag: "Jeu individuel · 8 min",
      individualTitle: "Transaction bancaire frauduleuse",
      individualText:
        "Lisez le scénario et complétez la fiche d'incident : nom, heure, description, affecté. L'app donne un retour et une fiche imprimable.",
      individualBtn: "Commencer le jeu individuel",

      noAccount:
        "<strong>Aucun compte. Aucune donnée stockée.</strong> Tout se passe dans le navigateur. Utilisez le QR code de l'écran projeté pour ouvrir le mode joueur.",

      groupSelectEyebrow: "Jeu de groupe",
      groupSelectTitle: "Choisissez un scénario",
      groupSelectLede:
        "Cinq étapes par scénario. Dix points par étape. Le présentateur et les joueurs voient le même contenu.",
      presenterMode: "Mode présentateur",
      playerMode: "Mode joueur",
      teamName: "Nom de l'équipe",
      optional: "(facultatif)",
      startScenario: "Commencer le scénario",
      completed: "Terminé",
      backHome: "Retour à l'accueil",

      stepOf: "Étape {n} sur {total}",
      timeLeft: "Temps restant",
      donorTrust: "Confiance des donateurs",
      containment: "Confinement",
      presenterTip: "Conseil présentateur",
      correct: "Correct",
      partlyRight: "Partiellement correct",
      notBest: "Pas le meilleur choix",
      points: "points",
      nextStep: "Étape suivante",
      seeResult: "Voir le résultat",
      leaveScenario: "Quitter le scénario",

      scenarioResult: "Résultat du scénario",
      percentStrong: "Une première heure solide.",
      percentGood: "Un bon début ; vérifiez le débrief.",
      percentNeeds: "Utilisez le débrief pour revoir les cinq étapes.",
      yourDecisions: "Vos décisions",
      totalBoth:
        "<strong>Total des deux scénarios : {total}/100.</strong> Les deux scénarios couvrent les mêmes cinq étapes dans des contextes différents.",
      playOther: "Jouer l'autre scénario",
      backScenarios: "Retour aux scénarios",

      individualEyebrow: "Jeu individuel · 8 min",
      individualLede:
        "Lisez le scénario. Puis complétez la fiche d'incident avec quatre champs : nom, heure, description, affecté.",
      statement: "relevé",
      payment: "Paiement",
      recipient: "Bénéficiaire",
      status: "Statut",
      beforeYouWrite:
        "<strong>Avant d'écrire :</strong> appelez la banque, prévenez la direction/IT, puis consignez les faits. La fiche n'est pas une note de blâme.",
      nameLabel: "Nom",
      nameHint: "Qui a détecté ou signalé ?",
      timeLabel: "Heure",
      timeHint: "Date et heure de l'incident",
      descriptionLabel: "Description",
      descriptionHint: "Ce qui s'est passé, en une ou deux phrases",
      affectedLabel: "Affecté",
      affectedHint: "Qu'est-ce qui est affecté ?",
      namePlaceholder: "ex. Alex Martin, trésorier",
      timePlaceholder: "ex. 13/11/2026 09:14",
      descriptionPlaceholder: "Qu'avez-vous vu ? Qu'avez-vous fait ?",
      affectedPlaceholder: "ex. compte bancaire et carte de l'ONG",
      submitLog: "Envoyer la fiche d'incident",

      fieldCheck: "Vérification des champs",
      complete: "Complet",
      tooShort: "Trop court",
      addDate: "Ajoutez une date",
      addFacts: "Ajoutez des faits",
      beSpecific: "Soyez précis",
      toImprove: "À améliorer",
      allComplete:
        "<strong>Les quatre champs sont complets.</strong><p>Comparez avec le modèle pour la formulation.</p>",
      modelAnswer: "Réponse modèle",
      print: "Imprimer / enregistrer en PDF",
      tryAgain: "Réessayer",
      missing: "Manquant",
      issueName: "Ajoutez le nom de la personne qui a détecté ou signalé l'incident.",
      issueTime: "Ajoutez la date et l'heure de l'incident.",
      issueDescription:
        "Mentionnez la transaction frauduleuse, le montant (4 890 €), la banque/le compte et ce que vous avez fait.",
      issueAffected:
        "Précisez ce qui est affecté : le compte bancaire, la carte et les fonds.",

      resultEyebrow: "Jeu individuel · résultat",
      yourLogSheet: "Votre fiche d'incident",
      needsWork: "À retravailler. Utilisez le modèle ci-dessous.",
      goodStart: "Bon début. Ajoutez les détails manquants.",
      strongLog: "Fiche d'incident solide.",
      printEyebrow: "Fiche d'incident",

      from: "De",
      subject: "Objet",
      simulation: "Simulation",
      fakeLoginTitle: "Confirmez votre identité",
      fakeLoginId: "Identifiant client",
      fakeLoginPassword: "Mot de passe",
      fakeLoginButton: "Confirmer",
      fakeLoginNotice:
        "Ceci est une simulation. Cette page n'est pas la banque. N'entrez jamais vos identifiants depuis un lien reçu par email.",
    },

    scenarios: {
      phishing: {
        id: "phishing",
        label: "Scénario A",
        title: "Clic sur un lien de phishing",
        subtitle: "Des choses étranges ont commencé.",
        context: {
          type: "email",
          from: "Banque de Luxembourg <security@bank-lu.example>",
          subject: "Urgent — confirmez le paiement de 4 890 €",
          body: "Cher client, un paiement de 4 890 € attend votre confirmation. Ouvrez la facture jointe pour le valider dans les 24 heures.",
          link: "https://bank-lu.example/verify",
          attachment: "facture_2026.pdf.exe",
          footer:
            "Une bénévole clique sur le lien. Dix minutes plus tard, une fenêtre indique que les fichiers sont chiffrés.",
        },
        steps: [
          {
            title: "L'email",
            prompt: "Une bénévole reçoit cet email. Que doit-elle faire ?",
            tip: "Demandez : quels sont les trois signes ? Expéditeur, urgence, pièce jointe .exe.",
            options: [
              {
                text: "Cliquer sur le lien pour vérifier le paiement.",
                points: 0,
                quality: "bad",
                feedback:
                  "Le lien est le piège. Un clic peut installer un malware ou voler des identifiants.",
                effect: { time: -8, trust: -10, contain: 0 },
              },
              {
                text: "Le signaler à l'IT et à la boîte de phishing.",
                points: 10,
                quality: "good",
                feedback:
                  "Correct. Signalez, ne cliquez pas. L'IT peut bloquer l'expéditeur et prévenir les autres.",
                effect: { time: -2, trust: 5, contain: 1 },
              },
              {
                text: "Le supprimer sans rien dire.",
                points: 4,
                quality: "partial",
                feedback:
                  "Mieux que cliquer, mais supprimer cache la preuve. Signalez-le.",
                effect: { time: -5, trust: 0, contain: 0 },
              },
              {
                text: "Le transférer à tous les collègues pour les prévenir.",
                points: 2,
                quality: "bad",
                feedback:
                  "Le transfert propage le lien malveillant. Signalez-le à l'IT.",
                effect: { time: -6, trust: -5, contain: 0 },
              },
            ],
          },
          {
            title: "Les choses étranges",
            prompt:
              "Dix minutes plus tard, une fenêtre indique que les fichiers sont chiffrés. Que faites-vous en premier ?",
            tip: "Demandez : payer, redémarrer ou déconnecter ? Que contient les dégâts ?",
            options: [
              {
                text: "Payer la rançon.",
                points: 0,
                quality: "bad",
                feedback:
                  "Payer ne garantit pas la récupération et finance l'attaquant.",
                effect: { time: -8, trust: -15, contain: 0 },
              },
              {
                text: "Déconnecter l'ordinateur d'Internet et appeler l'IT.",
                points: 10,
                quality: "good",
                feedback:
                  "Correct. Contenez d'abord, puis appelez. N'éteignez pas l'ordinateur.",
                effect: { time: -2, trust: 5, contain: 1 },
              },
              {
                text: "Redémarrer l'ordinateur.",
                points: 2,
                quality: "partial",
                feedback:
                  "Un redémarrage peut détruire des preuves. Déconnectez et appelez l'IT.",
                effect: { time: -5, trust: 0, contain: 0 },
              },
              {
                text: "Attendre de voir ce qui se passe.",
                points: 0,
                quality: "bad",
                feedback:
                  "Chaque minute laisse le malware se propager. Agissez maintenant.",
                effect: { time: -10, trust: -10, contain: 0 },
              },
            ],
          },
          {
            title: "Les appels",
            prompt: "Qui contactez-vous ?",
            tip: "Demandez : qui appelle qui, et dans quel ordre ?",
            options: [
              {
                text: "Le support IT et CIRCL.",
                points: 10,
                quality: "good",
                feedback:
                  "Correct. L'IT contient ; CIRCL conseille. Contactez la CNPD si des données personnelles sont concernées.",
                effect: { time: -2, trust: 5, contain: 1 },
              },
              {
                text: "La banque uniquement.",
                points: 4,
                quality: "partial",
                feedback:
                  "La banque compte si l'argent est en jeu, mais l'IT et CIRCL d'abord.",
                effect: { time: -5, trust: 0, contain: 0 },
              },
              {
                text: "La police uniquement.",
                points: 4,
                quality: "partial",
                feedback:
                  "La police est utile en cas de fraude, mais l'IT et CIRCL d'abord.",
                effect: { time: -5, trust: 0, contain: 0 },
              },
              {
                text: "Personne ; l'IT s'en apercevra.",
                points: 0,
                quality: "bad",
                feedback: "La rapidité compte. Signalez maintenant.",
                effect: { time: -10, trust: -10, contain: 0 },
              },
            ],
          },
          {
            title: "La fiche",
            prompt: "Quelle entrée de fiche est complète ?",
            tip: "Demandez : quels champs manquent — nom, heure, description, affecté ?",
            options: [
              {
                text: "9:14 — quelque chose est arrivé — ordinateur.",
                points: 2,
                quality: "partial",
                feedback:
                  "Trop vague. Une fiche a besoin de qui, quoi, quand et ce qui est affecté.",
                effect: { time: -4, trust: 0, contain: 0 },
              },
              {
                text: "9:14 — Une bénévole a cliqué sur un lien de phishing ; fichiers chiffrés sur l'ordinateur financier ; IT et CIRCL appelés ; données des bénéficiaires à risque.",
                points: 10,
                quality: "good",
                feedback:
                  "Correct. Nom, heure, description, affecté et actions.",
                effect: { time: -2, trust: 5, contain: 1 },
              },
              {
                text: "C'est la faute de la bénévole.",
                points: 0,
                quality: "bad",
                feedback: "Une fiche est factuelle, pas une note de blâme.",
                effect: { time: -4, trust: -10, contain: 0 },
              },
              {
                text: "Voir l'email.",
                points: 0,
                quality: "bad",
                feedback: "Ce n'est pas une fiche. Écrivez les faits.",
                effect: { time: -6, trust: 0, contain: 0 },
              },
            ],
          },
          {
            title: "Le message",
            prompt: "Quel message aux donateurs et membres est le meilleur ?",
            tip: "Demandez : que savons-nous, que ne savons-nous pas, que faisons-nous ?",
            options: [
              {
                text: "Tout va bien.",
                points: 0,
                quality: "bad",
                feedback: "Une fausse rassurance détruit la confiance.",
                effect: { time: -2, trust: -20, contain: 0 },
              },
              {
                text: "Nous avons détecté un incident. Nous l'avons contenu et avons appelé notre prestataire IT et CIRCL. Nous vous tiendrons informés sous 24 heures. Aucune action n'est nécessaire de votre part à ce stade.",
                points: 10,
                quality: "good",
                feedback:
                  "Correct : ce qui s'est passé, ce qui est su, ce que nous faisons, la suite.",
                effect: { time: -2, trust: 10, contain: 1 },
              },
              {
                text: "Une bénévole a fait une erreur ; nous enquêtons.",
                points: 2,
                quality: "partial",
                feedback:
                  "Pas de blâme. Dites ce qui s'est passé, pas qui est en faute.",
                effect: { time: -4, trust: -5, contain: 0 },
              },
              {
                text: "Payez-nous pour récupérer vos données.",
                points: 0,
                quality: "bad",
                feedback: "Jamais. Ce n'est pas une stratégie de communication.",
                effect: { time: -2, trust: -25, contain: 0 },
              },
            ],
          },
        ],
      },

      laptop: {
        id: "laptop",
        label: "Scénario B",
        title: "Ordinateur volé",
        subtitle: "Un ordinateur avec des données de bénéficiaires a disparu.",
        context: {
          type: "note",
          title: "Le vol",
          body: "L'ordinateur d'un membre du personnel a été volé dans une voiture. Il contient la liste des bénéficiaires et le dossier financier.",
          details: [
            "Liste des bénéficiaires : 240 noms, adresses et numéros de téléphone",
            "Dossier financier : relevés bancaires et factures",
            "Ordinateur : pas de chiffrement complet du disque",
          ],
        },
        steps: [
          {
            title: "Le vol",
            prompt: "L'ordinateur a disparu. Que faites-vous en premier ?",
            tip: "Demandez : quel est le vrai risque — l'appareil ou les données ?",
            options: [
              {
                text: "Attendre que l'ordinateur revienne.",
                points: 0,
                quality: "bad",
                feedback: "Les données sont à risque maintenant. N'attendez pas.",
                effect: { time: -10, trust: -10, contain: 0 },
              },
              {
                text: "Le signaler à l'IT, effacer l'ordinateur à distance et changer les mots de passe.",
                points: 10,
                quality: "good",
                feedback: "Correct. Contenez d'abord le risque sur les données.",
                effect: { time: -2, trust: 5, contain: 1 },
              },
              {
                text: "Acheter un nouvel ordinateur.",
                points: 2,
                quality: "partial",
                feedback:
                  "Un nouvel ordinateur ne protège pas les données. Signalez et effacez d'abord.",
                effect: { time: -5, trust: 0, contain: 0 },
              },
              {
                text: "Publier le numéro de série sur les réseaux sociaux.",
                points: 0,
                quality: "bad",
                feedback:
                  "Cela peut exposer l'incident et aider le voleur.",
                effect: { time: -4, trust: -10, contain: 0 },
              },
            ],
          },
          {
            title: "Les données",
            prompt: "Qu'est-ce qui est affecté ?",
            tip: "Demandez : quelles données étaient sur l'ordinateur, et sont-elles personnelles ?",
            options: [
              {
                text: "Seulement l'ordinateur.",
                points: 0,
                quality: "bad",
                feedback: "Les données sont le vrai risque, pas l'appareil.",
                effect: { time: -6, trust: -10, contain: 0 },
              },
              {
                text: "La liste des bénéficiaires et le dossier financier ; des données personnelles peuvent être exposées.",
                points: 10,
                quality: "good",
                feedback: "Correct. Évaluez les données, pas seulement l'appareil.",
                effect: { time: -2, trust: 5, contain: 1 },
              },
              {
                text: "Rien, l'ordinateur était chiffré.",
                points: 2,
                quality: "partial",
                feedback:
                  "Vérifiez : le scénario dit qu'il n'y a pas de chiffrement complet.",
                effect: { time: -5, trust: 0, contain: 0 },
              },
              {
                text: "Le bâtiment.",
                points: 0,
                quality: "bad",
                feedback: "Non. Concentrez-vous sur les données de l'ordinateur.",
                effect: { time: -4, trust: 0, contain: 0 },
              },
            ],
          },
          {
            title: "Les appels",
            prompt: "Qui contactez-vous ?",
            tip: "Demandez : qui gère le vol, le risque données et l'obligation de protection des données ?",
            options: [
              {
                text: "L'IT, la police, CIRCL et la CNPD si des données personnelles sont concernées.",
                points: 10,
                quality: "good",
                feedback:
                  "Correct. Signalez le vol, contenez le risque, demandez conseil, évaluez la protection des données.",
                effect: { time: -2, trust: 5, contain: 1 },
              },
              {
                text: "La police uniquement.",
                points: 4,
                quality: "partial",
                feedback:
                  "La police gère le vol ; l'IT et CIRCL gèrent le risque données.",
                effect: { time: -5, trust: 0, contain: 0 },
              },
              {
                text: "L'assurance uniquement.",
                points: 4,
                quality: "partial",
                feedback:
                  "L'assurance est utile, mais ce n'est pas le premier appel.",
                effect: { time: -5, trust: 0, contain: 0 },
              },
              {
                text: "Personne.",
                points: 0,
                quality: "bad",
                feedback: "Signalez maintenant.",
                effect: { time: -10, trust: -10, contain: 0 },
              },
            ],
          },
          {
            title: "La fiche",
            prompt: "Quelle entrée de fiche est complète ?",
            tip: "Demandez : quels champs manquent — nom, heure, description, affecté ?",
            options: [
              {
                text: "Ordinateur volé.",
                points: 2,
                quality: "partial",
                feedback:
                  "Trop vague. Une fiche a besoin de qui, quoi, quand et ce qui est affecté.",
                effect: { time: -4, trust: 0, contain: 0 },
              },
              {
                text: "14:20 — Ordinateur d'un membre du personnel volé dans une voiture ; liste des bénéficiaires et dossier financier dessus ; effacement à distance demandé ; IT, police et CIRCL informés ; CNPD à évaluer.",
                points: 10,
                quality: "good",
                feedback:
                  "Correct. Nom, heure, description, affecté et actions.",
                effect: { time: -2, trust: 5, contain: 1 },
              },
              {
                text: "Demander au membre du personnel de payer.",
                points: 0,
                quality: "bad",
                feedback: "Pas de blâme ; consignez les faits.",
                effect: { time: -4, trust: -10, contain: 0 },
              },
              {
                text: "Pas besoin de fiche.",
                points: 0,
                quality: "bad",
                feedback: "Si ce n'est pas écrit, ça n'existe pas.",
                effect: { time: -6, trust: 0, contain: 0 },
              },
            ],
          },
          {
            title: "Le message",
            prompt: "Quel message aux bénéficiaires est le meilleur ?",
            tip: "Demandez : que savons-nous, que ne savons-nous pas, que faisons-nous ?",
            options: [
              {
                text: "Vos données sont en sécurité.",
                points: 0,
                quality: "bad",
                feedback: "Vous ne le savez pas encore.",
                effect: { time: -2, trust: -20, contain: 0 },
              },
              {
                text: "Nous avons connaissance du vol d'un ordinateur. Nous avons pris des mesures pour protéger les données et informé les autorités. Nous vous contacterons si vos données sont concernées.",
                points: 10,
                quality: "good",
                feedback: "Correct : factuel, actions, prochaine étape.",
                effect: { time: -2, trust: 10, contain: 1 },
              },
              {
                text: "C'est la faute du membre du personnel.",
                points: 0,
                quality: "bad",
                feedback: "Pas de blâme.",
                effect: { time: -2, trust: -15, contain: 0 },
              },
              {
                text: "Nous ne pouvons pas commenter.",
                points: 2,
                quality: "partial",
                feedback:
                  "Le silence érode la confiance. Dites ce que vous savez et ce que vous faites.",
                effect: { time: -2, trust: -8, contain: 0 },
              },
            ],
          },
        ],
      },
    },

    bank: {
      account: "Compte principal de l'ONG",
      date: "13/11/2026",
      time: "09:14",
      amount: "4 890,00 €",
      recipient: "GLOBAL SERVICES LTD",
      status: "Effectué",
      note: "Vous n'avez pas autorisé ce paiement. Le trésorier vous appelle.",
    },

    model: {
      name: "Trésorier (la personne qui a détecté le paiement)",
      time: "13/11/2026, 09:14",
      description:
        "J'ai remarqué un paiement non autorisé de 4 890 € depuis le compte principal de l'ONG vers GLOBAL SERVICES LTD. J'ai appelé immédiatement la banque pour bloquer le compte et prévenu la direction et l'IT.",
      affected:
        "Compte bancaire principal et carte de l'ONG ; les fonds sont à risque ; aucune donnée de bénéficiaire.",
    },
  },
};
