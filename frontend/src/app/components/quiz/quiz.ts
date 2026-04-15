import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services';
import { IQuiz, IQuestion, IQuizSubmission, IQuizResult } from '../../models';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './quiz.html',
  styleUrls: ['./quiz.css']
})
export class QuizComponent implements OnInit, OnDestroy {
  quiz: IQuiz | null = null;
  videoId: number | null = null;
  userAnswers: { [key: string]: number } = {};
  loading = true;
  error = '';
  submitted = false;
  result: IQuizResult | null = null;
  currentQuestionIndex = 0;

  private destroy$ = new Subject<void>();

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.videoId = Number(this.route.snapshot.paramMap.get('videoId'));
    console.log('Quiz Component Init - videoId:', this.videoId);
    if (this.videoId) {
      this.loadQuiz();
    } else {
      this.error = 'Video ID not found';
      this.loading = false;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadQuiz(): void {
    if (!this.videoId) return;
    
    this.loading = true;
    this.error = '';
    
    console.log('loadQuiz: Starting to load quiz for videoId:', this.videoId);
    
    this.apiService.getQuiz(this.videoId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (quiz) => {
          console.log('loadQuiz: Quiz received:', quiz);
          this.quiz = quiz;
          this.loading = false;
          this.cdr.detectChanges();
          console.log('loadQuiz: Loading complete, quiz is now:', this.quiz);
        },
        error: (err) => {
          console.error('loadQuiz: Error occurred:', err);
          this.error = err.message || 'Ошибка загрузки quiz';
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
  }

  selectAnswer(questionId: number, choiceId: number): void {
    this.userAnswers[questionId.toString()] = choiceId;
  }

  getSelectedAnswer(questionId: number): number | undefined {
    return this.userAnswers[questionId.toString()];
  }

  submitQuiz(): void {
    if (!this.quiz || !this.videoId) return;

    // Check if all questions are answered
    const unansweredCount = this.quiz.questions.filter(
      (q) => !this.userAnswers[q.id.toString()]
    ).length;

    if (unansweredCount > 0) {
      this.error = `Пожалуйста, ответьте на все ${unansweredCount} вопрос(ов)`;
      return;
    }

    const submission: IQuizSubmission = {
      answers: this.userAnswers
    };

    this.loading = true;
    this.apiService.submitQuiz(this.videoId, submission)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result) => {
          this.result = result;
          this.submitted = true;
          this.loading = false;
        },
        error: (err) => {
          this.error = err.message || 'Ошибка отправки quiz';
          this.loading = false;
        }
      });
  }

  nextQuestion(): void {
    if (this.quiz && this.currentQuestionIndex < this.quiz.questions.length - 1) {
      this.currentQuestionIndex++;
    }
  }

  previousQuestion(): void {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
    }
  }

  goBackToVideo(): void {
    if (this.videoId) {
      this.router.navigate(['/videos', this.videoId]);
    }
  }

  getProgressPercentage(): number {
    if (!this.quiz) return 0;
    const answered = Object.keys(this.userAnswers).length;
    return Math.round((answered / this.quiz.questions.length) * 100);
  }
}
