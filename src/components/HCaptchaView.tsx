import React from 'react';
import {WebView} from 'react-native-webview';

interface Props {
  onVerify: (token: string) => void;
}

export default function HCaptchaView({onVerify}: Props) {
  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <script src="https://js.hcaptcha.com/1/api.js" async defer></script>
  </head>
  <body style="display:flex;justify-content:center;align-items:center;height:100vh;">
    <div class="h-captcha"
      data-sitekey="YOUR_HCAPTCHA_SITE_KEY"
      data-callback="onVerify">
    </div>

    <script>
      function onVerify(token) {
        window.ReactNativeWebView.postMessage(token);
      }
    </script>
  </body>
  </html>
  `;

  return (
    <WebView
      originWhitelist={['*']}
      source={{html}}
      style={{height: 120}}
      onMessage={event => {
        const token = event.nativeEvent.data;
        onVerify(token);
      }}
    />
  );
}
