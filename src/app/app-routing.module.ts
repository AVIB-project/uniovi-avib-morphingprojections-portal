import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { AuthGuard } from './shared/services/auth-guard.service';

import { AppLayoutComponent } from './layout/app.layout.component';

const routes: Routes = [
    {
        path: '', component: AppLayoutComponent,
        children: [
            { path: '', data: { breadcrumb: 'Dashboard' }, canActivate: [AuthGuard], loadChildren: () => import('./views/dashboard/dashboard.module').then(m => m.DashboardModule) },
            { path: 'case', data: { breadcrumb: 'Case', roles: ['ADMIN', 'USER'] }, canActivate: [AuthGuard], loadChildren: () => import('./views/case/case.module').then(m => m.CaseModule) },
            { path: 'case-form', data: { breadcrumb: 'Case Form', roles: ['ADMIN', 'USER'] }, canActivate: [AuthGuard], loadChildren: () => import('./views/case-form/case-form.module').then(m => m.CaseFormModule) },
            { path: 'configuration', data: { breadcrumb: 'Annotation', roles: ['ADMIN', 'USER'] }, canActivate: [AuthGuard], loadChildren: () => import('./views/configuration/configuration.module').then(m => m.ConfigurationModule) },
            { path: 'configuration-form', data: { breadcrumb: 'Annotation Form', roles: ['ADMIN', 'USER'] }, canActivate: [AuthGuard], loadChildren: () => import('./views/configuration-form/configuration-form.module').then(m => m.ConfigurationFormModule) },
            { path: 'encoding', data: { breadcrumb: 'Projection', roles: ['ADMIN', 'USER'] }, canActivate: [AuthGuard], loadChildren: () => import('./views/encoding/encoding.module').then(m => m.EncodingModule) },
            { path: 'ingestion', data: { breadcrumb: 'Ingestion', roles: ['ADMIN', 'USER'] }, canActivate: [AuthGuard], loadChildren: () => import('./views/ingestion/ingestion.module').then(m => m.IngestiongModule) },
            { path: 'ingestion-form', data: { breadcrumb: 'Ingestion Form', roles: ['ADMIN', 'USER'] }, canActivate: [AuthGuard], loadChildren: () => import('./views/ingestion-form/ingestion-form.module').then(m => m.IngestionFormModule) },
            { path: 'projection', data: { breadcrumb: 'Projection' }, canActivate: [AuthGuard], loadChildren: () => import('./views/projection/projection.module').then(m => m.ProjectionModule) },
            { path: 'user', data: { breadcrumb: 'User' }, canActivate: [AuthGuard], loadChildren: () => import('./views/user/user.module').then(m => m.UserModule) },
            { path: 'user-form', data: { breadcrumb: 'User Form', roles: ['ADMIN', 'USER'] }, canActivate: [AuthGuard], loadChildren: () => import('./views/user-form/user-form.module').then(m => m.UserFormModule) },
        ]
    },
    { path: 'notfound', loadChildren: () => import('./demo/components/notfound/notfound.module').then(m => m.NotfoundModule) },
    { path: '**', redirectTo: '/notfound' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
