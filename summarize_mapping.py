import json
from collections import Counter

with open('animal_classification.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

mapping = {name: entries[0]['label'] for name, entries in data.items()}
for name in sorted(mapping):
    print(f"{name}: {mapping[name]}")

print('\nCounts:')
for label, count in Counter(mapping.values()).most_common():
    print(f"{label}: {count}")
