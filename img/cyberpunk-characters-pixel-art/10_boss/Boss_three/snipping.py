import os
from PIL import Image

base_path = r"C:\Users\Kay\Desktop\developerakademie\Projekte\El-Pollo-Loco\img\cyberpunk-characters-pixel-art\10_boss\Boss_three"
file = "BOOM_bomb.png"

frame_width = 48
frame_height = 48

img_path = os.path.join(base_path, file)
img = Image.open(img_path)
num_frames = img.width // frame_width

# Output-Verzeichnis: z. B. /frames/BOOM_bomb/
output_dir = os.path.join(base_path, "frames", file.replace(".png", ""))
os.makedirs(output_dir, exist_ok=True)

for i in range(num_frames):
    frame = img.crop((i * frame_width, 0, (i + 1) * frame_width, frame_height))
    frame_name = f"{file.replace('.png', '')}_frame_{i+1}.png"
    frame.save(os.path.join(output_dir, frame_name))

print("✅ BOOM_bomb Frames erfolgreich extrahiert!")
