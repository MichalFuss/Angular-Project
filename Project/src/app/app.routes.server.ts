import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'projects/:id',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => {
      // Return empty array to skip prerendering this dynamic route
      return [];
    }
  },
  {
    path: 'tasks/:projectId',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => {
      // Return empty array to skip prerendering this dynamic route
      return [];
    }
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
