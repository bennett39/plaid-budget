import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class TransactionsService {

  constructor(private http: HttpClient) { }

  getTransactions() {
    // httpOptions.headers = httpOptions.headers.set('ACCESS_TOKEN', 'access-sandbox-f6e1668b-7bcc-4d94-87c3-7058b183ed12');
    return this.http.get('http://127.0.0.1:8000/plaid/transactions')
      .pipe(tap(response => response));
  }

}
