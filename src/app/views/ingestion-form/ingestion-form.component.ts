import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpEventType } from '@angular/common/http';

import { DialogService } from 'primeng/dynamicdialog';
import { FileSelectEvent, FileUploadHandlerEvent } from 'primeng/fileupload/fileupload.interface';

import { NgEventBus, MetaData } from 'ng-event-bus';

import { ContextService } from '../../shared/services/context.service';
import { ResourceService } from '../../shared/services/resource.service';

import { ResourceTypePipe } from '../../shared/pipe/resource-type.pipe';
import { EventType } from '../../shared/enum/event-type.enum';
import { ResourceFile } from '../../shared/models/resource-file.model';

@Component({
    templateUrl: './ingestion-form.component.html',
    providers: [DialogService, ResourceTypePipe]
})
export class IngestionFormComponent implements OnInit { 
    subscriptionEvents: any;
    eventType = EventType;
    
    @ViewChild('fileUpload', {static: false}) 
    fileUpload: any;
    
    caseInformation: any;
    paymentInformation: any;

    resourceTypes: any[] = [];
    resourceFiles: ResourceFile[] = [];
  
  selectedResourceType: any;
    resourceDescription: string;
    
    private fillSelectors() {
        this.resourceTypes = this.resourceTypePipe.getList();
        
        this.selectedResourceType = this.resourceTypes[0].id;
    }
    
    private finalizedUpload() {    
        let uploadedFiles = 0;
        let errors = 0;

        // check if exist some error when all files are managed
        this.resourceFiles.forEach((resourceFile: ResourceFile) => {
            if (resourceFile.progress == 100)
                uploadedFiles++;
            
            if (resourceFile.errorMessage)
                errors++;
            
            if (this.resourceFiles.length == uploadedFiles) {
                if (errors == 0) {
                    //this.messageService.add({ severity: 'success', summary: 'All files uploaded', detail: '' });

                    this.router.navigate(['/ingestion']);
                }
                else if (errors > 0 && errors < this.resourceFiles.length) {
                    //this.messageService.add({ severity: 'warn', summary: 'Some files not uploaded with errors', detail: '' });
                }
                else {
                    //this.messageService.add({ severity: 'error', summary: 'Any file uploaded', detail: '' });* /
                }                    
            }
        });
    }   
    
    private upload(index, resourceFile: ResourceFile): void {
        this.resourceService.uploadResources(
                this.contextService.getContext().organizationId,
                this.contextService.getContext().projectId,
                this.contextService.getContext().caseId,
                resourceFile.type,
                resourceFile.description,
                resourceFile.file).subscribe({
            next: (event: any) => {
                if (event.type === HttpEventType.UploadProgress) {
                    console.log(event);
                    
                    const percentDone = event.total ? Math.round(100 * event.loaded / event.total) : 0;
                    
                    this.resourceFiles[index].eventType = event.type;
                    this.resourceFiles[index].progress = percentDone;
                } else if (event.type === HttpEventType.Response) {
                    console.log(event.body); 
                    
                    // recover response event
                    let responseFiles: any[] = event.body;

                    // fill resource file uploaded with respose event data
                    this.resourceFiles[index].eventType = responseFiles[0].type;
                    this.resourceFiles[index].size = responseFiles[0].size;
                    this.resourceFiles[index].status = event.status;
                    this.resourceFiles[index].errorMessage = responseFiles[0].errorMessage;

                    // check upload state
                    this.finalizedUpload();
                }
            },
            error: (err: any) => {
                console.error(err);                
            }
        });
    }
    
    private existResourceFileErrors() {
        let errorMessages: number = 0;

        this.resourceFiles.forEach((resourceFile: ResourceFile) => {
            if (resourceFile.errorMessage !== "")
                errorMessages++;
        });

        if (errorMessages > 0)
            return true;
        
        return false;
    }

    constructor(
        private router: Router, private route: ActivatedRoute, private eventBus: NgEventBus,
        private dialogService: DialogService, private resourceService: ResourceService,
        private contextService: ContextService, private resourceTypePipe: ResourceTypePipe) {         
    }            
    
    ngOnInit() {   
        this.fillSelectors();
    }

    onResourceType(event) {
        this.resourceDescription = "";
    }

    onSelectFiles(fileSelectEvent: FileSelectEvent): void {
        for (let index = 0; index < fileSelectEvent.files.length; index++) {
            this.resourceFiles.push(
                {
                index: index,
                name: fileSelectEvent.files[index].name,
                size: fileSelectEvent.files[index].size,
                file: fileSelectEvent.files[index],
                type: this.selectedResourceType,
                description: this.resourceDescription,
                progress: 0
                }); 
        }
    }

    onRemoveFile(file: any) {
        this.resourceFiles = this.resourceFiles.filter((resourceFile: ResourceFile) => resourceFile.index != file.index);
    }

    onUploadFiles(event: FileUploadHandlerEvent): void {         
        for (let index = 0; index < this.resourceFiles.length; index++) {      
            this.upload(index, this.resourceFiles[index]);
        }
    }
    
    onClearFiles(event: Event): void {
        this.resourceFiles = [];
    }
        
    onResource(event: Event) {        
    }

    onCloseResource(event: Event) {
        this.router.navigate(['/ingestion']);
    }
    
    ngOnDestroy(): void {
        if(this.subscriptionEvents)
            this.subscriptionEvents.unsubscribe();
    }    
}