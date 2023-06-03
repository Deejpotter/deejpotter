import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {RepoObject} from 'src/app/shared/models/RepoObject';

export abstract class BaseRepository<T extends RepoObject> {
  protected static readonly baseUrl = '/.netlify/functions/mongoCrud';

  protected constructor(protected http: HttpClient, protected collectionName: string) {
  }

  find(searchCriteria: Partial<T>, headers?: HttpHeaders): Observable<T[]> {
    const params = new HttpParams({fromObject: searchCriteria as { [param: string]: string }})
      .set('collection', this.collectionName);
    return this.http.get<T[]>(`${BaseRepository.baseUrl}`, {params, headers});
  }

  add(entity: T, headers?: HttpHeaders): Observable<T> {
    return this.http.post<T>(`${BaseRepository.baseUrl}?collection=${this.collectionName}`, entity, {headers});
  }

  update(entity: T, headers?: HttpHeaders): Observable<T> {
    const params = new HttpParams()
      .set('collection', this.collectionName)
      .set('_id', entity._id);
    return this.http.put<T>(`${BaseRepository.baseUrl}`, entity, {
      params,
      headers: headers ?? new HttpHeaders({'Content-Type': 'application/json'}),
    });
  }

  delete(id: string, headers?: HttpHeaders): Observable<void> {
    const params = new HttpParams()
      .set('collection', this.collectionName)
      .set('id', id);
    return this.http.delete<void>(`${BaseRepository.baseUrl}`, {params, headers});
  }
}
