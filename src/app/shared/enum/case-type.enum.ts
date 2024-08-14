let _CaseType = ["PUBLIC", "PRIVATE"]; 

export type CaseType = typeof _CaseType[number];

export enum CaseTypeEnum {
    "Public" = "PUBLIC",
    "Private" = "PRIVATE"
}