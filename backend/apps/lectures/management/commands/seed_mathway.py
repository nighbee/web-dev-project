import os
import re
import json
from django.core.management.base import BaseCommand
from django.apps import apps

from django.conf import settings

class Command(BaseCommand):
    help = 'Seed the database with videos from docs/videoLinks.md and quizzes from quiz_json'

    def handle(self, *args, **options):
        Video = apps.get_model('lectures', 'Video')
        Quiz = apps.get_model('lectures', 'Quiz')
        Question = apps.get_model('lectures', 'Question')
        Choice = apps.get_model('lectures', 'Choice')
        User = apps.get_model('auth', 'User')

        # Create Admin
        admin_user, created = User.objects.get_or_create(username='admin')
        if created or not admin_user.is_superuser:
            admin_user.set_password('admin')
            admin_user.is_staff = True
            admin_user.is_superuser = True
            admin_user.save()
            self.stdout.write(self.style.SUCCESS('Admin user "admin" created/updated.'))

        project_root = settings.BASE_DIR.parent
        md_file = project_root / 'docs' / 'videoLinks.md'

        # Load quiz JSON from the docs folder
        quiz_json_path = project_root / 'docs' / 'quizzes.json'
        quiz_arrays = []
        if os.path.exists(quiz_json_path):
            with open(quiz_json_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            # Each entry maps a video index to its questions array
            for entry in data.get('quizzes', []):
                quiz_arrays.append(entry['questions'])
            self.stdout.write(self.style.SUCCESS(f'Loaded {len(quiz_arrays)} quiz arrays from quiz_json.md'))
        else:
            self.stdout.write(self.style.WARNING(f'Quiz JSON file not found: {quiz_json_path}'))

        if not os.path.exists(md_file):
            self.stdout.write(self.style.ERROR(f"File not found: {md_file}"))
            return

        with open(md_file, 'r', encoding='utf-8') as f:
            lines = f.readlines()

        # Regex to find youtube_id
        # Example line: 1. Lesson 1: <https://youtu.be/MRjeHY4jp6Q?si=thyxfs5QDSGpNwqG> Lesson 1: GCD...
        pattern = re.compile(r'https://youtu\.be/([a-zA-Z0-9_-]+)(?:\?[^>\s]+)?')

        count = 0
        video_index = 0
        for line in lines:
            line = line.strip()
            if not line or 'https' not in line:
                continue

            match = pattern.search(line)
            if match:
                youtube_id = match.group(1)
                remaining = line[match.end():].strip()
                title = remaining.lstrip('>').strip()
                title = re.sub(r'^Lesson\s+\d+:\s*', '', title)

                video, created = Video.objects.get_or_create(
                    youtube_id=youtube_id,
                    defaults={'title': title}
                )

                if created:
                    self.stdout.write(self.style.SUCCESS(f"Created: {title}"))
                    count += 1
                else:
                    self.stdout.write(self.style.WARNING(f"Video already exists: {title}"))

                # Always assign quiz by index (works for both new and existing videos)
                if video_index < len(quiz_arrays):
                    questions_data = quiz_arrays[video_index]
                    quiz, quiz_created = Quiz.objects.get_or_create(
                        video=video,
                        defaults={'title': f"Quiz: {title}"}
                    )
                    if quiz_created:
                        for q_data in questions_data:
                            question = Question.objects.create(quiz=quiz, text=q_data['text'])
                            for choice_data in q_data['choices']:
                                Choice.objects.create(
                                    question=question,
                                    text=choice_data['text'],
                                    is_correct=choice_data['is_correct']
                                )
                        self.stdout.write(self.style.SUCCESS(f"  Quiz with {len(questions_data)} questions created"))
                    else:
                        self.stdout.write(self.style.WARNING(f"  Quiz already exists for video index {video_index}"))
                else:
                    self.stdout.write(self.style.WARNING(f"  No quiz JSON found for video index {video_index}"))

                video_index += 1

        self.stdout.write(self.style.SUCCESS(f"Successfully seeded {count} new videos."))
