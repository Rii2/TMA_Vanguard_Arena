from pathlib import Path

mapping = {
    "0 1.png": "cat",
    "0 2.png": "red panda",
    "0 3.png": "buffalo",
    "0 4.png": "panda",
    "0 5.png": "fox",
    "0 6.png": "lynx",
    "0 7.png": "koala",
    "0 8.png": "donkey",
    "0 9.png": "lynx",
    "0 10.png": "monkey",
    "0 11.png": "elephant",
    "0 12.png": "mouse",
    "0 13.png": "opossum",
    "0 14.png": "panda",
    "0 15.png": "pig",
    "0 16.png": "rabbit",
    "0 17.png": "raccoon",
    "0 18.png": "rhinoceros",
    "0 19.png": "dog",
    "0 20.png": "sheep",
    "0 21.png": "red panda",
    "0 22.png": "puma",
    "0 23.png": "kangaroo",
    "0 24.png": "tiger",
    "0 25.png": "fox",
}

soldier_dir = Path('soldier')
counts = {}
renamed = []

for name in sorted(mapping.keys(), key=lambda s: int(s.split()[1].split('.')[0])):
    base = mapping[name]
    slug = base.lower().replace(' ', '-').replace("'", '')
    counts[slug] = counts.get(slug, 0) + 1
    index = counts[slug]
    if index > 1:
        new_name = f"{slug}-{index}.png"
    else:
        new_name = f"{slug}.png"
    src = soldier_dir / name
    dst = soldier_dir / new_name
    if dst.exists():
        raise FileExistsError(f"Target {dst} already exists")
    src.rename(dst)
    renamed.append((name, new_name, base, index))

log_path = Path('rename_log.txt')
with log_path.open('w', encoding='utf-8') as f:
    for original, new_name, base, index in renamed:
        suffix = f" ({index})" if counts[base.lower().replace(' ', '-').replace("'", '')] > 1 else ''
        f.write(f"{original} -> {new_name} [{base}{suffix}]\n")
