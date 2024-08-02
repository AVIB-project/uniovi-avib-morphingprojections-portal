import { Project } from "./project.model";

export interface Organization {
    id: string;
    name: string;
    description?: string;
    creationBy: string;
    creationDate: string;
    updatedBy: string;
    updatedDate: string;
    projects: Project[];
}