import { Case } from "./case.model";

export interface Project {
    projectId: string;
    name: string;
    description?: string;
    creationBy: string;
    creationDate: string;
    updatedBy: string;
    updatedDate: string;    
    cases: Case[];
}