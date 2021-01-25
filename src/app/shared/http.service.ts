import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
// import { MatSnackBar } from '@angular/material';
import { Observable, throwError, ObservableInput, BehaviorSubject, } from 'rxjs/index';
import { map, tap, timeout, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  token = '';
  public serverUrl = '';

  private loggedIn = new BehaviorSubject<boolean>(true);

  getIsLoggedIn = this.loggedIn.asObservable();


  constructor(private http: HttpClient) {
    this.serverUrl = environment.api;
  }

  httpGet(
    queryUrl: string,
    myparams: any,
    showSnack = true,
    showProgress = true
  ): Observable<any> {
    const url = this.serverUrl + queryUrl;

    console.log('login', queryUrl, 'params', myparams)
    return this.http
      .get(url, {
        headers: {
          // 'x-auth-token': localStorage.getItem('token'),
          'X-Requested-With': 'XMLHttpRequest'
        },
        params: myparams
      })
      .pipe(
        tap((data: any) => {
          if (data.status === 0) {
            return data.data;
          }
        }),
        catchError((error: any) => {
          if (error.status === 401) {


            return null;
          } else {
            if (showSnack) {
              const err = this.handleError(error);
              return throwError(err);
            } else {
              return null;
            }
          }
        })
      );
  }


  httpFileUpload(queryUrl: string, file: File): Observable<any> {
    const formData: FormData = new FormData();

    formData.append("file", file, file.name);
    const url = this.serverUrl + queryUrl;
    const options = {
      headers: new HttpHeaders({
        Accept: "application/json",
        // "x-auth-token": localStorage.getItem("token")
      })
    };
    return this.http.post(url, formData, options).pipe(
      tap((response: any) => {
        if (response.status === 0) {
          return response.data;
        } else {
          return null;
        }
      }),
      catchError(
        (error, caught): ObservableInput<any> => {


          return throwError(error);

        },
      ),
    );
  }



  httpPost(queryUrl: string, object: any, param: any, showSnack = true
  ): Observable<any> {

    const body = JSON.stringify(object);
    const url = this.serverUrl + queryUrl;
    // this.token = localStorage.getItem('token');
    // const token = localStorage.getItem('jwt');

    // console.log(body, url);
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        // 'X-Requested-With': 'XMLHttpRequest',
        // 'Authorization': 'bearer ' + token
      }),
      params: param
    };

    return this.http.post(url, body, options).pipe(
      tap((response: any) => {

        console.log(response)
        if (response.status === 0) {
          if (showSnack) {
            this.openSnack(response.description, 'OK');
          }
          return response;
        } else if (response.status === 500) {

          this.openSnack('There was error processing request!!', 'OK');
          // this.silentLogin().subscribe(res => { });
          return false;
        } else {
          if (showSnack) {
            if (response.description != null) {
              this.openSnack(response.description, 'OK');
            }
          }
          return false;
        }
      }),
      // catchError(this.handleError())
      catchError((error: any) => {

        if (error.status === 500) {
          this.openSnack('There was error processing request!!', 'OK');
          return throwError(error);
        }
        return throwError(error);
      })
    );
  }


  openSnack(message: string, label: string) {
    // this.snackBar.open(message, label, {
    //   duration: 2000
    // });
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      this.openSnack('Failed. Try again.', 'OK');
      return throwError(result);
    };
  }


  fileUpload(fileItem: File, path: string): any {
    let apiCreateEndpoint =
      this.serverUrl + path;
    const formData: FormData = new FormData();

    formData.append("uploadFile", fileItem);

    const options = {
      headers: new HttpHeaders({
        // 'Content-Type': 'multipart/form-data',
      }),
    };

    return this.http.post(apiCreateEndpoint, formData, options).pipe(
      tap((response: any) => {

        if (response.status === 0) {
          return response;
        } else if (response.status === 500) {
          this.openSnack('There was error processing request!!', 'OK');
          return false;
        } else {
          return false;
        }
      }),
      // catchError(this.handleError())
      catchError((error: any) => {
        if (error.status === 500) {
          this.openSnack('There was error processing request!!', 'OK');
          return throwError(error);
        }
      })
    );
  }

  httpDelete(
    queryUrl: string,
    myparams: any,
    showSnack = true,
    showProgress = true
  ): Observable<any> {
    const url = this.serverUrl + queryUrl;

    // console.log('login', queryUrl, 'params', myparams)
    return this.http
      .delete(url, {
        headers: {
          // 'x-auth-token': localStorage.getItem('token'),
          // 'X-Requested-With': 'XMLHttpRequest'
        },
        params: myparams
      })
      .pipe(
        tap((data: any) => {
          if (data.status === 0) {
            return data.data;
          }
        }),
        catchError((error: any) => {
          if (error.status === 401) {


            return null;
          } else {
            if (showSnack) {
              const err = this.handleError(error);
              return throwError(err);
            } else {
              return null;
            }
          }
        })
      );
  }

  isLoggedIn() {
    console.log(!!sessionStorage.getItem('isLogged'))
    return !!sessionStorage.getItem('isLogged');
  }
  setLoggedInVal(value: boolean) {
    this.loggedIn.next(value);
  }
  get findIsLoggedIn() {
    return this.loggedIn.asObservable();
  }
}
