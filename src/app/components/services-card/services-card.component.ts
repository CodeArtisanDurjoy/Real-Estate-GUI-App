import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-services-card',
  templateUrl: './services-card.component.html',
  styleUrl: './services-card.component.css',
})
export class ServicesCardComponent {
  @Input() imageUrl: string = 'https://picsum.photos/800/300?random=1';
  @Input() title: string = 'lorem';
  @Input() description: string = 'lorem lorem lorem';
}
