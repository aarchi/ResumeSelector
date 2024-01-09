// pdf.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PdfService {
  private baseUrl = 'http://localhost:5001'; // Change to your Flask server URL

  constructor(private http: HttpClient) { }

  extractTextFromPDF(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    const headers = new HttpHeaders();
    // Ensure the headers are set correctly based on your needs
    // headers.set('Authorization', 'Bearer YOUR_ACCESS_TOKEN');

    return this.http.post(`${this.baseUrl}/extract_text`, formData, { headers });
  }
}
