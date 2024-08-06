import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { AppLayoutComponent } from './layout/app.layout.component';

const routes: Routes = [
    {
        path: 'app', component: AppLayoutComponent,
        children: [
            { path: 'dashboard', loadChildren: () => import('./views/dashboard/dashboard.module').then(m => m.DashboardModule) },
            { path: 'case', data: { breadcrumb: 'Case' }, loadChildren: () => import('./views/case/case.module').then(m => m.CaseModule) },
            { path: 'case-form', data: { breadcrumb: 'Case Form' }, loadChildren: () => import('./views/case-form/case-form-.module').then(m => m.CaseFormModule) },
            { path: 'configuration', data: { breadcrumb: 'Configuration' }, loadChildren: () => import('./views/configuration/configuration.module').then(m => m.ConfigurationModule) },
            { path: 'configuration-form', data: { breadcrumb: 'Configuration Form' }, loadChildren: () => import('./views/configuration-form/configuration-form.module').then(m => m.ConfigurationFormModule) },
            { path: 'encoding', data: { breadcrumb: 'Encoding' }, loadChildren: () => import('./views/encoding/encoding.module').then(m => m.EncodingModule) },
            { path: 'ingestion', data: { breadcrumb: 'Ingestion' }, loadChildren: () => import('./views/ingestion/ingestion.module').then(m => m.IngestiongModule) },
            { path: 'projection', data: { breadcrumb: 'Projection' }, loadChildren: () => import('./views/projection/projection.module').then(m => m.ProjectionModule) },
            { path: 'user', data: { breadcrumb: 'User' }, loadChildren: () => import('./views/user/user.module').then(m => m.UserModule) },
            { path: 'user-form', data: { breadcrumb: 'User Form' }, loadChildren: () => import('./views/user-form/user-form.module').then(m => m.UserFormModule) },
        ]
    },
    { path: '', data: { breadcrumb: 'Auth' }, loadChildren: () => import('./demo/components/auth/auth.module').then(m => m.AuthModule) },
    { path: 'notfound', loadChildren: () => import('./demo/components/notfound/notfound.module').then(m => m.NotfoundModule) },
    { path: '**', redirectTo: '/notfound' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
