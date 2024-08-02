let AnnotationProjection = ["circle", "horizontal", "vertical"]; 

export type AnnotationProjectionType = typeof AnnotationProjection[number];

export enum AnnotationProjectionEnum {
    "Circle" = "circle",
    "Horizontal" = "horizontal",
    "Vertical" = "vertical"
}