import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.scss',
  providers: [HttpClient],
})
export class UploadComponent {
  form: FormGroup;
  isDragging = false;
  selectedFile: File | null = null;
  generatedContent = "";

  constructor(private fb: FormBuilder, private http: HttpClient) {
    // Initialize additionalInstructions in the form group to prevent validation or model binding issues
    this.form = this.fb.group({
      file: [null],
      outputType: ['userStories'], 
      additionalInstructions: [''] 
    });
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave() {
    this.isDragging = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    if (event.dataTransfer?.files.length) {
      const file = event.dataTransfer.files[0];
      this.selectedFile = file; // Set reference to display selected filename in template
      this.form.patchValue({ file: file }); // Update form control value
    }
  }

  onFileSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      this.selectedFile = file; // Update selected file reference for UI
      this.form.patchValue({ file: file }); // Update form control value
    }
  }

  removeFile(): void {
    this.selectedFile = null;
    this.form.patchValue({ file: null });
  }

  generateContent() {
    // Validate if file exists
    if (!this.selectedFile) {
      alert("Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('outputType', this.form.get('outputType')?.value);
    formData.append('additionalInstructions', this.form.get('additionalInstructions')?.value);

    this.generatedContent = "Processing your file, please wait...";

    // Perform POST request to upload endpoint
    this.http.post<any>('https://localhost:7234/Upload', formData).subscribe({
      next: (res) => {
        // Check for content/result property returned from backend API
        this.generatedContent = res.content || res.result || "Content generated successfully!";
      },
      error: (err) => {
        console.error("API Error:", err);
        alert('Error generating content. Check if backend is running on port 7234.');
        this.generatedContent = "";
      }
    });
  }
}