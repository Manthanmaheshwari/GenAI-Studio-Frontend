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
    // 1. Yahan additionalInstructions add kiya hai terminal error fix karne ke liye
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
      this.selectedFile = file; // UI mein file name dikhane ke liye
      this.form.patchValue({ file: file }); // Form control update karne ke liye
    }
  }

  onFileSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      this.selectedFile = file; // UI update
      this.form.patchValue({ file: file }); // Form update
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

    // API Call
    this.http.post<any>('https://localhost:7234/Upload', formData).subscribe({
      next: (res) => {
        // Backend se jo response property aa rahi hai use check karein (content ya result)
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