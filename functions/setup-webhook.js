const CONFIG = {
  TELEGRAM_BOT_TOKEN: '8741726555:AAFrsGEsYrDYDIzWjMZd4aQxMrz_paL3Sog'
};

export async function onRequestGet(context) {
  const url = new URL(context.request.url);
  const webhookUrl = `${url.origin}/api/telegram-webhook`;
  
  const tgRes = await fetch(`https://api.telegram.org/bot${CONFIG.TELEGRAM_BOT_TOKEN}/setWebhook?url=${encodeURIComponent(webhookUrl)}`);
  const tgData = await tgRes.json();
  
  return new Response(JSON.stringify({
    success: true,
    webhookUrl: webhookUrl,
    telegramResponse: tgData
  }, null, 2), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' }
  });
}
