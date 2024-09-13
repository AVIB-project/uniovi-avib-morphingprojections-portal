import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Validators, FormBuilder } from '@angular/forms';

import { DynamicDialogRef } from 'primeng/dynamicdialog';

import { ContextService } from '../../shared/services/context.service';
import { UserService } from '../../shared/services/user.service';
import { User } from '../../shared/models/user.model';

import { EventType } from '../../shared/enum/event-type.enum';
import { RolePipe } from '../../shared/pipe/role.pipe';
import { LanguagePipe } from '../../shared/pipe/language.pipe';

@Component({
    templateUrl: './user-invite-form.component.html',
    providers: [
        RolePipe,
        LanguagePipe
    ]     
})
export class UserInviteFormComponent implements OnInit {     
    subscriptionEvents: any;    
    eventType = EventType;
    
    isEditMode: boolean = false;
    languages: any[] = [];
    roles: any[] = [];
    userId: string;
    user: User;
    
    userInviteFormGroup = this.fb.group({
        email: ['', Validators.required],
    });
    
    constructor(
        private router: Router, private route: ActivatedRoute,  private dialog: DynamicDialogRef,
        public contextService: ContextService, private userService: UserService, private fb: FormBuilder,
        private languagePipe: LanguagePipe) {
    }

    ngOnInit(): void {
        this.languages = this.languagePipe.getList();
    }

    onCancelUser(event) {
        event.preventDefault();

        this.dialog.close({action: 'cancel'});   
    }
    
    onInviteUser(event) {
        event.preventDefault();
        
        this.dialog.close({action: 'invite', data: this.userInviteFormGroup.controls.email.value});
    }
}