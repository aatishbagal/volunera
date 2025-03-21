import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'volunera';
  
  ngOnInit() {
    // Add scroll event listener for navbar color change
    window.addEventListener('scroll', this.handleScroll);
    
    // Load Font Awesome icons
    this.loadFontAwesome();
  }
  
  handleScroll = () => {
    const navbar = document.querySelector('.navbar-container') as HTMLElement;
    
    if (window.scrollY > 50) {
      navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
      navbar.style.padding = '8px 30px';
    } else {
      navbar.style.backgroundColor = '#ffffff';
      navbar.style.padding = '10px 30px';
    }
  }
  
  loadFontAwesome() {
    // Create a link element for Font Awesome
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css';
    document.head.appendChild(link);
  }
}