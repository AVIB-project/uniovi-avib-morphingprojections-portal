import { Resource } from "./resource.model";

export interface OrganizationCase {
    organizationId?: string;
    organizationName?: string;
    organizationDescription?: string;
    projectId?: string;
    projectName?: string;
    projectDescription?: string;
    caseId?: string;
    caseName?: string;
    caseDescription?: string;
    caseType?: string;
    caseCreationBy?: string;
    caseCreationDate?: string;
    caseUpdatedBy?: string;
    caseUpdatedDate?: string;    
    caseResources?: Resource[];
}