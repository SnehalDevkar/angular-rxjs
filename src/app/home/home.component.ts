import {Component, OnInit} from '@angular/core';
import {Course, sortCoursesBySeqNo} from '../model/course';
import {interval, noop, Observable, of, throwError, timer} from 'rxjs';
import {catchError, delay, delayWhen, filter, finalize, map, retryWhen, shareReplay, tap} from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {CourseDialogComponent} from '../course-dialog/course-dialog.component';
import { CourseService } from '../services/course.service';
import { LoadingService } from '../loading/loading.service';
import { MessagesService } from '../services/messages.service';


@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  beginnerCourses$:Observable<Course[]>;

  advancedCourses$: Observable<Course[]>;


  constructor(private courseService: CourseService, 
    private messagesService: MessagesService,
  private loadingService: LoadingService) {

  }

  ngOnInit() {

    this.reloadCourses();
  }



  reloadCourses() {
    // this.loadingService.loadingOn();

    const courses$ = this.courseService.loadCourses()
    .pipe(
      map(courses => courses.sort(sortCoursesBySeqNo)),
      catchError(err => {
        const message = "Could not load courses"
        this.messagesService.showErrors(message)
        return throwError(err);
      })
      // finalize(() => this.loadingService.loadingOff())
    );

    const loadCourses$ = this.loadingService.showLoaderUntilComplete(courses$)

    this.beginnerCourses$ = loadCourses$.pipe(map(courses => courses.filter(course => course.category == "BEGINNER")));

    this.advancedCourses$ = loadCourses$.pipe(map(courses => courses.filter(course => course.category == 'ADVANCED')));
  }
}




