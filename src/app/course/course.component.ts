import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Course} from '../model/course';
import {
  debounceTime,
  distinctUntilChanged,
  startWith,
  tap,
  delay,
  map,
  concatMap,
  switchMap,
  withLatestFrom,
  concatAll, shareReplay, catchError
} from 'rxjs/operators';
import {merge, fromEvent, Observable, concat, throwError, combineLatest} from 'rxjs';
import {Lesson} from '../model/lesson';
import { CourseService } from '../services/course.service';
import { CourseData } from '../model/courseData';


@Component({
  selector: 'course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit {

  course$: Observable<Course>;

  lessons$: Observable<Lesson[]>;

  data$: Observable<CourseData>;

  constructor(private route: ActivatedRoute,
    private courseService: CourseService
  ) {


  }

  ngOnInit() {

    const courseId = parseInt(this.route.snapshot.paramMap.get("courseId"));
    this.course$ = this.courseService.loadCourseById(courseId).pipe(startWith(null));
    this.lessons$ = this.courseService.loadAllCourseLessons(courseId).pipe(startWith([]));
    this.data$ = combineLatest([this.course$, this.lessons$])
                .pipe(
                  map(([course, lessons]) => {
                    return {
                      course,
                      lessons
                    }
                  })
                )
  }


}











