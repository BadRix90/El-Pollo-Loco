import os
from PIL import Image

# Pfad zum Hauptverzeichnis
base_path = r"C:\Users\Kay\Desktop\developerakademie\Projekte\El-Pollo-Loco\img\cyberpunk-characters-pixel-art"

# Liste der Unterordner mit den Charakteren
character_dirs = ["1 Biker", "2 Punk", "3 Cyborg", "10_Boss"]

# Frame-Größe (wenn überall gleich)
frame_width = 48  # oder anpassen
frame_height = 48

for folder in character_dirs:
    full_path = os.path.join(base_path, folder)
    for file in os.listdir(full_path):
        if file.endswith(".png"):
            img_path = os.path.join(full_path, file)
            img = Image.open(img_path)
            num_frames = img.width // frame_width

            # Output-Ordner für Frames
            output_dir = os.path.join(full_path, "frames", file.replace(".png", ""))
            os.makedirs(output_dir, exist_ok=True)

            for i in range(num_frames):
                frame = img.crop((i * frame_width, 0, (i + 1) * frame_width, frame_height))
                frame.save(os.path.join(output_dir, f"{file.replace('.png', '')}_frame_{i+1}.png"))

print("Alle Frames erfolgreich extrahiert!")
