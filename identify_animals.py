import json
from pathlib import Path

import open_clip
import torch
from PIL import Image

ANIMALS = [
    "cat", "dog", "wolf", "fox", "bear", "lion", "tiger", "leopard", "cheetah", "jaguar",
    "lynx", "puma", "rabbit", "hare", "mouse", "rat", "squirrel", "chipmunk", "hamster",
    "hedgehog", "panda", "koala", "sloth", "monkey", "gorilla", "chimpanzee", "orangutan",
    "lemur", "raccoon", "badger", "otter", "beaver", "skunk", "weasel", "ferret", "red panda",
    "elephant", "giraffe", "hippopotamus", "rhinoceros", "horse", "zebra", "donkey", "camel",
    "llama", "alpaca", "goat", "sheep", "cow", "bull", "bison", "buffalo", "yak", "deer",
    "elk", "moose", "reindeer", "antelope", "gazelle", "boar", "pig", "wild boar", "kangaroo",
    "wallaby", "wombat", "koala", "opossum", "bat", "owl", "eagle", "falcon", "hawk",
    "penguin", "duck", "goose", "swan", "flamingo", "peacock", "ostrich", "emu", "heron",
    "crane", "parrot", "toucan", "crow", "raven", "pigeon", "seagull", "dove", "dodo",
    "turtle", "tortoise", "crocodile", "alligator", "lizard", "chameleon", "gecko", "iguana",
    "snake", "python", "anaconda", "dragon", "dinosaur", "kangaroo rat", "armadillo", "anteater",
    "porcupine", "platypus", "otter", "seal", "sea lion", "walrus", "dolphin", "whale", "shark",
    "stingray", "octopus", "squid", "lobster", "crab", "shrimp", "starfish", "seahorse",
    "goldfish", "koi", "salmon", "trout", "frog", "toad", "salamander", "newt", "axolotl",
    "horse", "pony", "unicorn", "griffin", "phoenix"
]

PROMPTS = [
    f"a grayscale cartoon of a {animal} dressed as a medieval soldier"
    for animal in ANIMALS
]

model, preprocess, _ = open_clip.create_model_and_transforms("ViT-B-32", pretrained="openai")
tokenizer = open_clip.get_tokenizer("ViT-B-32")
text_tokens = tokenizer(PROMPTS)

with torch.no_grad():
    text_features = model.encode_text(text_tokens)
    text_features /= text_features.norm(dim=-1, keepdim=True)

soldier_dir = Path("soldier")
results = {}

for image_path in sorted(soldier_dir.glob("*.png")):
    image = preprocess(Image.open(image_path).convert("RGB")).unsqueeze(0)
    with torch.no_grad():
        image_features = model.encode_image(image)
        image_features /= image_features.norm(dim=-1, keepdim=True)
        similarities = (image_features @ text_features.T).squeeze(0)
        top_values, top_indices = torch.topk(similarities, k=5)
    top = []
    print(image_path.name)
    for value, idx in zip(top_values.tolist(), top_indices.tolist()):
        label = ANIMALS[idx]
        score = float(value)
        top.append({"label": label, "score": score})
        print(f"  {label:15s} {score:.4f}")
    results[image_path.name] = top

with open("animal_classification.json", "w", encoding="utf-8") as f:
    json.dump(results, f, ensure_ascii=False, indent=2)
