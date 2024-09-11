export interface Job {
    jobId: string;
    caseId: string;
    name: string;
    image: string;
    version: string;
    state: string;
    diffTime: string;
    jobCreationDate: string;
    jobFinalizeDate: string;
    creationBy: string;
    creationDate: string;
    updatedBy: string;
    updatedDate: string;
}