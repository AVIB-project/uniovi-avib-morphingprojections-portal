import { AnnotationGroupType } from '../enum/annotation-group.enum';
import { AnnotationSpaceType } from '../enum/annotation-space.enum';
import { AnnotationEncodingType } from '../enum/annotation-encoding.enum';
import { AnnotationTypeType } from '../enum/annotation-type.enum';

export interface Annotation {
    annotationId?: string;
    caseId: string;
    group?: AnnotationGroupType;
    space?: AnnotationSpaceType;
    precalculated: boolean;
    projectedByAnnotation?: string;
    projectedByAnnotationValue?: string;
    encoding?: AnnotationEncodingType;
    encodingName?: string;
    type?: AnnotationTypeType;    
    name?: string;
    label?: object;
    description?: string;
    values?: Array<string>;
    projection?: string;
    colorized: boolean;
    required: boolean;
}