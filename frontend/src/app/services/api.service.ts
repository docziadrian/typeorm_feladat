import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class ApiService {
  constructor(private http: HttpClient) {}

  private server = "http://localhost:3000";

  selectAll(table: string) {
    return this.http.get(`${this.server}/${table}`);
  }

  delete(table: string, id: string) {
    return this.http.delete(`${this.server}/${table}/${id}`);
  }

  insert(table: string, data: any) {
    return this.http.post(`${this.server}/${table}`, data);
  }

  update(table: string, id: string, data: any) {
    return this.http.patch(`${this.server}/${table}/${id}`, data);
  }

  getById(table: string, id: string) {
    return this.http.get(`${this.server}/${table}/${id}`);
  }
}
