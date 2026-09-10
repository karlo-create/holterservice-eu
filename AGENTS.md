# AGENTS.md — holterservice-eu

Pravila rada za agente u ovom repozitoriju. Procitaj prije nego sto napravis
prvi commit ili deploy.

## Deploy: merganje u `main`

**`main` je Vercel produkcijska grana. Svaki push na `main` sam po sebi okida
produkcijski build i objavljuje ga na produkciju.**

Deploy se dakle radi **merganjem u `main`**. Nema zasebnog koraka "sad
deployaj" — merge JE deploy.

```bash
git checkout main
git pull origin main
git merge --no-ff eng/VEY-XXX-opis
git push origin main        # <- ovo je produkcijski deploy
```

### Ne koristi `vercel --prod` s feature grane

`vercel --prod` s vrha feature grane gura build u istu produkcijsku povrsinu,
ali **zaobilazi `main`**. Time nastaju dva puta koja pisu u istu produkciju i
razidju se cim netko CLI-deploya granu a ne merga je.

Ne radi to. Jedini deploy put je merge u `main`.

<details>
<summary>Zasto — sto se stvarno dogodilo 2026-09-10</summary>

Produkcija je danima bila odrzavana `vercel --prod` deployevima s feature
grana, pa je `main` zaostao. Vercel deploy log:

| vrijeme (UTC) | izvor | grana | commit |
| --- | --- | --- | --- |
| 09:31:15Z | git | `main` | `0e302a5` |
| 09:34:04Z | cli | — | — |
| 10:22:02Z | cli | — | — |
| 11:29:58Z | cli | — | — |
| 11:38:19Z | cli | `eng/VEY-912-o-nama-split` | `26b8b80` |
| 11:50:40Z | git | `main` | `26b8b80` |

Unos u 09:31:15Z je poanta: `main` je tada bio zastario, i bio je **jedan push
udaljen** od toga da automatski deploya stari build preko aktualne produkcije.
Nitko taj push ne bi morao namjerno napraviti — dovoljan je bilo koji rutinski
merge u `main`.

Od 11:50:40Z su `main` i produkcija ponovno isti (`26b8b80`) i taj deploy je
dosao iz git integracije, ne iz CLI-ja. Odrzavamo to tako.
</details>

## Granaj s `main`

**Granaj s `main`.**

```bash
git fetch origin
git checkout -b eng/VEY-XXX-opis origin/main
```

### Ispravak starog pravila

Do 2026-09-10 je vrijedilo pravilo **"nikad ne granaj s `main`, zastario je"**.
To je bilo tocno dok je produkcija isla preko `vercel --prod`, jer je `main`
tada stvarno zaostajao za onim sto je bilo na produkciji.

**To pravilo je sada obrnuto i slijediti ga bi bio bug.** Od 11:50:40Z
2026-09-10 je `main` produkcijska loza i granati s bilo cega drugog znaci
granati s neceg sto nije na produkciji.

Ako naletis na stari savjet u nekom starom komentaru na tiketu ili u nasljedjenom
checkoutu — zanemari ga, ovaj dokument ga zamjenjuje.

## Nasljedjeni checkouti

`~/holterservice-eu` je klon koji dijele svi agenti. Prije rada:

```bash
cd ~/holterservice-eu
git status              # provjeri da ga netko drugi ne koristi
git fetch origin
git checkout main && git pull origin main
```

Ostavi ga na `main` i s cistim `git status` kad zavrsis, da ga sljedeci agent
ne naslijedi na tudjoj grani. Za vlastiti rad koristi `git worktree add` umjesto
da preuzmes dijeljeni checkout.

## Razidjene grane

Na originu stoji vise grana koje nisu mergane u `main`. **Ne brisi ih.** Nose
nemergan rad ciji su tiketi jos otvoreni — npr. `eng/VEY-633-knjizica-pacijent`
(VEY-629) ceka founderovu odluku. Brisanje bi unistilo rad koji jos nije
odlucen.
