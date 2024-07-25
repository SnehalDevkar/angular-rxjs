import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of, throwError } from "rxjs";
import { Course, sortCoursesBySeqNo } from "../model/course";
import { catchError, filter, map, shareReplay, tap } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { LoadingService } from "../loading/loading.service";
import { MessagesService } from "./messages.service";
import { CourseService } from "./course.service";

@Injectable({
    providedIn: 'root'
})

export class CourseStore{

    private subject = new BehaviorSubject<Course[]>([]);
    courses$: Observable<Course[]> = this.subject.asObservable();

    constructor(
        private http: HttpClient,
        private loading: LoadingService,
        private message: MessagesService,
        private courseService: CourseService
    ){
        this.loadAllCourses();
    }

    loadAllCourses(){
        const courses$ = this.courseService.loadCourses().pipe(
            catchError(err => {
                const message = "Could not load courses"
                this.message.showErrors(message)
                return throwError(err);
            }),
            tap(courses => this.subject.next(courses))
        );

        this.loading.showLoaderUntilComplete(courses$).subscribe();
    }

    saveCourse(courseId: string, changes: Partial<Course>): Observable<any>{
        const courses = this.subject.getValue();
        const index = courses.findIndex(course => course.id == courseId);

        const newCourse: Course = {
            ...courses[index],
            ...changes
        }

        const newCourses = courses.slice(0);

        newCourses[index] = newCourse;

        this.subject.next(newCourses);

        return this.http.put(`/api/courses/${courseId}`, changes)
        .pipe(
            catchError(err => {
                const message = "Could not save the course";
                this.message.showErrors(message);
                return throwError(err);
            }),
            shareReplay()
        );
    }

    filterByCategory(category: string): Observable<Course[]> {
        return this.courses$.pipe(
            map(courses => 
                courses.filter(course => course.category == category)
                .sort(sortCoursesBySeqNo)
            )
        )
    }
}
