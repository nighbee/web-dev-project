import os
import re
from django.core.management.base import BaseCommand
from django.apps import apps

from django.conf import settings

class Command(BaseCommand):
    help = 'Seed the database with videos from docs/videoLinks.md'

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
        
        # Determine paths relative to the project root
        project_root = settings.BASE_DIR.parent
        md_file = project_root / 'docs' / 'videoLinks.md'

        if not os.path.exists(md_file):
            self.stdout.write(self.style.ERROR(f"File not found: {md_file}"))
            return

        with open(md_file, 'r', encoding='utf-8') as f:
            lines = f.readlines()

        # Regex to find: [youtube_id]
        # Example line: 1. Lesson 1: <https://youtu.be/MRjeHY4jp6Q?si=thyxfs5QDSGpNwqG> Lesson 1: GCD...
        # We need to stop at '>' or space for the URL parameters
        pattern = re.compile(r'https://youtu\.be/([a-zA-Z0-9_-]+)(?:\?[^>\s]+)?')

        count = 0
        for line in lines:
            line = line.strip()
            if not line or 'https' not in line:
                continue

            match = pattern.search(line)
            if match:
                youtube_id = match.group(1)
                # Title is everything after the match, but clean the possible closing markdown bracket
                remaining = line[match.end():].strip()
                title = remaining.lstrip('>').strip()

                # Clean title if it starts with "Lesson X:" again
                title = re.sub(r'^Lesson\s+\d+:\s*', '', title)

                video, created = Video.objects.get_or_create(
                    youtube_id=youtube_id,
                    defaults={'title': title}
                )
                
                if created:
                    self.stdout.write(self.style.SUCCESS(f"Created: {title}"))
                    count += 1
                    
                    # Create quiz for this video
                    quiz, quiz_created = Quiz.objects.get_or_create(
                        video=video,
                        defaults={'title': f"Quiz: {title}"}
                    )
                    
                    if quiz_created:
                        # Create sample questions
                        questions_data = [
                            {
                                "text": "Question 1?",
                                "choices": [
                                    {"text": "Option A", "is_correct": True},
                                    {"text": "Option B", "is_correct": False},
                                    {"text": "Option C", "is_correct": False},
                                ]
                            },
                            {
                                "text": "Question 2?",
                                "choices": [
                                    {"text": "Answer 1", "is_correct": False},
                                    {"text": "Answer 2", "is_correct": True},
                                    {"text": "Answer 3", "is_correct": False},
                                ]
                            }
                        ]
                        
                        for q_data in questions_data:
                            question = Question.objects.create(quiz=quiz, text=q_data['text'])
                            for choice_data in q_data['choices']:
                                Choice.objects.create(
                                    question=question,
                                    text=choice_data['text'],
                                    is_correct=choice_data['is_correct']
                                )
                        
                        self.stdout.write(self.style.SUCCESS(f"  Created quiz with 2 questions for: {title}"))
                else:
                    self.stdout.write(self.style.WARNING(f"Skipped (already exists): {title}"))

        self.stdout.write(self.style.SUCCESS(f"Successfully seeded {count} new videos."))
