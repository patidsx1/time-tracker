import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';
import { TimeTrackerService } from './services/time-tracker.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { TimeTrackerComponent } from './time-tracker/time-tracker.component';

@NgModule({
  declarations: [
    AppComponent
    ,TimeTrackerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    CommonModule
  ],
  providers: [TimeTrackerService],
  bootstrap: [AppComponent]
})
export class AppModule { }
