export interface IChoice {
  id: number;
  text: string;
}

export interface IQuestion {
  id: number;
  text: string;
  choices: IChoice[];
}

export interface IQuiz {
  id: number;
  title: string;
  questions: IQuestion[];
}

export interface IQuizSubmission {
  answers: { [key: string]: number }; // question_id: choice_id
}

export interface IQuizResult {
  score: number;
  total_questions: number;
  new_total_points: number;
}
