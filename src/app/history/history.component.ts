import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-history',
  imports: [CommonModule],
  templateUrl: './history.component.html',
  styleUrl: './history.component.scss'
})
export class HistoryComponent {
 history = [
    {
      filename: "requirements.txt",
      date: "May 10, 2025",
      type: "User Stories",
    },
    {
      filename: "interview.mp3",
      date: "May 9, 2025",
      type: "Test Cases",
    },
    {
      filename: "product-demo.mp4",
      date: "May 8, 2025",
      type: "Custom Format",
    },
  ]
}
