import os

directories = ["src/app/api", "src/components", "src/db", "src/app"]
for d in directories:
    print(f"--- {d} ---")
    if os.path.exists(d):
        for root, dirs, files in os.walk(d):
            if root == d:
                print(f"Dirs: {len(dirs)}, Files: {len(files)}")
