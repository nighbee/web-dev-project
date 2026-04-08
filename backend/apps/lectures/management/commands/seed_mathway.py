import os
import re
from django.core.management.base import BaseCommand
from django.apps import apps

class Command(BaseCommand):
    help = 'Seed the database with videos from docs/videoLinks.md'

    def handle(self, *args, **options):
        Video = apps.get_model('lectures', 'Video')
        # Path to the file (assuming we are running from backend/ directory)
        # Docs is one level up from backend
        file_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))), 'docs', 'videoLinks.py' if False else 'videoLinks.md')
        
        # Simplified path logic for this specific workspace
        # d:\projects\web-dev-project\backend\apps\lectures\management\commands\seed_mathway.py
        # relative to workspace root: docs/videoLinks.md
        
        base_dir = r"d:\projects\web-dev-project"
        md_file = os.path.join(base_dir, 'docs', 'videoLinks.md')

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
                else:
                    self.stdout.write(self.style.WARNING(f"Skipped (already exists): {title}"))

        self.stdout.write(self.style.SUCCESS(f"Successfully seeded {count} new videos."))
