import { HomeComponent } from './components/home/home.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { KeywordViewComponent } from './components/keyword-view/keyword-view.component';

const routes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    {
        path: 'view-file', 
        component: KeywordViewComponent
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {useHash: true})],
    exports: [RouterModule]
})
export class AppRoutingModule { }
