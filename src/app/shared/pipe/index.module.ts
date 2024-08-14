import { NgModule } from '@angular/core';

import { AnnotationGroupPipe } from './annotation-group.pipe';
import { AnnotationSpacePipe } from './annotation-space.pipe';
import { AnnotationTypePipe } from './annotation-type.pipe';
import { AnnotationEncodingPipe } from './annotation-encoding.pipe';
import { AnnotationProjectionPipe } from './annotation-projection.pipe';
import { ResourceTypePipe } from './resource-type.pipe';
import { RolePipe } from './role.pipe';
import { LanguagePipe } from './language.pipe';
import { CaseTypePipe } from './case-type.pipe';

@NgModule({
  imports: [],
  declarations: [
    AnnotationGroupPipe,
    AnnotationSpacePipe,
    AnnotationTypePipe,
    AnnotationEncodingPipe,
    AnnotationProjectionPipe,
    ResourceTypePipe,
    RolePipe,
    LanguagePipe,
    CaseTypePipe,
  ],
  exports: [
    AnnotationGroupPipe,
    AnnotationSpacePipe,
    AnnotationTypePipe,
    AnnotationEncodingPipe,
    AnnotationProjectionPipe,
    ResourceTypePipe,
    RolePipe,
    LanguagePipe,
    CaseTypePipe
  ]
})
export class PipesModule { }
