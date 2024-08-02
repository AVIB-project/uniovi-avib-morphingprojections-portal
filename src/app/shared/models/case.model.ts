import { Resource } from "./resource.model";

export interface Case {
    id: string;
    name: string;
    description?: string;
    type?: string;
    resources: Resource[],
    creationBy: string;
    creationDate: string;
    updatedBy: string;
    updatedDate: string;
}