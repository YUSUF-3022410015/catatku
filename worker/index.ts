export interface Env {
  DB: any;
  ASSETS: any;
}

export default {
  async fetch(request: Request, env: Env, ctx: any): Promise<Response> {
    const url = new URL(request.url);

    // API Routing dasar
    if (url.pathname.startsWith('/api/health')) {
      return new Response(JSON.stringify({ status: 'ok', time: new Date().toISOString() }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Static Assets Fallback
    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    return new Response('CatatKu Worker Active', { status: 200 });
  },

  async scheduled(event: any, env: Env, ctx: any): Promise<void> {
    console.log('Cron triggered at:', new Date().toISOString());
    // spike / logika pengingat akan ditambahkan di Milestone 3
  },
};
