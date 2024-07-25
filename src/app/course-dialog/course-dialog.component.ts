import {AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import {Course} from "../model/course";
import {FormBuilder, Validators, FormGroup} from "@angular/forms";
import moment from 'moment';
import {catchError} from 'rxjs/operators';
import {throwError} from 'rxjs';
import { CourseService } from '../services/course.service';
import { LoadingService } from '../loading/loading.service';
import { MessagesService } from '../services/messages.service';

@Component({
    selector: 'course-dialog',
    templateUrl: './course-dialog.component.html',
    styleUrls: ['./course-dialog.component.css'],
    providers: [MessagesService]
})
export class CourseDialogComponent implements AfterViewInit {

    form: FormGroup;

    course:Course;

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<CourseDialogComponent>,
        @Inject(MAT_DIALOG_DATA) course:Course,
        private courseService: CourseService,
        private messagesService: MessagesService) {

        this.course = course;

        this.form = fb.group({
            description: [course.description, Validators.required],
            category: [course.category, Validators.required],
            releasedAt: [moment(), Validators.required],
            longDescription: [course.longDescription,Validators.required]
        });

    }

    ngAfterViewInit() {

    }

    save() {

      const changes = this.form.value;

      this.courseService.saveCourse(this.course.id, changes)
      .pipe(
        catchError(err => {
            const message = "Could not save course"
            this.messagesService.showErrors(message)
            return throwError(err);
        })
      )
      .subscribe((val) =>{
        this.dialogRef.close(val)
      })

    }

    close() {
        this.dialogRef.close();
    }

}
