import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class ApiService {
  constructor(private http: HttpClient) {}

  private server = "http://localhost:4444/api";

  getDashboard() {
    return this.http.get<any>(`${this.server}/dashboard`);
  }

  selectAll(table: string) {
    return this.http.get<any[]>(`${this.server}/${table}`);
  }

  getById(table: string, id: number) {
    return this.http.get<any>(`${this.server}/${table}/${id}`);
  }

  insert(table: string, data: any) {
    return this.http.post<any>(`${this.server}/${table}`, data);
  }

  update(table: string, id: number, data: any) {
    return this.http.put<any>(`${this.server}/${table}/${id}`, data);
  }

  delete(table: string, id: number) {
    return this.http.delete<any>(`${this.server}/${table}/${id}`);
  }
}
