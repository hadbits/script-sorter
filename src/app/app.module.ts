import 'reflect-metadata';
import '../polyfills';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';

import { AppRoutingModule } from './app-routing.module';

// NG Translate
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';


import { HomeModule } from './home/home.module';

import { AppComponent } from './app.component';


import { WebviewDirective } from './directives/webview.directive';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import {
  MatToolbarModule,
  MatButtonModule,
  MatSidenavModule,
  MatIconModule,
  MatListModule,
  MatCardModule,
  MatGridListModule,
  MatMenuModule,
  MatInputModule,
  MatButtonToggleModule,
  MatCheckboxModule,
  MatTableModule,
  MatTableDataSource,
  MatTabsModule,
  MatSelectModule
} from '@angular/material';

import { HomeComponent } from './components/home/home.component';
import { MyDashboardComponent } from './components/my-dashboard/my-dashboard.component';
import { KeywordViewComponent } from './components/keyword-view/keyword-view.component';
import { HeaderToolbarComponent } from './components/header-toolbar/header-toolbar.component';
import { TranscriptionDataService } from './providers/transcription-data.service';
import { SearchComponent } from './components/search/search.component';



// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    WebviewDirective,
    MyDashboardComponent,
    KeywordViewComponent,
    HeaderToolbarComponent,
    SearchComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (HttpLoaderFactory),
        deps: [HttpClient]
      }
    }),
    BrowserAnimationsModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatCardModule,
    MatGridListModule,
    MatMenuModule,
    MatInputModule,
    MatButtonToggleModule,
    MatCheckboxModule,
    MatTableModule,
    MatTabsModule,
    MatSelectModule,
    ReactiveFormsModule,
    //MatTableDataSource
  ],
  providers: [
    TranscriptionDataService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

