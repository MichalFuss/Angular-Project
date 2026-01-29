import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'projects/:id',
    renderMode: RenderMode.SSR
  },
  {
    path: 'tasks/:projectId',
    renderMode: RenderMode.SSR
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
