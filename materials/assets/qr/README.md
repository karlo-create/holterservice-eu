# QR assets

One scannable QR code, generated once and committed so the print build needs no
extra dependency. There is deliberately only one: separate App Store and Google
Play codes were removed because those listings do not exist, and a code under a
platform icon that resolves somewhere else is worse than no code.

Target: `qr-upute.svg` -> https://holterservice.eu/za-pacijente

To regenerate after the target URL changes:

```
npm i -D qrcode
node -e "
const QR=require('qrcode'),fs=require('fs');
QR.toString('https://holterservice.eu/za-pacijente',{type:'svg',errorCorrectionLevel:'M',margin:0})
  .then(s=>fs.writeFileSync('materials/assets/qr/qr-upute.svg',
    s.replace('#000000','#111827').replace('fill=\"#ffffff\"','fill=\"none\"')));"
```
