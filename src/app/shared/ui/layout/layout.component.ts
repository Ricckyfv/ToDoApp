import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { AuthStateService } from '../../data-access/auth-state.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterModule, RouterLink],
  templateUrl: './layout.component.html',
  styles: ``
})
export default class LayoutComponent {


  private _authState = inject(AuthStateService);
  private _router = inject(Router);

  async logOut(){
    await this._authState.logOut();
    this._router.navigateByUrl('/auth/sign-in');
  }

}
