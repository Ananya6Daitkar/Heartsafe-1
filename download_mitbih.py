#!/usr/bin/env python3
"""
MIT-BIH Dataset Download Helper
Downloads the MIT-BIH ECG dataset from alternative sources
"""

import os
import sys
import urllib.request
import json

print("=" * 70)
print("MIT-BIH Dataset Download Helper")
print("=" * 70)
print()

# Try multiple sources
sources = [
    {
        "name": "PhysioNet (Primary)",
        "url": "https://physionet.org/files/mitdb/1.0.0/mitbih_test.csv",
        "description": "Official MIT-BIH database"
    },
    {
        "name": "GitHub Raw (Backup)",
        "url": "https://raw.githubusercontent.com/shayanfazeli/heartbeat/master/mitbih_test.csv",
        "description": "Community mirror"
    },
    {
        "name": "Kaggle Dataset",
        "url": "https://www.kaggle.com/datasets/shayanfazeli/heartbeat",
        "description": "Kaggle hosted version (requires login)"
    }
]

print("Available sources:")
print()
for i, source in enumerate(sources, 1):
    print(f"{i}. {source['name']}")
    print(f"   {source['description']}")
    print(f"   URL: {source['url']}")
    print()

print("=" * 70)
print()
print("OPTION 1: Download from GitHub (Easiest)")
print("-" * 70)
print()
print("Run this command:")
print()
print("  curl -o mitbih_test.csv https://raw.githubusercontent.com/shayanfazeli/heartbeat/master/mitbih_test.csv")
print()
print("Or in Python:")
print()
print("  import urllib.request")
print("  url = 'https://raw.githubusercontent.com/shayanfazeli/heartbeat/master/mitbih_test.csv'")
print("  urllib.request.urlretrieve(url, 'mitbih_test.csv')")
print()

print("=" * 70)
print()
print("OPTION 2: Download from Kaggle")
print("-" * 70)
print()
print("1. Go to: https://www.kaggle.com/datasets/shayanfazeli/heartbeat")
print("2. Click 'Download' button")
print("3. Extract the CSV file")
print("4. Place in project root directory")
print()

print("=" * 70)
print()
print("OPTION 3: Use PhysioNet Web Interface")
print("-" * 70)
print()
print("1. Go to: https://physionet.org/content/mitdb/1.0.0/")
print("2. Click 'Files' section")
print("3. Download 'mitbih_test.csv'")
print("4. Place in project root directory")
print()

print("=" * 70)
print()
print("After downloading, run:")
print()
print("  python model/testecg.py")
print()
print("This will extract 5 test cases (one per arrhythmia class)")
print()
