# QR assets

Generated once and committed so the print build needs no extra dependency.

To regenerate after the target URLs change:

```
npm i -D qrcode
node -e "
const QR=require('qrcode'),fs=require('fs');
const jobs=[['qr-upute.svg','<URL>'],['qr-app-ios.svg','<URL>'],['qr-app-android.svg','<URL>']];
(async()=>{for(const [f,u] of jobs){
  let s=await QR.toString(u,{type:'svg',errorCorrectionLevel:'M',margin:0});
  s=s.replace('#000000','#111827').replace('fill=\"#ffffff\"','fill=\"none\"');
  fs.writeFileSync('materials/assets/qr/'+f,s);
}})();"
```

Current targets (all three, pending founder decision on real destinations):
- `qr-upute.svg` -> https://holterservice.eu/za-pacijente
- `qr-app-ios.svg` -> https://holterservice.eu/za-pacijente
- `qr-app-android.svg` -> https://holterservice.eu/za-pacijente
