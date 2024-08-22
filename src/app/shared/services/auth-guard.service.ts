import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';

import { KeycloakAuthGuard, KeycloakService } from 'keycloak-angular';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard extends KeycloakAuthGuard {

  constructor(router: Router, keycloakAngular: KeycloakService) {
    super(router, keycloakAngular)
  }

  public async isAccessAllowed(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) {
    // Force the user to log in if currently unauthenticated.
    if (!this.authenticated) {
      await this.keycloakAngular.login();
    }

    // Get the request data
    const keycloakId = (await this.keycloakAngular.loadUserProfile()).id;
    const userId = route.params['id'];
    const routePath = route.routeConfig.path;
    const requiredRoles = route.data['roles'];

    // Allow the user to proceed if no additional roles are required to access the route.
    if (!Array.isArray(requiredRoles) || requiredRoles.length === 0) {
      return true;
    }
    
    let pass = requiredRoles.some((role) => {
      if (routePath != "user-form") {
        return this.roles.includes(role);
      }
      else {
        if (userId) {
          // user form edition mode only if you are the owner of the profile
          if (this.roles.includes(role) || keycloakId == userId)
            return true;
          else 
            return false;          
        }
        else {
          // user form creation mode only if your have the roles
          if (this.roles.includes(role))
            return true;
          else
            return false;
        }
      }
    });

    // Allow the user to proceed if some of the required roles are present.
    //return requiredRoles.some((role) => this.roles.includes(role));
    return pass;
  }  
}