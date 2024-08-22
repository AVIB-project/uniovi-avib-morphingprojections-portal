import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Validators, FormBuilder } from '@angular/forms';

import { ContextService } from '../../shared/services/context.service';
import { UserService } from '../../shared/services/user.service';
import { User } from '../../shared/models/user.model';

import { EventType } from '../../shared/enum/event-type.enum';
import { RolePipe } from '../../shared/pipe/role.pipe';
import { LanguagePipe } from '../../shared/pipe/language.pipe';

@Component({
    templateUrl: './user-form.component.html',
    providers: [
        RolePipe,
        LanguagePipe
    ]     
})
export class UserFormComponent implements OnInit {     
    subscriptionEvents: any;    
    eventType = EventType;
    
    languages: any[] = [];
    roles: any[] = [];
    userId: string;
    user: User;

    userFormGroup = this.fb.group({
        userId: [null],
        organizationId: [''],
        externalId: [null],
        username: ['', Validators.required],
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        address: [''],
        city: [''],
        country: [''],
        phone: [''],
        notes: [''],
        language: ['', Validators.required],
        role: ['', Validators.required],
        active: [true, Validators.required]
    });
    
    constructor(
        private router: Router, private route: ActivatedRoute, private fb: FormBuilder,
        private contextService: ContextService, private userService: UserService,
        private rolePipe: RolePipe, private languagePipe: LanguagePipe) {
    }

    ngOnInit(): void {
        this.languages = this.languagePipe.getList();
        this.roles = this.rolePipe.getList();

        this.userFormGroup.controls.active.setValue(true);

        this.route.params.subscribe(params => {
            this.userId = params['id'];

            if (this.userId) {
                //this.userService.getUserById(this.userId)
                this.userService.getUserByExternalId(this.userId)
                    .subscribe((user: any) => {
                        console.log(user);

                        if (user) {
                            this.userFormGroup.setValue(user);
                        }
                });
            }
        });        
    }

    onCancelUser() {
        this.router.navigate(['/user'])
    }
    
    onAddUser() {
        // set the final organization Id
        this.userFormGroup.controls.organizationId.setValue(this.contextService.getContext().organizationId);
        
        this.userService.saveUser(this.userFormGroup.value)
            .subscribe((userId: any) => {
                console.log(userId);

                this.router.navigate(['/user']);
            });
    }
}