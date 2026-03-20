import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
  closeDrawerIfMobile(drawer: HTMLInputElement) {
    if (window.innerWidth < 1024) {
      // lg breakpoint
      drawer.checked = false;
    }
  }
}
