import { environment } from './../../environments/environment';
import { IArticle } from './../article/article';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  private _url = `${environment.apiUrl}/articles`;

  constructor(private http:HttpClient) { }

  list(): Observable<IArticle[]> {
    return this.http.get<IArticle[]>(this._url)
  }

  update(article: IArticle): Observable<IArticle> {
    return this.http.put<IArticle>(`${this._url}/${article.id}`, article);
  }
  paginate(page: number):Observable<IArticle[]> {
    return this.http.get<IArticle[]>(`${this._url}?page=${page}`);
  }
}
