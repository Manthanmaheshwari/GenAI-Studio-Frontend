import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: "",
    loadComponent: () => import("./home/home.component").then((m) => m.HomeComponent),
  },
  {
    path: "upload",
    loadComponent: () => import("./upload/upload.component").then((m) => m.UploadComponent),
  },
  {
    path: "history",
    loadComponent: () => import("./history/history.component").then((m) => m.HistoryComponent),
  },
  {
    path: "**",
    redirectTo: "",
  },
]

