import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// import { AppComponent } from './app.component';
import { TransactionsComponent } from './components/transactions/transactions.component';
import { HomeComponent } from './components/home/home.component';
import { VerticalBarchartComponent } from './components/vertical-barchart/vertical-barchart.component';

const routes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'transactions', component: TransactionsComponent},
  { path: 'vertical', component: VerticalBarchartComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
