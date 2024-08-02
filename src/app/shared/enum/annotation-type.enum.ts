let AnnotationType = ["string", "numeric", "boolean", "datetime", "enumeration"]; 

export type AnnotationTypeType = typeof AnnotationType[number];

export enum AnnotationTypeEnum {
    "String" = "string",
    "Link" = "link",
    "Numeric" = "numeric",
    "Boolean" = "boolean",
    "Datetime" = "datetime",
    "Enumeration" = "enumeration"
}